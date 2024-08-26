import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import dayjs from 'dayjs'
import download from 'downloadjs'
import { isEmpty } from 'lodash'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { dateRangeToUtcFormatter } from 'common/utils'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import SurveyQuestionnaireFilter from 'features/surveyQuestionnaire/SurveyQuestionnaireFilter'
import SurveyQuestionnaireTable from 'features/surveyQuestionnaire/SurveyQuestionnaireTable'
import SetFeedbackModal from 'features/surveyQuestionnaire/feedbackModal/SetFeedbackModal'
import {
	IEditForm,
	IFilterForm,
	IQuestionnaireReportData,
	IQuestionnaireReportResponse,
} from './type'
import {
	useExportQuestionnaireReportMutation,
	useLazyGetQuestionnaireReportQuery,
	useSetQuestionnaireReportMutation,
} from './api'

const SurveyQuestionnaire = ({ pageTitle = '' }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm<IFilterForm>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission, editPermission } = {} } =
		useAuth()
	const [editForm] = Form.useForm<IEditForm>()
	const editModal = useModal()

	const [
		getQuestionnaireReport,
		{
			data: {
				data: questionnaire = [],
				rowCount: questionnaireTotal = 0,
			} = {} as IQuestionnaireReportResponse,
			isFetching: isGetQuestionnaireReportLoading,
		},
	] = useLazyGetQuestionnaireReportQuery()

	const [
		setQuestionnaireReport,
		{ isLoading: isSetQuestionnaireReportLoading },
	] = useSetQuestionnaireReportMutation()

	const [
		exportQuestionnaireReport,
		{ isLoading: isExportQuestionnaireReportLoading },
	] = useExportQuestionnaireReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: questionnaireTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, currencyId, userName } =
			await filterForm.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		const args = {
			siteId,
			userName,
			currencyId,
			startDate,
			endDate,
			pageNumber: current,
			pageSize,
		}
		try {
			await getQuestionnaireReport(args).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
			setQueryParams({
				timeZone: currentTimeZoneUtcOffset,
				...args,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		try {
			const { userName = '', currencyId = 0, startDate, endDate } = queryParams

			const blob = await exportQuestionnaireReport({
				siteId,
				currencyId: Number(currencyId),
				userName,
				startDate,
				endDate,
			}).unwrap()
			download(
				blob,
				`SurveyQuestionnaire_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleSetFeedbackClick = (record: IQuestionnaireReportData) => {
		editForm.setFieldsValue({
			id: record.id,
			userName: record.userName,
			contactInfo: record.contactInfo,
			content: record.content,
			feedback: record.feedback,
		})
		editModal.onOpen()
	}

	const handleUpdateFeedback = async () => {
		const { id, feedback } = await editForm.validateFields()
		try {
			const response = await setQuestionnaireReport({ id, feedback }).unwrap()
			message.success(response?.message || t('System.Label_Success'))
			editModal.onCancel()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const {
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
				currencyId = 0,
				userName = '',
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [dayjs(startDate), dayjs(endDate)],
				currencyId,
				userName,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
	}, [])

	const isTableLoading =
		isGetQuestionnaireReportLoading || isExportQuestionnaireReportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle} />

			<SurveyQuestionnaireFilter
				loading={isTableLoading}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{!isEmpty(queryParams) && (
				<SurveyQuestionnaireTable
					questionnaire={questionnaire}
					loading={isTableLoading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
					onEdit={handleSetFeedbackClick}
					editPermission={editPermission}
				/>
			)}

			<SetFeedbackModal
				open={editModal.visible}
				form={editForm}
				loading={isSetQuestionnaireReportLoading}
				editPermission={editPermission}
				onCancel={editModal.onCancel}
				onFinish={handleUpdateFeedback}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={isEmpty(queryParams) || !exportExcelPermission?.canUse}
					loading={isTableLoading}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default SurveyQuestionnaire

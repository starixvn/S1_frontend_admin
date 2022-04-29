import { useEffect } from 'react'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTimeZone, dateRangeToUtcFormatter } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import { AdjustmentLogReportFilter } from './AdjustmentLogReportFilter'
import { fetchLogReportListAsync } from './thunk'
import { AdjustmentLogReportTable } from './AdjustmentLogReportTable'
import {
	selectAdjustmentLogForm,
	selectAdjustmentLogReportStatus,
	setAdjustmentLogForm,
} from './slice'

const AdjustmentLogReport = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const [form] = Form.useForm()

	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const userSite = useAppSelector(selectUserSite)

	const adjustmentLogForm = useAppSelector(selectAdjustmentLogForm)
	const adjustmentLogReportStatus = useAppSelector(
		selectAdjustmentLogReportStatus
	)
	const paginationTotal = useAppSelector(
		state => state.adjustmentLogReport.paginationTotal
	)

	const [pagination, setPagination] = usePagination({ paginationTotal })

	const saveAdjustmentLogForm = (newForm: object) => {
		dispatch(setAdjustmentLogForm(newForm))
	}

	const onSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { actionTypes, currencyIds, menus, transId, userName, dateRange } =
			form.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			await dispatch(
				fetchLogReportListAsync({
					pageNumber: current,
					pageSize,
					actionTypes,
					currencyIds,
					menus,
					transId,
					userName,
					startDate,
					endDate,
					siteIds: userSite?.siteId ? [userSite?.siteId] : [],
				})
			)

			setPagination(prev => ({ ...prev, current, pageSize }))
			saveAdjustmentLogForm({
				...form.getFieldsValue(),
				dateRange: [startDate, endDate],
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await onSearch({ current, pageSize })
	}

	useEffect(() => {
		const setDefaultForm = () => {
			const { dateRange: [startDate, endDate] = [], ...fieldsValue } =
				adjustmentLogForm

			form.setFieldsValue({
				...fieldsValue,
				dateRange: [moment(startDate), moment(endDate)],
			})
		}

		if (Object.keys(adjustmentLogForm).length) {
			setDefaultForm()
		}
	}, [])

	const loading = adjustmentLogReportStatus === 'pending'

	return (
		<main>
			<LayoutContent.Title title={t('Label_AdjustmentLogReport')} />

			<AdjustmentLogReportFilter
				form={form}
				loading={loading}
				onSearch={onSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{adjustmentLogReportStatus !== 'idle' && (
				<AdjustmentLogReportTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</main>
	)
}

export default AdjustmentLogReport

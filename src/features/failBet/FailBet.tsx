import dayjs from 'dayjs'
import download from 'downloadjs'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig, Modal, Typography } from 'antd'
import { dateRangeToUtcFormatter, isJSON } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useGetTpIdListQuery } from 'common/service/allDataApi'
import {
	useLazyGetFailRecordReportQuery,
	useExportFailRecordReportMutation,
} from 'features/failBet/api'
import { IFilterForm } from 'features/failBet/type'
import FailBetFilter from 'features/failBet/FailBetFilter'
import FailBetTable from 'features/failBet/FailBetTable'
import ReactJson from 'react-json-view'

const FailBet = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm<IFilterForm>()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const {
		data: { data: tpIdList = [] } = {},
		isLoading: isGetTpIdListLoading,
	} = useGetTpIdListQuery(null)

	const [
		getFailRecordReport,
		{
			data: {
				data: failRecordReportList = [],
				rowCount: paginationTotal = 0,
			} = {},
			isFetching: isGetFailRecordReportFetching,
		},
	] = useLazyGetFailRecordReportQuery()

	const [
		exportFailRecordReport,
		{ isLoading: isExportFailRecordReportLoading },
	] = useExportFailRecordReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal,
	})

	const handleInfoModal = async (info: string) => {
		if (!isJSON(info)) return

		Modal.info({
			title: t('Label_Info'),
			closable: true,
			content: (
				<Typography.Text>
					{/* ReactJson 套件貌似無法處理客製化正負數字顏色 */}
					<ReactJson
						style={{ wordBreak: 'break-word' }}
						src={JSON.parse(info)}
						displayDataTypes={false}
					/>
				</Typography.Text>
			),
			width: '540px',
		})
	}

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return
		const { dateRange, ...args } = await form.validateFields()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		try {
			await getFailRecordReport({
				siteIds: [siteId],
				startTime,
				endTime,
				pageNumber: current,
				pageSize,
				...args,
			}).unwrap()
			setQueryParams({
				siteIds: [siteId],
				startTime,
				endTime,
				timeZone: timeZoneUtcOffset,
				pageNumber: current,
				pageSize,
				...args,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		if (!siteId) return

		const { currencyIds, startTime, endTime, tpIds, userName, transId } =
			queryParams

		try {
			const blob = await exportFailRecordReport({
				siteIds: [siteId],
				startTime,
				endTime,
				currencyIds: currencyIds?.map((values: string) => Number(values)),
				tpIds: tpIds?.map((values: string) => Number(values)),
				userName,
				transId,
			}).unwrap()
			download(
				blob,
				`ExportFailBetRecordReport_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
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
		})
	}

	const loading = isGetFailRecordReportFetching || isGetTpIdListLoading

	useEffect(() => {
		if (!loading) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(({ currencyId }) => currencyId),
				tpIds: tpIdList?.map(({ id }) => id),
			})
		}
	}, [isGetTpIdListLoading])

	useEffect(() => {
		// init
		const init = () => {
			const {
				currencyIds,
				startTime,
				endTime,
				pageNumber,
				pageSize,
				tpIds,
				userName,
				transId,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [dayjs(startTime), dayjs(endTime)],
				currencyIds: currencyIds
					? currencyIds?.map((values: string) => Number(values))
					: currencyListBySite?.map(({ currencyId }) => currencyId),
				tpIds: tpIds
					? tpIds?.map((values: string) => Number(values))
					: tpIdList?.map(({ id }) => id),
				userName,
				transId,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}

		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<FailBetFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				tpIdList={tpIdList}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<FailBetTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					failRecordReportList={failRecordReportList}
					onTableChange={handleTableChange}
					onChangeInfoModal={handleInfoModal}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportFailRecordReportLoading}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default FailBet

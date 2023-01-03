import moment from 'moment'
import download from 'downloadjs'
import { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter } from 'common/utils'
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
		isFetching: isGetTpIdListFetching,
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
			dateRange,
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
		const { dateRange, ...args } = await form.validateFields()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			const blob = await exportFailRecordReport({
				siteIds: [siteId],
				startTime,
				endTime,
				...args,
			}).unwrap()
			download(
				blob,
				`ExportFailBetRecordReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
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

	const loading = isGetFailRecordReportFetching || isGetTpIdListFetching

	useEffect(() => {
		if (!loading) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(({ currencyId }) => currencyId),
				tpIds: tpIdList?.map(({ id }) => id),
			})
		}
	}, [loading])

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
				dateRange: [moment(startTime), moment(endTime)],
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
					failRecordReportList={failRecordReportList}
					onTableChange={handleTableChange}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportFailRecordReportLoading}
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default FailBet

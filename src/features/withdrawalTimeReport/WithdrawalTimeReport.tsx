import moment from 'moment'
import download from 'downloadjs'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { isEmpty } from 'lodash'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import {
	PAGINATION,
	useQueryParams,
	usePagination,
	useAuth,
} from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { IFilterForm } from 'features/withdrawalTimeReport/type'
import {
	useLazyGetWithdrawalTimeReportListQuery,
	useExportWithdrawalTimeReportMutation,
} from 'features/withdrawalTimeReport/api'
import { WithdrawalTimeReportTable } from 'features/withdrawalTimeReport/WithdrawalTimeReportTable'
import { WithdrawalTimeReportFilter } from 'features/withdrawalTimeReport/WithdrawalTimeReportFilter'
import { WithdrawalTimeReportOverviewTable } from 'features/withdrawalTimeReport/WithdrawalTimeReportOverviewTable'

const WithdrawalTimeReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()

	const {
		data: { data: statusEnumList = [] } = {},
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({
		enumName: 'WithdrawalTimeStatusEnum',
	})

	const [
		exportWithdrawalTimeReport,
		{ isLoading: isExportWithdrawalTimeReportLoading },
	] = useExportWithdrawalTimeReportMutation()

	const [
		getWithdrawalTimeReport,
		{
			data: {
				data: withdrawalTimeReport = [],
				currencyAmountRecord: currencyAmountData = [],
				rowCount: withdrawalTimeReportTotal = 0,
			} = {},
			isFetching: isGetWithdrawalTimeReportLoading,
		},
	] = useLazyGetWithdrawalTimeReportListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: withdrawalTimeReportTotal,
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
		const { dateRange, statuses, memberId, withdrawalId, currencyIds } =
			filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getWithdrawalTimeReport({
				withdrawalId: withdrawalId || null,
				siteIds: siteId ? [siteId] : [],
				currencyId: currencyIds,
				status: statuses,
				memberId: memberId || null,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
			}).unwrap()
			setQueryParams({
				withdrawalId,
				currencyIds,
				statuses,
				memberId,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
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

	const handleExport = async () => {
		const {
			withdrawalId,
			currencyIds,
			statuses,
			memberId,
			startDate,
			endDate,
		} = queryParams

		try {
			const blob = await exportWithdrawalTimeReport({
				withdrawalId: withdrawalId || null,
				siteIds: siteId ? [siteId] : [],
				currencyId: currencyIds,
				status: statuses,
				memberId: memberId || null,
				startDate,
				endDate,
			}).unwrap()
			download(
				blob,
				`WithdrawalTimeReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isEmpty(queryParams) && !isGetStatusListLoading) {
			const {
				withdrawalId,
				currencyIds,
				statuses,
				memberId,
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds?.map((id: string) => Number(id)),
				statuses: statuses?.map((status: string) => Number(status)),
				withdrawalId,
				memberId,
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		} else if (!isGetStatusListLoading && isEmpty(queryParams)) {
			filterForm.setFieldsValue({
				statuses: statusEnumList.map(({ value }) => value),
			})
		}
	}, [isGetStatusListLoading])

	const loading =
		isGetStatusListLoading ||
		isGetWithdrawalTimeReportLoading ||
		isExportWithdrawalTimeReportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalTimeReportFilter
				form={filterForm}
				statusEnumList={statusEnumList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				loading={isGetWithdrawalTimeReportLoading}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<WithdrawalTimeReportTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					withdrawalTimeReport={withdrawalTimeReport}
					handleTableChange={handleTableChange}
				/>
			)}
			{currencyAmountData.length > 0 && (
				<WithdrawalTimeReportOverviewTable
					loading={loading}
					currencyAmountData={currencyAmountData}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportWithdrawalTimeReportLoading}
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WithdrawalTimeReport

import moment from 'moment'
import download from 'downloadjs'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { isEmpty } from 'lodash'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import {
	PAGINATION,
	usePagination,
	useQueryParams,
	useAuth,
} from 'common/hooks'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import {
	useLazyGetDepositTimeReportListQuery,
	useExportDepositTimeReportMutation,
} from 'features/depositTimeReport/api'
import { IFilterForm } from 'features/depositTimeReport/type'
import { DepositTimeReportFilter } from 'features/depositTimeReport/DepositTimeReportFilter'
import { DepositTimeReportTable } from 'features/depositTimeReport/DepositTimeReportTable'
import { DepositTimeReportOverviewTable } from 'features/depositTimeReport/DepositTimeReportOverviewTable'

const DepositTimeReport = ({ pageTitle }: { pageTitle?: string }) => {
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
	} = useGetEnumTypeQuery({ enumName: 'DepositTimeStatusEnum' })

	const [
		getDepositTimeReport,
		{
			data: {
				data: depositTimeReport = [],
				currencyAmountRecord: currencyAmountData = [],
				rowCount: depositTimeReportTotal = 0,
			} = {},
			isFetching: isGetDepositTimeReportLoading,
		},
	] = useLazyGetDepositTimeReportListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: depositTimeReportTotal,
	})

	const [
		exportDepositTimeReport,
		{ isLoading: isExportDepositTimeReportLoading },
	] = useExportDepositTimeReportMutation()

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
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
		const { dateRange, statuses, memberId, depositId, currencyIds } =
			filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)
		try {
			await getDepositTimeReport({
				pageNumber: current,
				pageSize,
				depositId: depositId || null,
				startDate,
				endDate,
				siteIds: siteId ? [siteId] : [],
				currencyId: currencyIds,
				status: statuses,
				memberId: memberId || null,
			}).unwrap()
			setQueryParams({
				pageNumber: current,
				pageSize,
				depositId,
				startDate,
				endDate,
				siteIds: siteId ? [siteId] : [],
				currencyIds,
				statuses,
				memberId,
				timeZone: currentTimeZoneUtcOffset,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const { dateRange, statuses, memberId, depositId, currencyIds } =
			filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			const blob = await exportDepositTimeReport({
				depositId: depositId || null,
				siteIds: siteId ? [siteId] : [],
				currencyIds,
				statuses,
				memberId: memberId || null,
				startDate,
				endDate,
			}).unwrap()
			download(
				blob,
				`DepositTimeReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		// init
		if (!isEmpty(queryParams)) {
			const {
				startDate,
				endDate,
				currencyIds,
				statuses,
				depositId,
				memberId,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams

			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds?.map((id: string) => Number(id)),
				statuses: statuses?.map((status: string) => Number(status)),
				depositId,
				memberId,
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		} else if (!isGetStatusListLoading && isEmpty(queryParams)) {
			filterForm.setFieldsValue({
				statuses: statusEnumList.map(({ value }) => value),
			})
		}
	}, [isGetStatusListLoading])

	const loading =
		isGetStatusListLoading ||
		isGetDepositTimeReportLoading ||
		isExportDepositTimeReportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<DepositTimeReportFilter
				form={filterForm}
				loading={isGetDepositTimeReportLoading}
				statusEnumList={statusEnumList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<DepositTimeReportTable
					loading={loading}
					pagination={pagination}
					depositTimeReport={depositTimeReport}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
				/>
			)}
			{currencyAmountData.length > 0 && (
				<DepositTimeReportOverviewTable
					loading={loading}
					currencyAmountData={currencyAmountData}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportDepositTimeReportLoading}
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositTimeReport

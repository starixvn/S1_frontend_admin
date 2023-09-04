import moment from 'moment'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import download from 'downloadjs'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	useLazyGetConfiscatedListQuery,
	useLazyGetConfiscatedSummaryQuery,
	useExportConfiscatedMutation,
} from 'features/confiscatedSummaryReport/api'
import ConfiscatedListTable from 'features/confiscatedSummaryReport/ConfiscatedListTable'
import ConfiscatedSummaryReportFilter from 'features/confiscatedSummaryReport/ConfiscatedSummaryReportFilter'
import {
	IConfiscatedSummaryData,
	IFilterForm,
} from 'features/confiscatedSummaryReport/type'
import ConfiscatedSummaryDescription from 'features/confiscatedSummaryReport/ConfiscatedSummaryDescription'

const ConfiscatedSummaryReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm<IFilterForm>()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const [
		getConfiscatedList,
		{
			data: { data: confiscatedList = [], rowCount: paginationTotal = 0 } = {},
			isFetching: isGetConfiscatedListFetching,
		},
	] = useLazyGetConfiscatedListQuery()

	const [
		getConfiscatedSummary,
		{
			data: {
				data: confiscatedSummaryData = {} as IConfiscatedSummaryData,
			} = {},
			isFetching: isGetConfiscatedSummaryFetching,
		},
	] = useLazyGetConfiscatedSummaryQuery()

	const [exportConfiscated, { isLoading: isExportConfiscatedLoading }] =
		useExportConfiscatedMutation()

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

		const { dateRange, ...args } = await filterForm.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		try {
			await getConfiscatedList({
				siteIds: [siteId],
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				...args,
			}).unwrap()
			setQueryParams({
				siteIds: [siteId],
				startDate,
				endDate,
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

		try {
			await getConfiscatedSummary({
				siteIds: [siteId],
				startDate,
				endDate,
				...args,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		if (!siteId) return

		const { currencyIds, baseCurrencyId, startDate, endDate, userName } =
			queryParams

		try {
			const blob = await exportConfiscated({
				siteIds: [siteId],
				startDate,
				endDate,
				baseCurrencyId: Number(baseCurrencyId),
				currencyIds: currencyIds?.map((values: string) => Number(values)),
				userName,
			}).unwrap()
			download(
				blob,
				`ExportConfiscatedSummaryReport_${moment().format(
					'YYYYMMDDHHmmss'
				)}.xlsx`
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

	useEffect(() => {
		// init
		const init = () => {
			const {
				currencyIds,
				baseCurrencyId,
				startDate,
				endDate,
				pageNumber,
				pageSize,
				userName,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds
					? currencyIds?.map((values: string) => Number(values))
					: currencyListBySite?.map(({ currencyId }) => currencyId),
				baseCurrencyId: baseCurrencyId ? Number(baseCurrencyId) : undefined,
				userName,
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

	const loading =
		isGetConfiscatedListFetching || isGetConfiscatedSummaryFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<LayoutContent.Card>
				<ConfiscatedSummaryDescription
					loading={loading}
					confiscatedSummaryData={confiscatedSummaryData}
				/>
			</LayoutContent.Card>

			<ConfiscatedSummaryReportFilter
				form={filterForm}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>

			<ConfiscatedListTable
				loading={loading}
				pagination={pagination}
				timeZoneUtcOffset={timeZoneUtcOffset}
				confiscatedList={confiscatedList}
				onTableChange={handleTableChange}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportConfiscatedLoading}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ConfiscatedSummaryReport

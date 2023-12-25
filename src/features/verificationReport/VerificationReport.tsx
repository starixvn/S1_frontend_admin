import { useEffect } from 'react'
import { Form, message, TablePaginationConfig } from 'antd'
import { isEmpty } from 'lodash'
import moment from 'moment'
import download from 'downloadjs'
import { LayoutContent } from 'app/pages/layout'
import VerificationReportFilter from 'features/verificationReport/VerificationReportFilter'
import VerificationReportTable from 'features/verificationReport/VerificationReportTable'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	selectAllSiteEnableCurrencyList,
	selectCurrencyIdsBySiteIds,
	selectUserSiteList,
} from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	useExportVerificationRewardReportMutation,
	useLazyGetVerificationRewardReportQuery,
} from 'features/verificationReport/api'
import {
	IFilterForm,
	IVerificationRewardReportResponse,
} from 'features/verificationReport/type'

const VerificationReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const userSiteList = useAppSelector(selectUserSiteList)
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const [filterForm] = Form.useForm<IFilterForm>()

	const watchSiteIds = Form.useWatch('siteIds', filterForm)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)

	const [
		getVerificationRewardReport,
		{
			data: {
				data: verificationRewardReportList = [],
				rowCount: verificationRewardReportTotal = 0,
			} = {} as IVerificationRewardReportResponse,
			isFetching: isGetVerificationRewardReportLoading,
		},
	] = useLazyGetVerificationRewardReportQuery()

	const [
		exportVerificationRewardReport,
		{ isLoading: isExportVerificationRewardReportLoading },
	] = useExportVerificationRewardReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: verificationRewardReportTotal,
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
		const {
			siteIds,
			memberId: userName,
			sabaId: filterFormSabaId,
			dateRange,
			currencyIds,
		} = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		const args = {
			siteIds,
			pageNumber: current,
			pageSize,
			userName: userName ?? '',
			sabaId: filterFormSabaId ?? '',
			currencyIds,
			startDate,
			endDate,
		}

		try {
			await getVerificationRewardReport(args).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
			setQueryParams({ ...args, timeZone: currentTimeZoneUtcOffset })
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

	const handleExport = async () => {
		const {
			siteIds = [],
			currencyIds = [],
			userName,
			sabaId: querySabaId,
			startDate,
			endDate,
		} = queryParams

		const args = {
			siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
			currencyIds: currencyIds.map((currency: string) => Number(currency)),
			userName,
			sabaId: querySabaId,
			startDate,
			endDate,
		}
		try {
			const blob = await exportVerificationRewardReport(args).unwrap()
			download(
				blob,
				`ExportVerificationReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			const {
				pageNumber,
				pageSize,
				userName,
				sabaId: querySabaId,
				currencyIds = [],
				startDate,
				endDate,
				timeZone,
				siteIds = [],
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				siteIds: siteIds.map((querySite: string) => Number(querySite)),
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				memberId: userName,
				sabaId: querySabaId,
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	const loading =
		isGetVerificationRewardReportLoading ||
		isExportVerificationRewardReportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<VerificationReportFilter
				form={filterForm}
				loading={loading}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				currencyListByAllSite={currencyListByAllSite}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<VerificationReportTable
					loading={loading}
					pagination={pagination}
					verificationRewardReportList={verificationRewardReportList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportVerificationRewardReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default VerificationReport

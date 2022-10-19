import { useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Form, message, TablePaginationConfig } from 'antd'
import moment, { Moment } from 'moment'
import download from 'downloadjs'
import { isEmpty } from 'lodash'
import {
	IGetPromotionTypeResponse,
	useGetPromotionListQuery,
} from 'common/service/allDataApi'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { selectUserSite } from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useGetPromotionCategoryOptionsQuery,
	useExportBonusReportMutation,
	useLazyGetBonusReportDataListQuery,
} from './api'
import BonusReportFilter from './BonusReportFilter'
import BonusReportTable from './BonusReportTable'
import BonusReportSumTable from './BonusReportSumTable'

interface IBonusReportProps {
	pageTitle?: string
}

const BonusReport = ({ pageTitle }: IBonusReportProps) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<{
		currencyId: number
		baseCurrencyId: number
		promotionType: number
		statuses: number[]
		promotionCategoryId: number
		userName: string
		transId: string
		bonusCode: string
		dateRange: [Moment, Moment]
	}>()

	const {
		data: { data: promotionList = [] } = {} as IGetPromotionTypeResponse,
		isLoading: isGetPromotionListDataLoading,
	} = useGetPromotionListQuery({ isPayout: false, isNew: true })

	const {
		data: { data: categories = [] } = {},
		isFetching: isGetCategoryFetching,
	} = useGetPromotionCategoryOptionsQuery(null)

	const [
		getBonusReportDataList,
		{
			data: {
				data: bonusReportDataList = [],
				currencyAmountRecord = [],
				rowCount: paginationTotal = 0,
			} = {},

			isFetching: isGetBonusReportDataListFetching,
		},
	] = useLazyGetBonusReportDataListQuery()

	const [exportBonusReport, { isLoading: isExportBonusReportLoading }] =
		useExportBonusReportMutation()

	const [pagination, setPagination] = usePagination({ paginationTotal })

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
		const { dateRange, transId, bonusCode, userName, ...args } =
			await form.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		try {
			await getBonusReportDataList({
				siteId,
				transId: transId || null,
				bonusCode: bonusCode || null,
				userName: userName || null,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				...args,
			}).unwrap()

			setQueryParams({
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
				...args,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
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
		if (!siteId) return

		const {
			currencyId,
			baseCurrencyId,
			promotionType,
			statuses,
			promotionCategoryId,
			userName,
			transId,
			bonusCode,
			startDate,
			endDate,
			pageNumber,
			pageSize,
		} = queryParams

		const args = {
			siteId,
			bonusCode,
			promotionType: Number(promotionType) || 0,
			currencyId: Number(currencyId) || 0,
			startDate,
			endDate,
			userName,
			transId,
			pageNumber,
			pageSize,
			baseCurrencyId: Number(baseCurrencyId) || 0,
			promotionCategoryId: Number(promotionCategoryId),
			statuses: statuses?.map((status: string) => Number(status)) ?? [],
		}

		try {
			const blob = await exportBonusReport(args).unwrap()

			download(
				blob,
				`ExportBonusReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isGetPromotionListDataLoading ||
		isGetCategoryFetching ||
		isGetBonusReportDataListFetching

	useEffect(() => {
		if (!isGetCategoryFetching && categories.length > 1) {
			form.setFieldsValue({
				promotionCategoryId: categories[0].promotionCategoryId,
			})
		}
	}, [isGetCategoryFetching])

	useEffect(() => {
		const init = () => {
			const {
				currencyId,
				baseCurrencyId,
				promotionType,
				statuses,
				promotionCategoryId,
				userName,
				transId,
				bonusCode,
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))

			form.setFieldsValue({
				currencyId: Number(currencyId) || 0,
				baseCurrencyId: Number(baseCurrencyId) || 0,
				promotionType: Number(promotionType) || 0,
				statuses: statuses?.map((status: string) => Number(status)) ?? [],
				promotionCategoryId: Number(promotionCategoryId),
				userName,
				transId,
				bonusCode,
				dateRange: [moment(startDate), moment(endDate)],
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

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BonusReportFilter
				form={form}
				loading={loading}
				promotionList={promotionList}
				categories={categories}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<BonusReportTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					bonusReportDataList={bonusReportDataList}
					pagination={pagination}
					onTableChange={handleTableChange}
				/>
			)}
			{currencyAmountRecord?.length > 0 && (
				<BonusReportSumTable
					loading={loading}
					currencyAmountRecord={currencyAmountRecord}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportBonusReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BonusReport

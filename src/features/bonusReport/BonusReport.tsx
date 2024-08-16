import { useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Form, message, TablePaginationConfig } from 'antd'
import dayjs from 'dayjs'
import download from 'downloadjs'
import { isEmpty } from 'lodash'
import {
	IGetPromotionTypeResponse,
	useGetPromotionListQuery,
} from 'common/service/allDataApi'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { selectCurrencyIdsBySiteIds, selectUserSiteList } from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useTimeZone } from 'components/TimeZoneSelect'
import { IFilterForm } from 'features/bonusReport/type'
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
	const userSiteList = useAppSelector(selectUserSiteList)
	const [filterForm] = Form.useForm<IFilterForm>()

	const watchSiteIds = Form.useWatch('siteIds', filterForm)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)

	const {
		data: { data: bonusAtPageEnum = [] } = {},
		isFetching: isGetBonusAtPageEnumFetching,
	} = useGetEnumTypeQuery({
		enumName: 'BonusAtPageEnum',
	})

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
		const { dateRange, transId, bonusCode, userName, ...args } =
			await filterForm.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			await getBonusReportDataList({
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
				transId: transId || null,
				bonusCode: bonusCode || null,
				userName: userName || null,
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
		const {
			currencyIds = [],
			siteIds = [],
			baseCurrencyId,
			promotionTypes,
			statuses,
			promotionCategoryIds,
			userName,
			transId,
			bonusCode,
			startDate,
			endDate,
			pageNumber,
			pageSize,
			atPages,
		} = queryParams

		const args = {
			bonusCode,
			promotionCategoryIds:
				promotionCategoryIds?.map((category: string) => Number(category)) ?? [],
			currencyIds: currencyIds.map((queryCurrency: string) =>
				Number(queryCurrency)
			),
			siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
			startDate,
			endDate,
			userName,
			transId,
			pageNumber,
			pageSize,
			baseCurrencyId: Number(baseCurrencyId) || 0,
			promotionTypes: promotionTypes?.map((type: string) => Number(type)) ?? [],
			statuses: statuses?.map((status: string) => Number(status)) ?? [],
			atPages: atPages?.map((values: string) => Number(values)) ?? [],
		}

		try {
			const blob = await exportBonusReport(args).unwrap()

			download(
				blob,
				`ExportBonusReport_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
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
		isGetBonusReportDataListFetching ||
		isGetBonusAtPageEnumFetching

	const filterListLoading =
		isGetCategoryFetching || isGetPromotionListDataLoading

	useEffect(() => {
		if (!filterListLoading) {
			filterForm.setFieldsValue({
				promotionCategoryIds: categories.map(
					category => category.promotionCategoryId
				),
				promotionTypes: promotionList?.map(item => item.type),
				atPages: bonusAtPageEnum?.map(({ value }) => value),
			})
		}
	}, [filterListLoading])

	useEffect(() => {
		const init = () => {
			const {
				currencyIds = [],
				siteIds = [],
				baseCurrencyId,
				promotionTypes,
				statuses,
				promotionCategoryIds,
				userName,
				transId,
				bonusCode,
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
				atPages,
			} = queryParams
			onTimeZoneChange(Number(timeZone))

			filterForm.setFieldsValue({
				siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
				currencyIds: currencyIds.map((queryCurrency: string) =>
					Number(queryCurrency)
				),
				baseCurrencyId: Number(baseCurrencyId) || 0,
				promotionTypes:
					promotionTypes?.map((type: string) => Number(type)) ?? [],
				statuses: statuses?.map((status: string) => Number(status)) ?? [],
				promotionCategoryIds:
					promotionCategoryIds?.map((category: string) => Number(category)) ??
					[],
				userName,
				transId,
				bonusCode,
				dateRange: [dayjs(startDate), dayjs(endDate)],
				atPages: atPages?.map((values: string) => Number(values)) ?? [],
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
				form={filterForm}
				loading={loading}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				promotionList={promotionList}
				categories={categories}
				bonusAtPageEnum={bonusAtPageEnum}
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
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportBonusReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BonusReport

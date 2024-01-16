import { useEffect, useState } from 'react'
import { Form, message, TablePaginationConfig } from 'antd'
import moment from 'moment/moment'
import download from 'downloadjs'
import { LayoutContent } from 'app/pages/layout'
import {
	useExportWinLossByAffiliateMutation,
	useExportWinLossByBrandMutation,
	useExportWinLossByCurrencyMutation,
	useExportWinLossByDateMutation,
	useExportWinLossByMonthMutation,
	useExportWinLossByPlayerMutation,
	useExportWinLossByTpCategoryTypeMutation,
	useExportWinLossByTpGameTypeMutation,
	useLazyGetWinLossByAffiliateQuery,
	useLazyGetWinLossByBrandQuery,
	useLazyGetWinLossByCurrencyQuery,
	useLazyGetWinLossByDateQuery,
	useLazyGetWinLossByMonthQuery,
	useLazyGetWinLossByPlayerDetailQuery,
	useLazyGetWinLossByPlayerQuery,
	useLazyGetWinLossByTpCategoryTypeQuery,
	useLazyGetWinLossByTpGameTypeQuery,
} from 'features/winLostReport/api'
import { useGetProductsQuery } from 'common/service/allDataApi'
import { IWinLossTableData } from 'features/winLostReport/type'
import {
	GroupByEnum,
	groupName,
	OrderEnum,
} from 'features/winLostReport/constants'
import {
	orderDirectionConverter,
	winLossReportConverter,
} from 'features/winLostReport/utils'
import { AffixButtons } from 'components/AffixButtons'
import WinLostReportFilter from 'features/winLostReport/WinLostReportFilter'
import WinLostReportTable from 'features/winLostReport/WinLostReportTable'
import { useAppSelector } from 'app/store'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	selectAllSiteEnableCurrencyList,
	selectCurrencyIdsBySiteIds,
	selectUserSiteList,
} from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { cloneDeep, isArray, isEmpty, reject } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'
import { IGetCategoryResponse } from 'features/betList/type'
import { useGetCategoryQuery } from 'features/betList/api'

const WinLostReport = ({ pageTitle }: { pageTitle?: string }) => {
	const [filterForm] = Form.useForm()
	const watchSiteIds = Form.useWatch('siteIds', filterForm)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const userSiteList = useAppSelector(selectUserSiteList)
	const [queryParams, setQueryParams] = useQueryParams()
	const [tableList, setTableList] = useState<IWinLossTableData[]>([])
	const [expandList, setExpandList] = useState<Array<string | number>>([])
	const [selectDate, setSelectDate] = useState(null)
	const [isSort, setIsSort] = useState(false)

	const {
		data: { data: tpGameList = [] } = {},
		isLoading: isGetTpGameListLoading,
	} = useGetProductsQuery(null)

	const {
		data: { data: categories = [] } = {} as IGetCategoryResponse,
		isFetching: isGetCategoryFetching,
	} = useGetCategoryQuery(null)

	const [getWinLossByDate, { isFetching: isGetWinLossByDateFetching }] =
		useLazyGetWinLossByDateQuery()

	const [getWinLossByMonth, { isFetching: isGetWinLossByMonthFetching }] =
		useLazyGetWinLossByMonthQuery()

	const [
		getWinLossByTpGameType,
		{ isFetching: isGetWinLossByTpGameTypeFetching },
	] = useLazyGetWinLossByTpGameTypeQuery()

	const [
		getWinLossByTpCategoryType,
		{ isFetching: isGetWinLossByTpCategoryTypeFetching },
	] = useLazyGetWinLossByTpCategoryTypeQuery()

	const [
		getWinLossByPlayer,
		{
			isFetching: isGetWinLossByPlayerFetching,
			data: { rowCount: paginationTotal = 0 } = {},
		},
	] = useLazyGetWinLossByPlayerQuery()

	const [
		getWinLossByPlayerDetail,
		{ isFetching: isGetWinLossByPlayerDetailFetching },
	] = useLazyGetWinLossByPlayerDetailQuery()

	const [getWinLossByCurrency, { isFetching: isGetWinLossByCurrencyFetching }] =
		useLazyGetWinLossByCurrencyQuery()

	const [getWinLossByBrand, { isFetching: isGetWinLossByBrandFetching }] =
		useLazyGetWinLossByBrandQuery()

	const [
		getWinLossByAffiliate,
		{ isFetching: isGetWinLossByAffiliateFetching },
	] = useLazyGetWinLossByAffiliateQuery()

	const [exportWinLossByDate, { isLoading: isExportWinLossByDateLoading }] =
		useExportWinLossByDateMutation()

	const [exportWinLossByMonth, { isLoading: isExportWinLossByMonthLoading }] =
		useExportWinLossByMonthMutation()

	const [
		exportWinLossByTpGameType,
		{ isLoading: isExportWinLossByTpGameTypeLoading },
	] = useExportWinLossByTpGameTypeMutation()

	const [
		exportWinLossByTpCategoryType,
		{ isLoading: isExportWinLossByTpCategoryTypeLoading },
	] = useExportWinLossByTpCategoryTypeMutation()

	const [exportWinLossByPlayer, { isLoading: isExportWinLossByPlayerLoading }] =
		useExportWinLossByPlayerMutation()

	const [
		exportWinLossByCurrency,
		{ isLoading: isExportWinLossByCurrencyLoading },
	] = useExportWinLossByCurrencyMutation()

	const [exportWinLossByBrand, { isLoading: isExportWinLossByBrandLoading }] =
		useExportWinLossByBrandMutation()

	const [
		exportWinLossByAffiliate,
		{ isLoading: isExportWinLossByAffiliateLoading },
	] = useExportWinLossByAffiliateMutation()

	const {
		data: { data: memberTypeEnums = [] } = {},
		isLoading: isMemberTypeEnumsLoading,
	} = useGetEnumTypeQuery({
		enumName: 'MemberTypeEnum',
	})

	const [pagination, setPagination] = usePagination({ paginationTotal })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
		orderBy = false,
		orderByProperty = '',
		orderByDirection = OrderEnum.ascend,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
		orderBy?: boolean
		orderByProperty?: string
		orderByDirection?: number
	}) => {
		const {
			siteIds,
			dateType,
			dateRange,
			currencyIds,
			baseCurrencyId,
			tpGameTypes,
			userName,
			includeFreeSpins,
			noDraw,
			displayGroupBreakdownInOriginalCurrency,
			groupBy,
			memberTypes,
			includeTest,
			tpCategorys = [],
			affiliate,
		} = filterForm.getFieldsValue()

		const [starTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		const days = moment(endTime).diff(moment(starTime), 'days')
		if (days > 90) {
			message.error(t('Label_DateRangeExceedsThreeMonths'))
			return
		}

		const args = {
			siteIds,
			starTime,
			endTime,
			tpCategorys: tpCategorys ?? [],
			tpGameTypes: tpGameTypes ?? [],
			currencyIds,
			userName: userName ?? '',
			orderBy,
			orderByProperty,
			// 排序默認為正序
			orderByDirection,
			dateType,
			displayGroupBreakdownInOriginalCurrency: Boolean(
				displayGroupBreakdownInOriginalCurrency
			),
			includeFreeSpins: Boolean(includeFreeSpins),
			includeTest: Boolean(includeTest),
			noDraw: Boolean(noDraw),
			baseCurrencyId,
			memberTypes,
		}

		const searchSelector = async (groupNum: number) => {
			let result
			switch (groupNum) {
				case GroupByEnum.Date:
					try {
						result = await getWinLossByDate(args).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Month:
					try {
						result = await getWinLossByMonth(args).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Product:
					try {
						result = await getWinLossByTpGameType(args).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Category:
					try {
						result = await getWinLossByTpCategoryType(args).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Currency:
					try {
						result = await getWinLossByCurrency(args).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Player:
					try {
						result = await getWinLossByPlayer({
							...args,
							pageNumber: current,
							// payload 傳pageSize api回傳資料數為 pageSize+1 ,故這邊-1
							pageSize: pageSize - 1,
						}).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Brand:
					try {
						result = await getWinLossByBrand(args).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Affiliate:
					try {
						result = await getWinLossByAffiliate({
							...args,
							affiliateAccount: affiliate,
							pageNumber: current,
							// payload 傳pageSize api回傳資料數為 pageSize+1 ,故這邊-1
							pageSize: pageSize - 1,
						}).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				default:
					break
			}
			const { data: list } = result ?? {}
			return list
		}

		try {
			const res = await searchSelector(groupBy)
			const list = winLossReportConverter(
				res ?? [],
				GroupByEnum.Player === groupBy
			)
			setTableList(list)
			setExpandList([])
			setQueryParams({
				...args,
				timeZone: currentTimeZoneUtcOffset,
				groupBy,
				affiliate,
			})
			// 除了player之外的group都需一頁呈現,故pageSize預設100,兼容其餘group
			setPagination(prev => ({
				...prev,
				current,
				pageSize: GroupByEnum.Player === groupBy ? pageSize : 100,
				disabled: GroupByEnum.Player !== groupBy,
			}))
			setIsSort(false)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: any
	) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		if (sorter.order) {
			const { groupBy } = queryParams
			const orderBy = true
			const orderByProperty =
				(sorter.field as string) === 'displayKey'
					? groupName[Number(groupBy)]
					: sorter.field
			const orderByDirection = orderDirectionConverter(sorter.order as string)
			await handleSearch({
				current,
				pageSize,
				currentTimeZoneUtcOffset: timeZoneUtcOffset,
				orderBy,
				orderByProperty,
				orderByDirection,
			})
		} else {
			await handleSearch({
				current,
				pageSize,
				currentTimeZoneUtcOffset: timeZoneUtcOffset,
			})
		}
	}

	const handleExport = () => {
		const exportSelector = async () => {
			const {
				siteIds: querySiteIds,
				starTime,
				endTime,
				tpCategorys = [],
				tpGameTypes = [],
				currencyIds = [],
				userName,
				orderBy,
				orderByProperty,
				orderByDirection,
				dateType,
				displayGroupBreakdownInOriginalCurrency,
				includeFreeSpins,
				includeTest,
				noDraw,
				groupBy,
				baseCurrencyId,
				memberTypes = [],
				affiliate,
			} = queryParams

			const args = {
				siteIds: querySiteIds?.map((value: string) => Number(value)) ?? [],
				starTime,
				endTime,
				tpCategorys: tpCategorys.map((categoryId: string) =>
					Number(categoryId)
				),
				tpGameTypes: tpGameTypes.map((tpGameType: string) =>
					Number(tpGameType)
				),
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				userName: userName ?? '',
				orderBy: Boolean(orderBy),
				orderByProperty: orderByProperty ?? '',
				orderByDirection: Number(orderByDirection ?? 0),
				dateType: Number(dateType),
				displayGroupBreakdownInOriginalCurrency: Boolean(
					displayGroupBreakdownInOriginalCurrency
				),
				includeFreeSpins: Boolean(includeFreeSpins),
				includeTest: Boolean(includeTest),
				noDraw: Boolean(noDraw),
				baseCurrencyId: Number(baseCurrencyId),
				memberTypes: memberTypes?.map((value: string) => Number(value)) ?? [],
			}
			let blob
			switch (Number(groupBy)) {
				case GroupByEnum.Date:
					try {
						blob = await exportWinLossByDate(args).unwrap()
						download(
							blob,
							`WinLostReportByDate_${moment().format('YYYYMMDDHHmmss')}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Month:
					try {
						blob = await exportWinLossByMonth(args).unwrap()
						download(
							blob,
							`WinLostReportByMonth_${moment().format('YYYYMMDDHHmmss')}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Product:
					try {
						blob = await exportWinLossByTpGameType(args).unwrap()
						download(
							blob,
							`WinLostReportByTpGameType_${moment().format(
								'YYYYMMDDHHmmss'
							)}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Category:
					try {
						blob = await exportWinLossByTpCategoryType(args).unwrap()
						download(
							blob,
							`WinLostReportByTpCategoryType_${moment().format(
								'YYYYMMDDHHmmss'
							)}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Currency:
					try {
						blob = await exportWinLossByCurrency(args).unwrap()
						download(
							blob,
							`WinLostReportByCurrency_${moment().format(
								'YYYYMMDDHHmmss'
							)}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Player:
					try {
						blob = await exportWinLossByPlayer(args).unwrap()
						download(
							blob,
							`WinLostReportByPlayer_${moment().format('YYYYMMDDHHmmss')}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Brand:
					try {
						blob = await exportWinLossByBrand(args).unwrap()
						download(
							blob,
							`WinLostReportByBrand_${moment().format('YYYYMMDDHHmmss')}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case GroupByEnum.Affiliate:
					try {
						blob = await exportWinLossByAffiliate({
							...args,
							affiliateAccount: affiliate,
						}).unwrap()
						download(
							blob,
							`WinLostReportByAffiliate_${moment().format(
								'YYYYMMDDHHmmss'
							)}.xlsx`
						)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				default:
					break
			}
		}
		exportSelector()
	}

	const expandDetailHandler = async (expanded: boolean, record: any) => {
		if (record.children.length === 0) {
			const {
				siteIds: querySiteIds,
				starTime,
				endTime,
				tpGameTypes = [],
				currencyIds = [],
				orderBy,
				orderByProperty,
				orderByDirection,
				dateType,
				displayGroupBreakdownInOriginalCurrency,
				baseCurrencyId,
				groupBy,
			} = queryParams

			try {
				const args = {
					siteIds: querySiteIds?.map((value: string) => Number(value)) ?? [],
					starTime,
					endTime,
					tpGameTypes: tpGameTypes.map((tpGameType: string) =>
						Number(tpGameType)
					),
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					userName: record?.userName ?? '',
					orderBy: Boolean(orderBy),
					orderByProperty: orderByProperty ?? '',
					orderByDirection: Number(orderByDirection ?? 0),
					dateType: Number(dateType),
					displayGroupBreakdownInOriginalCurrency: Boolean(
						displayGroupBreakdownInOriginalCurrency
					),
					baseCurrencyId: Number(baseCurrencyId),
				}
				const { data: { data: detailList = [] } = {} } =
					await getWinLossByPlayerDetail(args)
				const list = winLossReportConverter(
					detailList,
					GroupByEnum.Player === Number(groupBy)
				)

				const cloneTableList = cloneDeep(tableList)
				cloneTableList?.forEach(({ children }: any) => {
					children?.forEach(({ key, children: subChildren }: any) => {
						if (key === record.key) {
							subChildren.push(...list)
						}
					})
				})

				setTableList(cloneTableList)
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const filterLoading =
		isMemberTypeEnumsLoading || isGetTpGameListLoading || isGetCategoryFetching

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					tpCategorys: categories.map(({ categoryId }) => categoryId),
					tpGameTypes: tpGameList.map(({ type }) => type),
					// 預設排除直播主
					memberTypes: reject(memberTypeEnums, [
						'value',
						UserTypeEnum.LiveStreaming,
					]).map(({ value }) => Number(value)),
					siteIds: userSiteList.map(item => item.siteId),
					currencyIds: currencyListByAllSite?.map(
						({ currencyId }) => currencyId
					),
				})
			} else {
				const {
					siteIds,
					dateType,
					starTime,
					endTime,
					timeZone,
					currencyIds = [],
					baseCurrencyId,
					tpCategorys = [],
					tpGameTypes = [],
					userName,
					includeFreeSpins,
					includeTest,
					noDraw,
					displayGroupBreakdownInOriginalCurrency,
					groupBy,
					memberTypes,
					affiliate,
				} = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					siteIds: siteIds ? siteIds.map((value: string) => Number(value)) : [],
					dateType: Number(dateType),
					dateRange: [moment(starTime), moment(endTime)],
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					baseCurrencyId: Number(baseCurrencyId),
					tpCategorys: tpCategorys.map((categoryId: string) =>
						Number(categoryId)
					),
					tpGameTypes: tpGameTypes.map((tpGameType: string) =>
						Number(tpGameType)
					),
					userName,
					includeFreeSpins: Boolean(includeFreeSpins),
					includeTest: Boolean(includeTest),
					noDraw: Boolean(noDraw),
					displayGroupBreakdownInOriginalCurrency: Boolean(
						displayGroupBreakdownInOriginalCurrency
					),
					groupBy: Number(groupBy),
					memberTypes: isArray(memberTypes)
						? memberTypes.map((value: string) => Number(value))
						: [],
					affiliate,
				})

				handleSearch({ currentTimeZoneUtcOffset: Number(timeZone) })
			}
		}
		if (!filterLoading) {
			init()
		}
	}, [filterLoading])

	useEffect(() => {
		// 當groupBy Affiliate時搜尋,預設sortBy GGR
		if (!isGetWinLossByAffiliateFetching && isSort) {
			handleTableChange({}, null, {
				order: 'ascend',
				field: 'ggr',
			})
		}
	}, [isGetWinLossByAffiliateFetching])

	const exportLoading =
		isExportWinLossByDateLoading ||
		isExportWinLossByMonthLoading ||
		isExportWinLossByTpGameTypeLoading ||
		isExportWinLossByTpCategoryTypeLoading ||
		isExportWinLossByPlayerLoading ||
		isExportWinLossByCurrencyLoading ||
		isExportWinLossByBrandLoading ||
		isExportWinLossByAffiliateLoading

	const loading =
		isGetTpGameListLoading ||
		isGetCategoryFetching ||
		isGetWinLossByDateFetching ||
		isGetWinLossByMonthFetching ||
		isGetWinLossByTpGameTypeFetching ||
		isGetWinLossByTpCategoryTypeFetching ||
		isGetWinLossByPlayerFetching ||
		isGetWinLossByPlayerDetailFetching ||
		isGetWinLossByCurrencyFetching ||
		isGetWinLossByBrandFetching ||
		isGetWinLossByAffiliateFetching ||
		isMemberTypeEnumsLoading ||
		exportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WinLostReportFilter
				form={filterForm}
				loading={loading}
				tpGameList={tpGameList}
				categories={categories}
				memberTypeEnums={memberTypeEnums}
				currencyListByAllSite={currencyListByAllSite}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				userSiteList={userSiteList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				selectDate={selectDate}
				setSelectDate={setSelectDate}
				setIsSort={setIsSort}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && tableList.length > 0 && (
				<WinLostReportTable
					loading={loading}
					pagination={pagination}
					tableList={tableList}
					expandList={expandList}
					setExpandList={setExpandList}
					onExpand={expandDetailHandler}
					onTableChange={handleTableChange}
				/>
			)}
			<AffixButtons>
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={exportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WinLostReport

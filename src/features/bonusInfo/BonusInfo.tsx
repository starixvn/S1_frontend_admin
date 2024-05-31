import download from 'downloadjs'
import dayjs from 'dayjs'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import {
	selectAllSiteEnableCurrencyList,
	selectCurrencyIdsBySiteIds,
	selectUserSiteList,
} from 'common/enum'
import { BonusInfoFilter } from 'features/bonusInfo/BonusInfoFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useExportBonusDetailMutation,
	useExportBonusInfoMutation,
	useLazyGetBonusDetailQuery,
	useLazyGetBonusInfoQuery,
	useLazyGetInfoSummaryQuery,
} from 'features/bonusInfo/api'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	IBonusDetailForm,
	IBonusDetailListData,
	IBonusDetailOptions,
	IBonusInfoData,
	IFilterForm,
} from 'features/bonusInfo/type'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useEffect, useState } from 'react'
import { dateRangeToUtcFormatter, utcFormatter } from 'common/utils'
import { GroupByEnum } from 'features/bonusInfo/constants'
import { BonusInfoTable } from 'features/bonusInfo/BonusInfoTable'
import { isEmpty, orderBy as lodashOrderBy, uniq } from 'lodash'
import { SorterResult } from 'antd/es/table/interface'
import { OrderByTypeEnum } from 'features/betList/type'
import { orderDirectionConverter } from 'features/betList/converter'
import { BonusDetailTable } from 'features/bonusInfo/BonusDetailTable'
import { AffixButtons } from 'components/AffixButtons'
import { dateFormat, monthFormat } from 'common/utils/format'

const BonusInfo = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const userSiteList = useAppSelector(selectUserSiteList)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const [filterForm] = Form.useForm<IFilterForm>()
	const watchSiteIds = Form.useWatch('siteIds', filterForm)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)
	// 存放 bonusDetail Table 的資料
	const [bonusDetailForm] = Form.useForm<IBonusDetailForm>()
	// 當前搜出來的資料所含的 bonusCodes
	const [currentBonusCodes, setCurrentBonusCodes] = useState<
		IBonusDetailOptions[]
	>([])
	// 當前搜出來的資料所含的 date，只有 formGroupType 時會用到
	const [currentDates, setCurrentDates] = useState<string[]>([])
	// 僅用來控制 detail table 是否顯示
	const [showDetails, setShowDetails] = useState<boolean>(false)
	// 用 state 控制當前顯示的 table 類型，需要用 state 儲存的主要原因是希望在 handle search 之後才做畫面的更動
	const [formGroupType, setFormGroupType] = useState<number>(
		GroupByEnum.BonusCode
	)
	// bonusDetail 的資料接出來處理，因為下拉異動之後需要清除資料
	const [bonusDetail, setBonusDetail] = useState<IBonusDetailListData[]>([])
	const [selectDate, setSelectDate] = useState(null)
	const [
		getBonusInfo,
		{
			data: { data: bonusInfo = [], rowCount: bonusInfoTotal = 0 } = {},
			isFetching: isGetBonusInfoLoading,
		},
	] = useLazyGetBonusInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bonusInfoTotal,
	})
	const [
		getInfoSummary,
		{
			data: bonusSummary = {} as IBonusInfoData,
			isFetching: isGetBonusSummaryLoading,
		},
	] = useLazyGetInfoSummaryQuery()

	const {
		data: { data: bonusStatusList = [] } = {},
		isLoading: isGetBonusStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'PromotionStatusEnum' })

	const {
		data: { data: bonusTypeList = [] } = {},
		isLoading: isGetBonusTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BonusSummaryType' })

	// Bonus Info
	const {
		data: { data: claimStatusList = [] } = {},
		isLoading: isGetClaimStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BonusInfoStatusEnum' })

	// TransactionType
	const { data: { data: transactionTypeList = [] } = {} } = useGetEnumTypeQuery(
		{ enumName: 'BonusSummaryTransactionType' }
	)

	const [exportBonusInfo, { isLoading: isExportBonusInfoLoading }] =
		useExportBonusInfoMutation()

	// Bonus Detail
	const [
		getBonusDetail,
		{
			data: { rowCount: bonusDetailTotal = 0 } = {},
			isFetching: isGetBonusDetailLoading,
		},
	] = useLazyGetBonusDetailQuery()

	const [bonusDetailPagination, setBonusDetailPagination] = usePagination({
		paginationTotal: bonusDetailTotal,
	})

	const [exportBonusDetail, { isLoading: isExportBonusDetailLoading }] =
		useExportBonusDetailMutation()

	// BonusInfo Search
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
			groupByType,
			bonusCode,
			bonusTypes,
			bonusStatus,
			claimStatuses,
			currencyIds,
			baseCurrencyId,
			dateRange,
			// BonusInfo 原生預設用 bonusCode 做正序
			orderBy = true,
			orderByProperty = 'bonusCode',
			orderByDirection = OrderByTypeEnum.ascend as number,
		} = filterForm.getFieldsValue(true)
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		const args = {
			bonusCode,
			siteIds,
			bonusTypes,
			bonusStatus,
			startDate,
			endDate,
			claimStatuses,
			currencyIds,
			baseCurrencyId,
			pageNumber: current,
			pageSize,
			groupByType,
			orderBy,
			orderByProperty,
			orderByDirection,
		}
		try {
			await getBonusInfo({
				...args,
			}).unwrap()
			await getInfoSummary({
				...args,
			}).unwrap()
			setQueryParams({ ...args, timeZone: currentTimeZoneUtcOffset })
			setPagination(prev => ({ ...prev, current, pageSize }))
			setFormGroupType(groupByType)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// BonusInfo Table Change , sorting & changePage
	const handleBonusInfoTableChange = async (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IBonusInfoData>
	) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination

		if (sorter.order) {
			filterForm.setFieldsValue({
				orderBy: true,
				orderByProperty: sorter.field as string,
				orderByDirection: orderDirectionConverter(sorter.order as string),
			})
			await handleSearch({
				current,
				pageSize,
			})
		} else {
			// MPA 原生預設用 bonusCode 做排序
			filterForm.setFieldsValue({
				orderBy: true,
				orderByProperty: 'bonusCode',
				orderByDirection: OrderByTypeEnum.ascend as number,
			})
			await handleSearch({
				current,
				pageSize,
			})
		}
	}

	const handleExportBonusInfo = async () => {
		const {
			bonusCode = '',
			siteIds = [],
			bonusTypes = [],
			currencyIds = [],
			bonusStatus = [],
			claimStatuses = [],
			startDate,
			endDate,
			baseCurrencyId = 0,
			groupByType = 0,
			orderBy,
			orderByProperty = '',
			orderByDirection = 0,
		} = queryParams

		try {
			const blob = await exportBonusInfo({
				bonusCode,
				startDate,
				endDate,
				siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
				bonusTypes: bonusTypes.map((value: string) => Number(value)),
				bonusStatus: bonusStatus.map((value: string) => Number(value)),
				claimStatuses: claimStatuses.map((value: string) => Number(value)),
				currencyIds: currencyIds.map((value: string) => Number(value)),
				baseCurrencyId: Number(baseCurrencyId),
				groupByType: Number(groupByType),
				orderBy: !!orderBy,
				orderByProperty,
				orderByDirection: Number(orderByDirection),
			}).unwrap()

			download(blob, `BonusInfoReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleClickBonusCode = (record: IBonusInfoData) => {
		const { bonusCode, recordDate, siteId: recordSiteId } = record
		// groupBy Date 時會用到 recordDate , recordSiteId這個參數
		bonusDetailForm.setFieldsValue({
			bonusCode,
			recordSiteId,
			bonusSelector: JSON.stringify({ bonusCode, siteId: recordSiteId }),
			recordDate: dayjs(recordDate).format(dateFormat),
		})
		if (formGroupType === GroupByEnum.Date) {
			// 篩出特定時間的 bonusCode(日為單位) => 排序
			setCurrentBonusCodes(
				uniq(
					bonusInfo
						.filter(
							({ recordDate: dataRecordDate }) =>
								dayjs(dataRecordDate).format(dateFormat) ===
								dayjs(recordDate).format(dateFormat)
						)
						.map(
							({ bonusCode: dataBonusCode, siteId: dataSiteId, siteName }) => {
								return {
									bonusCode: dataBonusCode,
									siteId: dataSiteId,
									siteName,
								}
							}
						)
				)
			)
			// 先取所有時間 => 去重 => 排序
			setCurrentDates(
				lodashOrderBy(
					uniq(
						bonusInfo.map(({ recordDate: dataRecordDate }) =>
							dayjs(dataRecordDate).format(dateFormat)
						)
					)
				)
			)
		} else if (formGroupType === GroupByEnum.Month) {
			// 篩出特定時間的 bonusCode(月為單位) => 排序
			setCurrentBonusCodes(
				uniq(
					bonusInfo
						.filter(
							({ recordDate: dataRecordDate }) =>
								dayjs(dataRecordDate).format(monthFormat) ===
								dayjs(recordDate).format(monthFormat)
						)
						.map(
							({ bonusCode: dataBonusCode, siteId: dataSiteId, siteName }) => {
								return {
									bonusCode: dataBonusCode,
									siteId: dataSiteId,
									siteName,
								}
							}
						)
				)
			)
			// 假設用戶選取日期是 5月28~ 7月3號
			const { startDate, endDate } = queryParams
			// 不再5月份且不在7月份表示 表示recordDate在中間月份 選取結果 => 6月1號 ～ 6月30號
			if (
				dayjs(startDate).format(monthFormat) !==
					dayjs(recordDate).format(monthFormat) &&
				dayjs(endDate).format(monthFormat) !==
					dayjs(recordDate).format(monthFormat)
			) {
				bonusDetailForm.setFieldsValue({
					dateRange: [
						dayjs(recordDate).startOf('month'),
						dayjs(recordDate).endOf('month'),
					],
				})
				// 在5月份但不在7月份 表示recordDate在最前月份 選取結果 => 5月28號 ～ 5月31號
			} else if (
				dayjs(startDate).format(monthFormat) ===
					dayjs(recordDate).format(monthFormat) &&
				dayjs(endDate).format(monthFormat) !==
					dayjs(recordDate).format(monthFormat)
			) {
				bonusDetailForm.setFieldsValue({
					dateRange: [dayjs(startDate), dayjs(recordDate).endOf('month')],
				})
				// 在7月份但不在5月份 表示recordDate在最後月份 選取結果 => 7月1號 ～ 7月3號
			} else if (
				dayjs(startDate).format(monthFormat) !==
					dayjs(recordDate).format(monthFormat) &&
				dayjs(endDate).format(monthFormat) ===
					dayjs(recordDate).format(monthFormat)
			) {
				bonusDetailForm.setFieldsValue({
					dateRange: [dayjs(recordDate).startOf('month'), dayjs(endDate)],
				})
				// 其他則是落在選取日期在同月的情況 例：5月3號 ～ 5月27號 顯示結果 => 5月3號 ～ 5月27號
			} else {
				bonusDetailForm.setFieldsValue({
					dateRange: [dayjs(startDate), dayjs(endDate)],
				})
			}
		} else {
			setCurrentBonusCodes(
				uniq(
					bonusInfo.map(
						({ bonusCode: dataBonusCode, siteId: dataSiteId, siteName }) => {
							return { bonusCode: dataBonusCode, siteId: dataSiteId, siteName }
						}
					)
				)
			)
		}

		handleGetBonusDetail({ bonusCode, recordSiteId })
		setShowDetails(true)
	}

	const handleRecordDateChange = (date: string) => {
		const newBonusCodes = uniq(
			bonusInfo
				.filter(
					({ recordDate: dataRecordDate }) =>
						dayjs(dataRecordDate).format(dateFormat) === date
				)
				.map(({ bonusCode: dataBonusCode, siteId: dataSiteId, siteName }) => {
					return { bonusCode: dataBonusCode, siteId: dataSiteId, siteName }
				})
		)
		bonusDetailForm.resetFields(['bonusCode'])
		setCurrentBonusCodes(newBonusCodes)
		// 清除 table 資料，待下次選擇 bonusCode
		setBonusDetail([])
	}

	// getBonusDetail
	const handleGetBonusDetail = async ({
		bonusCode,
		recordSiteId,
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		// 預設用 claimStatus 做排序
		orderByProperty = 'claimStatus',
		orderByDirection = OrderByTypeEnum.ascend as number,
	}: {
		bonusCode: string
		recordSiteId: number
		current?: number | undefined
		pageSize?: number | undefined
		orderByProperty?: string
		orderByDirection?: number
	}) => {
		if (isEmpty(queryParams)) return
		// 從 queryParams 取的資料
		const {
			startDate,
			endDate,
			claimStatuses = [],
			currencyIds = [],
			baseCurrencyId = 0,
		} = queryParams
		// groupBy Date 時要用這個時間
		const { recordDate, dateRange } = bonusDetailForm.getFieldsValue(true)
		// 選 month 時 detail 裡的 datePicker 元件(與 PM 討論後決定移除)
		const [startTimeByMonth, endTimeByMonth] = dateRangeToUtcFormatter(
			dateRange && dateRange,
			timeZoneUtcOffset
		)

		try {
			bonusDetailForm.setFieldsValue({
				bonusCode,
				recordSiteId,
				orderByProperty,
				orderByDirection,
			})
			const { data: bonusDetailData = [] } = await getBonusDetail({
				siteId: recordSiteId,
				startDate: [GroupByEnum.Date, GroupByEnum.Month].includes(formGroupType)
					? utcFormatter({
							date: dayjs(
								formGroupType === GroupByEnum.Date
									? recordDate
									: startTimeByMonth
							).startOf('day'),
							utcOffset: timeZoneUtcOffset,
					  })
					: startDate,
				endDate: [GroupByEnum.Date, GroupByEnum.Month].includes(formGroupType)
					? utcFormatter({
							date: dayjs(
								formGroupType === GroupByEnum.Date ? recordDate : endTimeByMonth
							).endOf('day'),
							utcOffset: timeZoneUtcOffset,
					  })
					: endDate,
				claimStatuses: claimStatuses.map((value: string) => Number(value)),
				currencyIds: currencyIds.map((value: string) => Number(value)),
				baseCurrencyId: Number(baseCurrencyId),
				bonusCode,
				pageNumber: current,
				pageSize,
				// 都是 true
				orderBy: true,
				orderByProperty,
				orderByDirection,
			}).unwrap()
			setBonusDetail(bonusDetailData)
			setBonusDetailPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// BonusDetail Table Change , sorting & changePage
	const handleBonusDetailTableChange = async (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IBonusInfoData>
	) => {
		const { bonusCode, recordSiteId } = bonusDetailForm.getFieldsValue(true)
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		if (sorter.order) {
			await handleGetBonusDetail({
				bonusCode,
				recordSiteId,
				current,
				pageSize,
				orderByProperty: sorter.field as string,
				orderByDirection: orderDirectionConverter(sorter.order as string),
			})
		} else {
			await handleGetBonusDetail({
				bonusCode,
				recordSiteId,
				current,
				pageSize,
			})
		}
	}

	// export bonusDetail
	const handleExportBonusDetail = async () => {
		if (isEmpty(queryParams)) return
		// 從 queryParams 取的資料
		const {
			startDate,
			endDate,
			claimStatuses = [],
			currencyIds = [],
			baseCurrencyId = 0,
		} = queryParams
		// 要額外處理 groupByDate
		const {
			bonusCode,
			orderByProperty,
			orderByDirection,
			recordDate,
			dateRange,
			recordSiteId,
		} = bonusDetailForm.getFieldsValue(true)

		const [startTimeByMonth, endTimeByMonth] = dateRangeToUtcFormatter(
			dateRange && dateRange,
			timeZoneUtcOffset
		)

		try {
			const blob = await exportBonusDetail({
				bonusCode,
				startDate: [GroupByEnum.Date, GroupByEnum.Month].includes(formGroupType)
					? utcFormatter({
							date: dayjs(
								formGroupType === GroupByEnum.Date
									? recordDate
									: startTimeByMonth
							).startOf('day'),
							utcOffset: timeZoneUtcOffset,
					  })
					: startDate,
				endDate: [GroupByEnum.Date, GroupByEnum.Month].includes(formGroupType)
					? utcFormatter({
							date: dayjs(
								formGroupType === GroupByEnum.Date ? recordDate : endTimeByMonth
							).endOf('day'),
							utcOffset: timeZoneUtcOffset,
					  })
					: endDate,
				orderBy: true,
				orderByProperty,
				orderByDirection,
				baseCurrencyId: Number(baseCurrencyId),
				siteId: recordSiteId,
				claimStatuses: claimStatuses.map((value: string) => Number(value)),
				currencyIds: currencyIds.map((value: string) => Number(value)),
			}).unwrap()
			download(
				blob,
				`BonusDetailReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// Detail Table 上的 BonusCode 異動
	const handleBonusCodeChange = (value: string) => {
		// value 的資訊受 JSON 字串話，需 parse 回來
		const { bonusCode, siteId } = JSON.parse(value) as {
			bonusCode: string
			siteId: number
		}
		handleGetBonusDetail({ bonusCode, recordSiteId: siteId })
	}

	const filterLoading =
		isGetBonusTypeListLoading ||
		isGetBonusStatusListLoading ||
		isGetClaimStatusListLoading

	useEffect(() => {
		if (!filterLoading) {
			if (!isEmpty(queryParams)) {
				const {
					bonusCode = '',
					bonusTypes = [],
					bonusStatus = [],
					startDate,
					endDate,
					claimStatuses = [],
					currencyIds = [],
					baseCurrencyId = 0,
					groupByType = 0,
					orderBy,
					orderByProperty = '',
					orderByDirection = 0,
					pageSize,
					pageNumber,
					timeZone,
					siteIds = [],
				} = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					bonusCode,
					orderBy: !!orderBy,
					orderByProperty,
					siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
					groupByType: Number(groupByType),
					orderByDirection: Number(orderByDirection),
					baseCurrencyId: Number(baseCurrencyId),
					dateRange: [dayjs(startDate), dayjs(endDate)],
					bonusTypes: bonusTypes.map((value: string) => Number(value)),
					bonusStatus: bonusStatus.map((value: string) => Number(value)),
					claimStatuses: claimStatuses.map((value: string) => Number(value)),
					currencyIds: currencyIds.map((value: string) => Number(value)),
				})

				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
					currentTimeZoneUtcOffset: Number(timeZone),
				})
			} else {
				filterForm.setFieldsValue({
					bonusTypes: bonusTypeList?.map(({ value }) => value),
					bonusStatus: bonusStatusList?.map(({ value }) => value),
					claimStatuses: claimStatusList?.map(({ value }) => value),
				})
			}
		}
	}, [filterLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BonusInfoFilter
				loading={isGetBonusInfoLoading}
				filterLoading={filterLoading}
				form={filterForm}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				currencyListByAllSite={currencyListByAllSite}
				timeZoneUtcOffset={timeZoneUtcOffset}
				claimStatusList={claimStatusList}
				bonusStatusList={bonusStatusList}
				bonusTypeList={bonusTypeList}
				selectDate={selectDate}
				setSelectDate={setSelectDate}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={() => {
					// 使用 filter 搜尋時因條件改變，移除 detailTable
					setShowDetails(false)
					handleSearch({})
				}}
			/>
			{!isEmpty(queryParams) && (
				<BonusInfoTable
					loading={
						isGetBonusInfoLoading ||
						isExportBonusInfoLoading ||
						isGetBonusSummaryLoading
					}
					formGroupType={formGroupType}
					bonusInfo={bonusInfo}
					bonusSummary={bonusSummary}
					bonusTypeList={bonusTypeList}
					bonusStatusList={bonusStatusList}
					exportExcelPermission={exportExcelPermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleBonusInfoTableChange}
					onExportClick={handleExportBonusInfo}
					onClickBonusCode={handleClickBonusCode}
				/>
			)}
			{showDetails && (
				<BonusDetailTable
					form={bonusDetailForm}
					loading={isGetBonusDetailLoading || isExportBonusDetailLoading}
					formGroupType={formGroupType}
					bonusDetail={bonusDetail}
					currentBonusCodes={currentBonusCodes}
					currentDates={currentDates}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={bonusDetailPagination}
					transactionTypeList={transactionTypeList}
					claimStatusList={claimStatusList}
					exportExcelPermission={exportExcelPermission}
					onBonusCodeChange={handleBonusCodeChange}
					onTableChange={handleBonusDetailTableChange}
					onExportClick={handleExportBonusDetail}
					onRecordDateChange={handleRecordDateChange}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BonusInfo

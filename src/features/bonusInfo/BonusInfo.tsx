import download from 'downloadjs'
import moment from 'moment/moment'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { BonusInfoFilter } from 'features/bonusInfo/BonusInfoFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useExportBonusDetailMutation,
	useExportBonusInfoMutation,
	useLazyGetBonusDetailQuery,
	useLazyGetBonusInfoQuery,
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
	IBonusInfoData,
	IFilterForm,
} from 'features/bonusInfo/type'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useEffect, useState } from 'react'
import { dateRangeToUtcFormatter, utcFormatter } from 'common/utils'
import { GroupByEnum } from 'features/bonusInfo/constants'
import { isEmpty, orderBy as lodashOrderBy, uniq } from 'lodash'
import { BonusInfoTable } from 'features/bonusInfo/BonusInfoTable'
import { SorterResult } from 'antd/es/table/interface'
import { OrderByTypeEnum } from 'features/betList/type'
import { orderDirectionConverter } from 'features/betList/converter'
import { BonusDetailTable } from 'features/bonusInfo/BonusDetailTable'
import { AffixButtons } from 'components/AffixButtons'
import { dateFormat } from 'common/utils/format'

const BonusInfo = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [filterForm] = Form.useForm<IFilterForm>()
	// 存放 bonusDetail Table 的資料
	const [bonusDetailForm] = Form.useForm<IBonusDetailForm>()
	// 當前搜出來的資料所含的 bonusCodes
	const [currentBonusCodes, setCurrentBonusCodes] = useState<string[]>([])
	// 當前搜出來的資料所含的 date，只有 groupByDate 時會用到
	const [currentDates, setCurrentDates] = useState<string[]>([])
	// 僅用來控制 detail table 是否顯示
	const [showDetails, setShowDetails] = useState<boolean>(false)
	// 用 state 控制當前顯示的 table 類型，需要用 state 儲存的主要原因是希望在 handle search 之後才做畫面的更動
	const [formGroupByDate, setFormGroupByDate] = useState<boolean>(false)
	// bonusDetail 的資料接出來處理，因為下拉異動之後需要清除資料
	const [bonusDetail, setBonusDetail] = useState<IBonusDetailListData[]>([])

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
			groupBy,
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
			bonusTypes,
			bonusStatus,
			startDate,
			endDate,
			claimStatuses,
			currencyIds,
			baseCurrencyId,
			pageNumber: current,
			pageSize,
			isGroupByDate: groupBy === GroupByEnum.Date,
			orderBy,
			orderByProperty,
			orderByDirection,
		}
		try {
			await getBonusInfo({
				siteId,
				...args,
			}).unwrap()
			setQueryParams({ ...args, timeZone: currentTimeZoneUtcOffset })
			setPagination(prev => ({ ...prev, current, pageSize }))
			setFormGroupByDate(groupBy === GroupByEnum.Date)
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
			bonusTypes = [],
			bonusStatus = [],
			startDate,
			endDate,
			claimStatuses = [],
			currencyIds = [],
			baseCurrencyId = 0,
			isGroupByDate,
			orderBy,
			orderByProperty = '',
			orderByDirection = 0,
		} = queryParams

		try {
			const blob = await exportBonusInfo({
				siteId,
				bonusCode,
				startDate,
				endDate,
				bonusTypes: bonusTypes.map((value: string) => Number(value)),
				bonusStatus: bonusStatus.map((value: string) => Number(value)),
				claimStatuses: claimStatuses.map((value: string) => Number(value)),
				currencyIds: currencyIds.map((value: string) => Number(value)),
				baseCurrencyId: Number(baseCurrencyId),
				isGroupByDate: !!isGroupByDate,
				orderBy: !!orderBy,
				orderByProperty,
				orderByDirection: Number(orderByDirection),
			}).unwrap()

			download(blob, `BonusInfoReport${moment().format('YYYYMMDDHHmmss')}.xlsx`)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleClickBonusCode = (record: IBonusInfoData) => {
		const { bonusCode, recordDate } = record
		// groupBy Date 時會用到 recordDate 這個參數
		bonusDetailForm.setFieldsValue({
			bonusCode,
			recordDate: moment(recordDate).format(dateFormat),
		})
		if (formGroupByDate) {
			// 篩出特定時間的 bonusCode => 排序
			setCurrentBonusCodes(
				uniq(
					bonusInfo
						.filter(
							({ recordDate: dataRecordDate }) =>
								moment(dataRecordDate).format(dateFormat) ===
								moment(recordDate).format(dateFormat)
						)
						.map(({ bonusCode: dataBonusCode }) => dataBonusCode)
				)
			)
			// 先取所有時間 => 去重 => 排序
			setCurrentDates(
				lodashOrderBy(
					uniq(
						bonusInfo.map(({ recordDate: dataRecordDate }) =>
							moment(dataRecordDate).format(dateFormat)
						)
					)
				)
			)
		} else {
			setCurrentBonusCodes(
				uniq(bonusInfo.map(({ bonusCode: dataBonusCode }) => dataBonusCode))
			)
		}

		handleGetBonusDetail({ bonusCode })
		setShowDetails(true)
	}

	const handleRecordDateChange = (date: string) => {
		const newBonusCodes = uniq(
			bonusInfo
				.filter(
					({ recordDate: dataRecordDate }) =>
						moment(dataRecordDate).format(dateFormat) === date
				)
				.map(({ bonusCode: dataBonusCode }) => dataBonusCode)
		)
		bonusDetailForm.resetFields(['bonusCode'])
		setCurrentBonusCodes(newBonusCodes)
		// 清除 table 資料，待下次選擇 bonusCode
		setBonusDetail([])
	}

	// getBonusDetail
	const handleGetBonusDetail = async ({
		bonusCode,
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		// 預設用 claimStatus 做排序
		orderByProperty = 'claimStatus',
		orderByDirection = OrderByTypeEnum.ascend as number,
	}: {
		bonusCode: string
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
		const { recordDate } = bonusDetailForm.getFieldsValue(true)
		try {
			bonusDetailForm.setFieldsValue({
				orderByProperty,
				orderByDirection,
			})
			const { data: bonusDetailData = [] } = await getBonusDetail({
				siteId,
				startDate: formGroupByDate
					? utcFormatter({
							date: moment(recordDate).startOf('day'),
							utcOffset: timeZoneUtcOffset,
					  })
					: startDate,
				endDate: formGroupByDate
					? utcFormatter({
							date: moment(recordDate).endOf('day'),
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
		const { bonusCode } = bonusDetailForm.getFieldsValue()
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		if (sorter.order) {
			await handleGetBonusDetail({
				bonusCode,
				current,
				pageSize,
				orderByProperty: sorter.field as string,
				orderByDirection: orderDirectionConverter(sorter.order as string),
			})
		} else {
			await handleGetBonusDetail({
				bonusCode,
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
		const { bonusCode, orderByProperty, orderByDirection, recordDate } =
			bonusDetailForm.getFieldsValue(true)
		try {
			const blob = await exportBonusDetail({
				bonusCode,
				siteId,
				startDate: formGroupByDate
					? utcFormatter({
							date: moment(recordDate).startOf('day'),
							utcOffset: timeZoneUtcOffset,
					  })
					: startDate,
				endDate: formGroupByDate
					? utcFormatter({
							date: moment(recordDate).endOf('day'),
							utcOffset: timeZoneUtcOffset,
					  })
					: endDate,
				orderBy: true,
				orderByProperty,
				orderByDirection,
				baseCurrencyId: Number(baseCurrencyId),
				claimStatuses: claimStatuses.map((value: string) => Number(value)),
				currencyIds: currencyIds.map((value: string) => Number(value)),
			}).unwrap()
			download(
				blob,
				`BonusDetailReport${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// Detail Table 上的 BonusCode 異動
	const handleBonusCodeChange = (value: string) => {
		handleGetBonusDetail({ bonusCode: value })
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
					isGroupByDate,
					orderBy,
					orderByProperty = '',
					orderByDirection = 0,
					pageSize,
					pageNumber,
					timeZone,
				} = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					bonusCode,
					orderBy: !!orderBy,
					orderByProperty,
					groupBy: isGroupByDate ? GroupByEnum.Date : GroupByEnum.BonusCode,
					orderByDirection: Number(orderByDirection),
					baseCurrencyId: Number(baseCurrencyId),
					dateRange: [moment(startDate), moment(endDate)],
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
				currencyListBySite={currencyListBySite}
				timeZoneUtcOffset={timeZoneUtcOffset}
				claimStatusList={claimStatusList}
				bonusStatusList={bonusStatusList}
				bonusTypeList={bonusTypeList}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={() => {
					// 使用 filter 搜尋時因條件改變，移除 detailTable
					setShowDetails(false)
					handleSearch({})
				}}
			/>
			{!isEmpty(queryParams) && (
				<BonusInfoTable
					loading={isGetBonusInfoLoading || isExportBonusInfoLoading}
					isGroupByDate={formGroupByDate}
					bonusInfo={bonusInfo}
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
					isGroupByDate={formGroupByDate}
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

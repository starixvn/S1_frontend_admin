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
	IBonusInfoData,
	IFilterForm,
} from 'features/bonusInfo/type'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { useEffect, useState } from 'react'
import { dateRangeToUtcFormatter } from 'common/utils'
import { GroupByEnum } from 'features/bonusInfo/constants'
import { isEmpty, uniq } from 'lodash'
import { BonusInfoTable } from 'features/bonusInfo/BonusInfoTable'
import { SorterResult } from 'antd/es/table/interface'
import { IGetBetListData, OrderByTypeEnum } from 'features/betList/type'
import { orderDirectionConverter } from 'features/betList/converter'
import { BonusDetailTable } from 'features/bonusInfo/BonusDetailTable'
import { AffixButtons } from 'components/AffixButtons'

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
	// 僅用來控制 detail table 是否顯示
	const [showDetails, setShowDetails] = useState<boolean>(false)

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
		data: { data: bonusStatusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetBonusStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'PromotionStatusEnum' })

	const {
		data: { data: bonusTypeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetBonusTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BonusSummaryType' })

	// Bonus Info
	const {
		data: { data: claimStatusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetClaimStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BonusInfoStatusEnum' })

	// TransactionType
	const { data: { data: transactionTypeList = [] } = {} as IEnumTypeResponse } =
		useGetEnumTypeQuery({ enumName: 'BonusSummaryTransactionType' })

	const [exportBonusInfo, { isLoading: isExportBonusInfoLoading }] =
		useExportBonusInfoMutation()

	// Bonus Detail
	const [
		getBonusDetail,
		{
			data: { data: bonusDetail = [], rowCount: bonusDetailTotal = 0 } = {},
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
				bonusTypes: bonusTypes.map((value: string) => Number(value)),
				bonusStatus: bonusStatus.map((value: string) => Number(value)),
				startDate,
				endDate,
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

	const handleClickBonusCode = (bonusCode: string) => {
		setCurrentBonusCodes(
			uniq(bonusInfo.map(({ bonusCode: dataBonusCode }) => dataBonusCode))
		)
		handleGetBonusDetail({ bonusCode })
		setShowDetails(true)
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
		try {
			bonusDetailForm.setFieldsValue({
				bonusCode,
				orderByProperty,
				orderByDirection,
			})
			await getBonusDetail({
				siteId,
				startDate,
				endDate,
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
		sorter: SorterResult<IGetBetListData>
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
		const { bonusCode, orderByProperty, orderByDirection } =
			bonusDetailForm.getFieldsValue(true)
		try {
			const blob = await exportBonusDetail({
				bonusCode,
				siteId,
				startDate,
				endDate,
				claimStatuses: claimStatuses.map((value: string) => Number(value)),
				currencyIds: currencyIds.map((value: string) => Number(value)),
				baseCurrencyId: Number(baseCurrencyId),
				orderBy: true,
				orderByProperty,
				orderByDirection,
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
					dateRange: [moment(startDate), moment(endDate)],
					bonusCode,
					bonusTypes: bonusTypes.map((value: string) => Number(value)),
					bonusStatus: bonusStatus.map((value: string) => Number(value)),
					claimStatuses: claimStatuses.map((value: string) => Number(value)),
					currencyIds: currencyIds.map((value: string) => Number(value)),
					baseCurrencyId: Number(baseCurrencyId),
					groupBy: isGroupByDate ? GroupByEnum.Date : GroupByEnum.BonusCode,
					orderBy: !!orderBy,
					orderByProperty,
					orderByDirection: Number(orderByDirection),
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
					bonusDetail={bonusDetail}
					currentBonusCodes={currentBonusCodes}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={bonusDetailPagination}
					transactionTypeList={transactionTypeList}
					claimStatusList={claimStatusList}
					exportExcelPermission={exportExcelPermission}
					onBonusCodeChange={handleBonusCodeChange}
					onTableChange={handleBonusDetailTableChange}
					onExportClick={handleExportBonusDetail}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BonusInfo

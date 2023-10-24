import { FC, useEffect } from 'react'
import { isArray, isEmpty, isNumber, reject } from 'lodash'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import download from 'downloadjs'
import { dateRangeToUtcFormatter } from 'common/utils'
import type { SorterResult } from 'antd/es/table/interface'
import { orderDirectionConverter } from 'features/betList/converter'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'
import { BetListFilter } from './BetListFilter'
import {
	IGetBetListArgs,
	IGetBetListData,
	IGetBetListResponse,
	IGetCategoryResponse,
	IGetProductsResponse,
	IGetProvidersResponse,
	IGetTagsResponse,
	IGetVipLevelsResponse,
	OrderByTypeEnum,
} from './type'
import {
	useExportBetListFileMutation,
	useGetCategoryQuery,
	useGetProductsQuery,
	useGetProvidersQuery,
	useGetTagsQuery,
	useGetVipLevelsQuery,
	useLazyGetBetListQuery,
} from './api'
import { BetListTable } from './BetListTable'

const BetList: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm()
	const { siteId = 0 } = useAppSelector(selectUserSite) ?? {}

	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const {
		data: { data: providersList } = {} as IGetProvidersResponse,
		isFetching: isGetProvidersFetching,
	} = useGetProvidersQuery(null)

	const {
		data: { data: products } = {} as IGetProductsResponse,
		isFetching: isGetProductsFetching,
	} = useGetProductsQuery({ siteId: [siteId] })

	const {
		data: { data: categories } = {} as IGetCategoryResponse,
		isFetching: isGetCategoryFetching,
	} = useGetCategoryQuery(null)

	const {
		data: { data: tagList } = {} as IGetTagsResponse,
		isFetching: isGetTagListFetching,
	} = useGetTagsQuery(null)

	const {
		data: { data: vipLevels } = {} as IGetVipLevelsResponse,
		isFetching: isGetVipLevelsFetching,
	} = useGetVipLevelsQuery(null)

	const {
		data: { data: memberTypeEnums = [] } = {},
		isLoading: isMemberTypeEnumsLoading,
	} = useGetEnumTypeQuery({
		enumName: 'MemberTypeEnum',
	})

	const [
		getBetList,
		{
			data: {
				data: betListData,
				rowCount: BetListDataTotal = 0,
			} = {} as IGetBetListResponse,
			isFetching: isGetBetListFetching,
		},
	] = useLazyGetBetListQuery()

	const [exportBetListFile, { isLoading: isExportBetListLoading }] =
		useExportBetListFileMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: BetListDataTotal,
	})

	const onChangeCurrency = (newCurrencyIds: number[]) => {
		if (newCurrencyIds.includes(0)) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(item => item.currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
		// 預設用結算時間降序排
		orderBy = true,
		orderByProperty = 'settledTime',
		orderByDirection = OrderByTypeEnum.descend as number,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
		orderBy?: boolean
		orderByProperty?: string
		orderByDirection?: number
	}) => {
		if (!siteId) return
		const {
			tags = [],
			dateRange,
			vipLevel = 0,
			tpId = 0,
			userName = '',
			tpUserName = '',
			refNo = '',
			gameType = 0,
			category: rawCategory = '',
			game = '',
			title = '',
			matchID = '',
			betType = '',
			ip = '',
			stake = 0,
			winLostAmount = 0,
			transId = '',
			memberTypes,
		} = form.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		let { currencyIds } = form.getFieldsValue()
		if (currencyIds.length === 0) {
			currencyIds = currencyListBySite?.map(item => item.currencyId)
			form.setFieldsValue({
				currencyIds,
			})
		}

		// api 接受參數 category 字串中不可有空白字元
		const category = rawCategory.replace(/ /g, '')

		try {
			const args: IGetBetListArgs = {
				siteIds: [siteId],
				currencyIds,
				tags,
				vipLevel,
				tpId,
				userName,
				tpUserName,
				refNo,
				gameType,
				category,
				game,
				title,
				matchID,
				betType,
				ip,
				stake,
				pageNumber: current,
				pageSize,
				startTime,
				endTime,
				winLostAmount,
				transId,
				orderBy,
				orderByProperty,
				orderByDirection,
				memberTypes,
			}
			await getBetList(args).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	const handleTableChange = async (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IGetBetListData>
	) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		// 檢查是否有開啟 sorter功能
		if (sorter.order) {
			const orderBy = true
			const orderByProperty = sorter.field as string
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
			// 取消排序使用預設
			await handleSearch({
				current,
				pageSize,
				currentTimeZoneUtcOffset: timeZoneUtcOffset,
			})
		}
	}

	const handleExport = async () => {
		if (!siteId) return
		const {
			currencyIds,
			tags = [],
			vipLevel = 0,
			tpId = 0,
			userName = '',
			tpUserName = '',
			refNo = '',
			gameType = 0,
			category = '',
			game = '',
			title = '',
			matchID = '',
			betType = '',
			ip = '',
			stake = 0,
			winLostAmount = 0,
			transId = '',
			pageNumber,
			pageSize,
			startTime,
			endTime,
			memberTypes = [],
		} = queryParams
		try {
			const args: IGetBetListArgs = {
				siteIds: [siteId],
				currencyIds,
				tags,
				vipLevel,
				tpId,
				userName,
				tpUserName,
				refNo,
				gameType,
				category,
				game,
				title,
				matchID,
				betType,
				ip,
				stake,
				pageNumber: Number(pageNumber),
				pageSize: Number(pageSize),
				startTime,
				endTime,
				winLostAmount,
				transId,
				memberTypes: memberTypes?.map((value: string) => Number(value)) ?? [],
			}

			const blob = await exportBetListFile(args).unwrap()

			download(blob, `BetListReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const {
				currencyIds,
				tags,
				vipLevel,
				tpId,
				userName,
				tpUserName,
				refNo,
				gameType,
				category,
				game,
				title,
				matchID,
				betType,
				ip,
				stake,
				pageNumber,
				pageSize,
				startTime,
				endTime,
				transId,
				winLostAmount,
				timeZone,
				memberTypes,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				userName,
				tags,
				vipLevel: vipLevel ? Number(vipLevel) : vipLevel,
				tpId: isNumber(tpId) ? Number(tpId) : undefined,
				gameType: isNumber(gameType) ? Number(gameType) : undefined,
				tpUserName,
				refNo,
				category,
				game,
				title,
				matchID,
				betType,
				ip,
				stake,
				transId,
				winLostAmount,
				memberTypes: isArray(memberTypes)
					? memberTypes.map((value: string) => Number(value))
					: [],
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [])

	const loading =
		isGetProvidersFetching ||
		isGetProductsFetching ||
		isGetCategoryFetching ||
		isGetVipLevelsFetching ||
		isGetBetListFetching ||
		isGetTagListFetching ||
		isMemberTypeEnumsLoading

	const filterLoading = isGetBetListFetching || isMemberTypeEnumsLoading

	useEffect(() => {
		if (!filterLoading) {
			// 預設排除直播主
			form.setFieldsValue({
				memberTypes: reject(memberTypeEnums, [
					'value',
					UserTypeEnum.LiveStreaming,
				]).map(({ value }) => Number(value)),
			})
		}
	}, [isMemberTypeEnumsLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BetListFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				onChangeCurrency={onChangeCurrency}
				currencyList={currencyListBySite}
				providers={providersList}
				products={products}
				categories={categories}
				tagList={tagList}
				siteId={siteId}
				vipLevels={vipLevels}
				memberTypeEnums={memberTypeEnums}
			/>
			{!isEmpty(queryParams) && (
				<BetListTable
					loading={loading}
					pagination={pagination}
					onTableChange={handleTableChange}
					betListData={betListData}
					timeZoneUtcOffset={timeZoneUtcOffset}
					tagList={tagList}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportBetListLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BetList

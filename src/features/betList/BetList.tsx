import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
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
import { BetListFilter } from './BetListFilter'
import {
	IGetBetListResponse,
	IGetCategoryResponse,
	IGetProductsResponse,
	IGetProvidersResponse,
	IGetTagsResponse,
	IGetVipLevelsResponse,
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
import { dateRangeToUtcFormatter } from '../../common/utils'

const BetList: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
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
	} = useGetProductsQuery(null)

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
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
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
			provider = '',
			product = '',
			category = '',
			game = '',
			title = '',
			matchID = '',
			betType = '',
			ip = '',
			stake = 0,
			winLostAmount = 0,
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
		try {
			const args = {
				currencyIds,
				tags,
				vipLevel,
				tpId,
				userName,
				tpUserName,
				refNo,
				provider,
				product,
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
			}
			await getBetList({
				siteIds: [siteId],
				...args,
			}).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}
	const handleExport = async () => {
		if (isEmpty(queryParams) || !siteId) return
		const {
			currencyIds,
			tags,
			vipLevel,
			tpId,
			userName,
			tpUserName,
			refNo,
			provider,
			product,
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
			winLostAmount,
		} = queryParams
		try {
			const blob = await exportBetListFile({
				currencyIds,
				tags,
				vipLevel,
				tpId,
				userName,
				tpUserName,
				refNo,
				provider,
				product,
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
				siteIds: [siteId],
			}).unwrap()

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
				provider,
				product,
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
				winLostAmount,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				userName,
				tags,
				vipLevel: vipLevel ? Number(vipLevel) : vipLevel,
				tpId,
				tpUserName,
				refNo,
				provider,
				product,
				category,
				game,
				title,
				matchID,
				betType,
				ip,
				stake,
				winLostAmount,
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
		isGetTagListFetching
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
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportBetListLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BetList

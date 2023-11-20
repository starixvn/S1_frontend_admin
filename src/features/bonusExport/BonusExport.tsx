import { FC, useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import {
	useExportBonusListMutation,
	useGetBonusEventNamesQuery,
	useGetDrawPrizesEventNamesQuery,
	useLazyGetBonusListQuery,
} from 'features/bonusExport/api'
import {
	IDrawPrizesEventNameResponse,
	IGetBonusEventNamesResponse,
	IGetBonusListResponse,
} from 'features/bonusExport/type'
import { AffixButtons } from 'components/AffixButtons'
import { Form, message, TablePaginationConfig } from 'antd'
import { useAppSelector } from 'app/store'
import {
	selectAllSiteEnableCurrencyList,
	selectCurrencyIdsBySiteIds,
	selectCurrencyListBySite,
	selectUserSiteList,
} from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import {
	IGetCategoryResponse,
	IVipLevelsResponse,
	useGetCategoryQuery,
	useGetVipLevelQuery,
} from 'common/service/allDataApi'
import { BonusExportFilter } from 'features/bonusExport/BonusExportFilter'
import { BonusExportTable } from 'features/bonusExport/BonusExportTable'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment/moment'
import { dateRangeToUtcFormatter } from 'common/utils'
import download from 'downloadjs'

const BonusExport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm<{
		siteIds: []
		dateRange: [moment.Moment, moment.Moment]
		currencyIds: number[]
		baseCurrencyId: number
		eventTypeId: number
		eventNames: string[] | string
		userName: string
		tpUserName: string
		bonusCode: string
		transId: string
	}>()
	const watchSiteIds = Form.useWatch('siteIds', form)
	const userSiteList = useAppSelector(selectUserSiteList)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)

	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const {
		data: { data: drawPrizesEventNames } = {} as IDrawPrizesEventNameResponse,
		isLoading: isGetDrawPrizesEventNamesLoading,
	} = useGetDrawPrizesEventNamesQuery(null)

	const {
		data: { data: vipUpgradeEventNames } = {} as IVipLevelsResponse,
		isLoading: isGetVipUpgradeEventNamesLoading,
	} = useGetVipLevelQuery({ siteIdsForFilter: watchSiteIds })

	const {
		data: { data: vipRebateEventNames } = {} as IGetCategoryResponse,
		isLoading: isGetVipRebateEventNamesLoading,
	} = useGetCategoryQuery(null)

	const {
		data: { data: bonusEventNames } = {} as IGetBonusEventNamesResponse,
		isLoading: isGetBonusEventNamesLoading,
	} = useGetBonusEventNamesQuery(null)

	const [
		getBonusList,
		{
			data: {
				data: bonusList,
				rowCount: bonusListTotal = 0,
			} = {} as IGetBonusListResponse,
			isFetching: isGetBonusListLoading,
		},
	] = useLazyGetBonusListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bonusListTotal,
	})

	const [exportBonusList, { isLoading: isExportBonusListLoading }] =
		useExportBonusListMutation()

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
			dateRange,
			eventNames: rawEventNames,
			...args
		} = form.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		const eventNames = isArray(rawEventNames) ? rawEventNames : [rawEventNames]

		try {
			await getBonusList({
				startDate,
				endDate,
				eventNames,
				pageNumber: current,
				pageSize,
				...args,
			}).unwrap()

			setQueryParams({
				startDate,
				endDate,
				eventNames,
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
		const {
			siteIds = [],
			startDate,
			endDate,
			eventNames,
			currencyIds,
			eventTypeId = 0,
			baseCurrencyId = 0,
			userName = '',
			tpUserName = '',
			transId = '',
			bonusCode = '',
		} = queryParams

		try {
			const blob = await exportBonusList({
				siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
				startDate,
				endDate,
				eventNames,
				currencyIds:
					currencyIds?.map((currency: string) => Number(currency)) ?? [],
				baseCurrencyId: Number(baseCurrencyId),
				eventTypeId: Number(eventTypeId),
				userName,
				tpUserName,
				transId,
				bonusCode,
			}).unwrap()

			download(
				blob,
				`ExportBonusReport${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
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
				startDate,
				endDate,
				timeZone,
				pageNumber,
				pageSize,
				currencyIds,
				baseCurrencyId = 0,
				eventTypeId = 0,
				eventNames = [],
				userName = '',
				bonusCode = '',
				tpUserName = '',
				transId = '',
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				userName,
				baseCurrencyId: Number(baseCurrencyId),
				eventTypeId: Number(eventTypeId),
				eventNames,
				bonusCode,
				tpUserName,
				transId,
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
		isGetDrawPrizesEventNamesLoading ||
		isGetBonusListLoading ||
		isGetVipUpgradeEventNamesLoading ||
		isGetVipRebateEventNamesLoading ||
		isGetBonusEventNamesLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BonusExportFilter
				form={form}
				loading={loading}
				currencyList={currencyListBySite}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				currencyListByAllSite={currencyListByAllSite}
				timeZoneUtcOffset={timeZoneUtcOffset}
				drawPrizesEventNames={drawPrizesEventNames}
				vipUpgradeEventNames={vipUpgradeEventNames}
				vipRebateEventNames={vipRebateEventNames}
				bonusEventNames={bonusEventNames}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{!isEmpty(queryParams) && (
				<BonusExportTable
					loading={loading}
					pagination={pagination}
					onTableChange={handleTableChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
					bonusListData={bonusList}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportBonusListLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BonusExport

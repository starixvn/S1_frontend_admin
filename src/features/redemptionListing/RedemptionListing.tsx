import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import download from 'downloadjs'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	usePagination,
	useQueryParams,
	PAGINATION,
	useAuth,
} from 'common/hooks'
import { useAppSelector } from 'app/store'
import { dateRangeToUtcFormatter } from 'common/utils'
import { selectRewardsCurrencyListBySite, selectUserSite } from 'common/enum'
import { RedemptionListingFilter } from './RedemptionListingFilter'
import {
	useExportRedemptionListMutation,
	useGetVipLevelQuery,
	useLazyGetRedemptionListQuery,
} from './api'
import { IGetRedemptionListResponse } from './type'
import { RedemptionListingTable } from './RedemptionListingTable'
import { RedemptionOverviewTable } from './RedemptionOverviewTable'

const RedemptionListing: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission, editPermission } = {} } =
		useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectRewardsCurrencyListBySite)

	const [
		getRedemptionList,
		{
			data: { data: redemptionData } = {} as IGetRedemptionListResponse,
			isFetching: isGetRedemptionListLoading,
		},
	] = useLazyGetRedemptionListQuery()

	const {
		list: {
			rowCount: redemptionTotal = 0,
			datas: redemptionListData = [],
		} = {},
		overview: redemptionOverviewData = [],
	} = redemptionData ?? {}

	const [exportRedemptionList, { isLoading: isExportRedemptionListLoading }] =
		useExportRedemptionListMutation()
	const [pagination, setPagination] = usePagination({
		paginationTotal: redemptionTotal,
	})

	const {
		data: { data: vipLevelsList = [] } = {},
		isLoading: isGetVipLevelLoading,
	} = useGetVipLevelQuery(null)

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
			userName = '',
			sabaId = '',
			transId = '',
			vipLevels,
			statuses,
			currencyIds,
			dateRange,
		} = form.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		try {
			const args = {
				userName,
				sabaId,
				transId,
				vipLevels,
				statuses,
				currencyIds,
				startTime,
				endTime,
				pageNumber: current,
				pageSize,
			}
			await getRedemptionList({ siteId, ...args }).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const {
			userName = '',
			sabaId = '',
			transId = '',
			vipLevels,
			statuses,
			currencyIds,
			startTime,
			endTime,
		} = queryParams

		try {
			const blob = await exportRedemptionList({
				siteId: Number(siteId),
				userName,
				sabaId,
				transId,
				vipLevels: vipLevels?.map((vipLevel: string) => Number(vipLevel)) ?? [],
				statuses: statuses?.map((status: string) => Number(status)) ?? [],
				currencyIds:
					currencyIds?.map((currencyId: string) => Number(currencyId)) ?? [],
				startTime,
				endTime,
			}).unwrap()
			download(
				blob,
				`ExportRedemptionList_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
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
		handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const {
				timeZone,
				pageNumber,
				pageSize,
				userName = '',
				sabaId = '',
				transId = '',
				vipLevels,
				statuses,
				currencyIds,
				startTime,
				endTime,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				userName,
				sabaId,
				transId,
				vipLevels: vipLevels.map((vipLevel: string) => Number(vipLevel)),
				statuses: statuses.map((status: string) => Number(status)),
				currencyIds: currencyIds.map((currencyId: string) =>
					Number(currencyId)
				),
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [])

	const loading = isGetVipLevelLoading || isGetRedemptionListLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<RedemptionListingFilter
				form={form}
				loading={loading}
				onSearch={handleSearch}
				currencyListBySite={currencyListBySite}
				vipLevelsList={vipLevelsList}
				siteId={siteId}
				onTimeZoneChange={onTimeZoneChange}
				timeZoneUtcOffset={timeZoneUtcOffset}
			/>
			{!isEmpty(queryParams) && (
				<RedemptionListingTable
					loading={loading}
					redemptionListData={redemptionListData}
					pagination={pagination}
					editPermission={editPermission}
					onTableChange={handleTableChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
			)}
			{redemptionOverviewData.length > 0 && (
				<RedemptionOverviewTable
					redemptionOverviewData={redemptionOverviewData}
					loading={loading}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportRedemptionListLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default RedemptionListing

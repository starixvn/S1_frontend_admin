import { FC, useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { useAppSelector } from 'app/store'
import { selectRewardsCurrencyListBySite, selectUserSite } from 'common/enum'
import { IGetVipLevelsResponse } from 'features/redemptionListing/type'
import { useGetVipLevelQuery } from 'features/redemptionListing/api'
import { IGetCategoryResponse } from 'features/betList/type'
import { useGetCategoryQuery } from 'features/betList/api'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { TurnoverPointReportListTable } from 'features/turnoverPointReport/TurnoverPointReportListTable'
import { TurnoverPointReportFilter } from 'features/turnoverPointReport/TurnoverPointReportFilter'
import { isEmpty } from 'lodash'
import {
	useExportTurnoverPointReportMutation,
	useLazyGetTurnoverPointReportQuery,
} from 'features/turnoverPointReport/api'
import { IGetTurnoverPointReportResponse } from 'features/turnoverPointReport/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { TurnoverPointReportOverviewTable } from 'features/turnoverPointReport/TurnoverPointReportOverviewTable'
import download from 'downloadjs'
import moment from 'moment'

const TurnoverPointReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectRewardsCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const [queryParams, setQueryParams] = useQueryParams()

	const [
		getTurnoverPointReport,
		{
			data: { data: turnoverPointData } = {} as IGetTurnoverPointReportResponse,
			isFetching: isGetTurnoverPointReportFetching,
		},
	] = useLazyGetTurnoverPointReportQuery()

	const {
		list: {
			rowCount: turnoverPointReportTotal = 0,
			datas: turnoverPointListData = [],
		} = {},
		overview: turnoverPointReportOverviewData = [],
	} = turnoverPointData ?? {}

	const [pagination, setPagination] = usePagination({
		paginationTotal: turnoverPointReportTotal,
	})

	const [
		exportTurnoverPointReport,
		{ isLoading: isExportTurnoverPointReportLoading },
	] = useExportTurnoverPointReportMutation()

	const {
		data: { data: vipLevelsList } = {} as IGetVipLevelsResponse,
		isLoading: isGetVipLevelLoading,
	} = useGetVipLevelQuery(null)

	const filteredVipLevelsList = vipLevelsList?.filter(
		item => item.siteId === siteId
	)

	const {
		data: { data: categoryList } = {} as IGetCategoryResponse,
		isFetching: isGetCategoryFetching,
	} = useGetCategoryQuery(null)

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
			currencyIds,
			vipLevels,
			categories,
			userName = '',
			sabaId = '',
		} = form.getFieldsValue()

		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		try {
			const args = {
				userName,
				sabaId,
				categories,
				vipLevels,
				currencyIds,
				startTime,
				endTime,
				pageNumber: current,
				pageSize,
			}
			await getTurnoverPointReport({ siteId, ...args }).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })
			setPagination(prev => ({
				...prev,
				current,
				pageSize,
			}))
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
			dateRange,
			currencyIds,
			vipLevels,
			categories,
			userName = '',
			sabaId = '',
		} = form.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			const args = {
				userName,
				sabaId,
				categories,
				vipLevels,
				currencyIds,
				startTime,
				endTime,
				siteId,
			}
			const blob = await exportTurnoverPointReport(args).unwrap()
			download(
				blob,
				`ExportTurnoverPointReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (isGetCategoryFetching || isGetVipLevelLoading) return
		const init = () => {
			form.setFieldsValue({
				vipLevels: filteredVipLevelsList?.map(level => level.level),
				categories: categoryList?.map(category => category.categoryId),
			})
			if (isEmpty(queryParams)) return
			const {
				timeZone,
				pageNumber,
				pageSize,
				userName = '',
				sabaId = '',
				categories,
				vipLevels,
				currencyIds,
				startTime,
				endTime,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				userName,
				sabaId,
				currencyIds: currencyIds.map((currencyId: string) =>
					Number(currencyId)
				),
				vipLevels: vipLevels.map((vipLevel: string) => Number(vipLevel)),
				categories: categories.map((category: string) => Number(category)),
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [isGetCategoryFetching, isGetVipLevelLoading])

	const loading =
		isGetVipLevelLoading ||
		isGetCategoryFetching ||
		isGetTurnoverPointReportFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<TurnoverPointReportFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				currencyListBySite={currencyListBySite}
				vipLevelsList={filteredVipLevelsList}
				onTimeZoneChange={onTimeZoneChange}
				categories={categoryList}
			/>
			{!isEmpty(queryParams) && (
				<TurnoverPointReportListTable
					timeZoneUtcOffset={timeZoneUtcOffset}
					loading={loading}
					pagination={pagination}
					onTableChange={handleTableChange}
					turnoverPointReportListData={turnoverPointListData}
				/>
			)}
			{turnoverPointReportOverviewData.length > 0 && (
				<TurnoverPointReportOverviewTable
					loading={loading}
					turnoverPointReportOverviewData={turnoverPointReportOverviewData}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportTurnoverPointReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default TurnoverPointReport

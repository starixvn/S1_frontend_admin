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
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	useExportAdjustmentPointReportMutation,
	useLazyGetAdjustmentPointReportQuery,
} from './api'
import { useGetVipLevelQuery } from '../redemptionListing/api'
import { IGetVipLevelsResponse } from '../redemptionListing/type'
import { IGetAdjustmentPointReportResponse } from './type'
import { AdjustmentPointReportFilter } from './AdjustmentPointReportFilter'
import { AdjustmentPointReportTable } from './AdjustmentPointReportTable'
import { AdjustmentPointOverviewTable } from './AdjustmentPointOverviewTable'

const AdjustmentPointReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const [
		getAdjustmentPointReport,
		{
			data: {
				data: adjustmentPointData,
			} = {} as IGetAdjustmentPointReportResponse,
			isFetching: isGetAdjustmentPointLoading,
		},
	] = useLazyGetAdjustmentPointReportQuery()

	const {
		list: {
			rowCount: adjustmentTotal = 0,
			datas: adjustmentListData = [],
		} = {},
		overview: adjustmentOverviewData = [],
	} = adjustmentPointData ?? {}

	const [pagination, setPagination] = usePagination({
		paginationTotal: adjustmentTotal,
	})

	const [
		exportAdjustmentPointReport,
		{ isLoading: isExportAdjustmentPointReportLoading },
	] = useExportAdjustmentPointReportMutation()
	const {
		data: { data: vipLevelsList } = {} as IGetVipLevelsResponse,
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
			currencyIds,
			dateRange,
			adjustTypes,
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
				currencyIds,
				startTime,
				endTime,
				adjustTypes,
				pageNumber: current,
				pageSize,
			}
			await getAdjustmentPointReport({ siteId, ...args }).unwrap()
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
			currencyIds,
			dateRange,
			adjustTypes,
		} = form.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			const blob = await exportAdjustmentPointReport({
				siteId,
				userName,
				sabaId,
				transId,
				vipLevels,
				currencyIds,
				adjustTypes,
				startTime,
				endTime,
			}).unwrap()
			download(
				blob,
				`ExportAdjustmentPointReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
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
				adjustTypes,
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
				adjustTypes: adjustTypes.map((type: string) => Number(type)),
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

	const loading = isGetVipLevelLoading || isGetAdjustmentPointLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<AdjustmentPointReportFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				currencyListBySite={currencyListBySite}
				vipLevelsList={vipLevelsList}
				onTimeZoneChange={onTimeZoneChange}
				siteId={siteId}
			/>
			{!isEmpty(queryParams) && (
				<AdjustmentPointReportTable
					loading={loading}
					adjustmentListData={adjustmentListData}
					pagination={pagination}
					onTableChange={handleTableChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
			)}
			{adjustmentOverviewData.length > 0 && (
				<AdjustmentPointOverviewTable
					adjustmentOverviewData={adjustmentOverviewData}
					loading={loading}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportAdjustmentPointReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default AdjustmentPointReport

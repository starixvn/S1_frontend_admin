import { FC, useEffect } from 'react'
import { isArray, isEmpty } from 'lodash'
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
import { useGetVipLevelEnumBySiteIdQuery } from 'common/service/baseDataApi'
import { AdjustmentPointReportFilter } from 'features/adjustmentPointReport/AdjustmentPointReportFilter'
import {
	useExportAdjustmentPointReportMutation,
	useLazyGetAdjustmentPointReportQuery,
} from 'features/adjustmentPointReport/api'
import { AdjustmentPointReportTable } from 'features/adjustmentPointReport/AdjustmentPointReportTable'
import { AdjustmentPointOverviewTable } from 'features/adjustmentPointReport/AdjustmentPointOverviewTable'
import { IGetAdjustmentPointReportResponse } from 'features/adjustmentPointReport/type'

const AdjustmentPointReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectRewardsCurrencyListBySite)

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
		data: { data: vipLevelsList = [] } = {},
		isLoading: isGetVipLevelLoading,
	} = useGetVipLevelEnumBySiteIdQuery({ siteId })

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
			startTime,
			endTime,
			adjustTypes,
		} = queryParams
		try {
			const blob = await exportAdjustmentPointReport({
				siteId,
				userName,
				sabaId,
				transId,
				vipLevels: vipLevels?.map((vipLevel: string) => Number(vipLevel)) ?? [],
				currencyIds:
					currencyIds?.map((currencyId: string) => Number(currencyId)) ?? [],
				adjustTypes: adjustTypes?.map((type: string) => Number(type)) ?? [],
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

	const loading = isGetVipLevelLoading || isGetAdjustmentPointLoading

	useEffect(() => {
		if (isGetVipLevelLoading) return
		const init = () => {
			form.setFieldsValue({
				vipLevels: vipLevelsList.map(({ level }) => level),
			})
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
				vipLevels: isArray(vipLevels)
					? vipLevels.map((vipLevel: string) => Number(vipLevel))
					: [],
				adjustTypes: isArray(adjustTypes)
					? adjustTypes.map((type: string) => Number(type))
					: [],
				currencyIds: isArray(currencyIds)
					? currencyIds.map((currencyId: string) => Number(currencyId))
					: [],
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [isGetVipLevelLoading])

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
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportAdjustmentPointReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default AdjustmentPointReport

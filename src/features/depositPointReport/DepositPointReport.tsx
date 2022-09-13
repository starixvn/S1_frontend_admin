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
import { useGetVipLevelQuery } from '../redemptionListing/api'
import { IGetVipLevelsResponse } from '../redemptionListing/type'
import {
	useExportDepositPointReportMutation,
	useLazyGetDepositPointReportQuery,
} from './api'
import { IGetDepositPointReportResponse } from './type'
import { DepositPointReportFilter } from './DepositPointReportFilter'
import { DepositPointReportTable } from './DepositPointReportTable'
import { DepositPointReportOverviewTable } from './DepositPointReportOverviewTable'

const DepositPointReport: FC<{
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
		getDepositPointReport,
		{
			data: { data: depositPointData } = {} as IGetDepositPointReportResponse,
			isFetching: isGetDepositPointReportLoading,
		},
	] = useLazyGetDepositPointReportQuery()

	const {
		list: {
			rowCount: depositPointReportTotal = 0,
			datas: depositReportListData = [],
		} = {},
		overview: depositReportOverviewData = [],
	} = depositPointData ?? {}

	const [pagination, setPagination] = usePagination({
		paginationTotal: depositPointReportTotal,
	})

	const [
		exportDepositPointReport,
		{ isLoading: isExportDepositReportLoading },
	] = useExportDepositPointReportMutation()

	const {
		data: { data: vipLevelsList } = {} as IGetVipLevelsResponse,
		isLoading: isGetVipLevelLoading,
	} = useGetVipLevelQuery(null)

	const filteredVipLevelsList = vipLevelsList?.filter(
		item => item.siteId === siteId
	)

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
				pageNumber: current,
				pageSize,
			}
			await getDepositPointReport({ siteId, ...args }).unwrap()
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
		} = form.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			const blob = await exportDepositPointReport({
				siteId,
				userName,
				sabaId,
				transId,
				vipLevels,
				currencyIds,
				startTime,
				endTime,
			}).unwrap()
			download(
				blob,
				`ExportDepositPointReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
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
		if (isGetVipLevelLoading) return
		const init = () => {
			form.setFieldsValue({
				vipLevels: filteredVipLevelsList.map(item => item.level),
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
	}, [isGetVipLevelLoading])

	const loading = isGetVipLevelLoading || isGetDepositPointReportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<DepositPointReportFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				currencyListBySite={currencyListBySite}
				vipLevelsList={filteredVipLevelsList}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<DepositPointReportTable
					loading={loading}
					depositPointReportListData={depositReportListData}
					pagination={pagination}
					onTableChange={handleTableChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
			)}
			{depositReportOverviewData.length > 0 && (
				<DepositPointReportOverviewTable
					depositPointOverviewData={depositReportOverviewData}
					loading={loading}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportDepositReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositPointReport

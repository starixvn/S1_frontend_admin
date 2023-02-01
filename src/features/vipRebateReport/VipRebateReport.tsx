import download from 'downloadjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import VipRebateReportTable from 'features/vipRebateReport/VipRebateReportTable'
import {
	IGetListForVipResponse,
	IGetVipRebateDetailResponse,
	IVipRebateInfoData,
} from 'features/vipRebateReport/type'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter } from 'common/utils'
import { selectUserSite, selectVipCurrencyListBySite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import {
	useExportForVipMutation,
	useLazyGetListForVipQuery,
	useLazyGetVipRebateDetailQuery,
} from 'features/vipRebateReport/api'
import { useGetCategoryQuery } from 'common/service/allDataApi'
import { useAppSelector } from 'app/store'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import VipRebateReportFilter from 'features/vipRebateReport/VipRebateReportFilter'
import VipRebateReportDetailModal from 'features/vipRebateReport/VipRebateReportDetailModal'
import VipRebateReportOverviewTable from 'features/vipRebateReport/VipRebateReportOverviewTable'
import { isEmpty } from 'lodash'

interface IBonusReportProps {
	pageTitle?: string
}

export interface IFilterForm {
	dateRange: [moment.Moment, moment.Moment]
	userName: string
	categoryIds: number[]
	currencyIds: number[]
	baseCurrencyId: number
	payoutStatuses: number[]
	pageNumber: number
	pageSize: number
	timeZone: string
}

const VipRebateReport = ({ pageTitle }: IBonusReportProps) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [filterForm] = Form.useForm<IFilterForm>()
	const currencyListBySite = useAppSelector(selectVipCurrencyListBySite)
	const detailModal = useModal()
	const [selectedDetailTarget, setSelectedDetailTarget] =
		useState<IVipRebateInfoData | null>(null)
	const {
		data: { data: categoryList = [] } = {},
		isLoading: isGetCategoryListLoading,
	} = useGetCategoryQuery(null)

	const [
		getVipList,
		{
			data: {
				data: {
					currencyAmount: currencyInfo = [],
					vipRebateInfoList = [],
					rowCount: vipListTotal = 0,
				} = {},
			} = {} as IGetListForVipResponse,
			isFetching: isGetListForVipLoading,
		},
	] = useLazyGetListForVipQuery()

	const [exportForVip, { isLoading: isExportForVipLoading }] =
		useExportForVipMutation()

	const [
		gerVipRebateDetail,
		{
			data: { data: vipRebateDetail = [] } = {} as IGetVipRebateDetailResponse,
			isFetching: isGerVipRebateDetailLoading,
		},
	] = useLazyGetVipRebateDetailQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: vipListTotal,
	})

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
			categoryIds,
			currencyIds,
			baseCurrencyId,
			payoutStatuses,
			userName,
		} = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			const args = {
				siteIds: siteId ? [siteId] : [],
				currencyIds,
				startDate,
				endDate,
				userName,
				categoryIds,
				baseCurrencyId,
				payoutStatuses,
				pageNumber: current,
				pageSize,
			}
			await getVipList(args).unwrap()

			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })

			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleExport = async () => {
		const {
			dateRange,
			categoryIds,
			currencyIds,
			baseCurrencyId,
			payoutStatuses,
			userName,
		} = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		const args = {
			siteIds: siteId ? [siteId] : [],
			currencyIds,
			startDate,
			endDate,
			userName,
			categoryIds,
			baseCurrencyId,
			payoutStatuses,
		}
		try {
			const blob = await exportForVip(args).unwrap()
			download(
				blob,
				`ExportVipRebateReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDetailClick = async (record: IVipRebateInfoData) => {
		const { custId, categoryId: tpCategoryId, refId } = record
		await gerVipRebateDetail({
			custId,
			tpCategoryId,
			refId,
		}).unwrap()
		setSelectedDetailTarget(record)
		detailModal.onOpen()
	}

	const loading =
		isGetListForVipLoading ||
		isGetCategoryListLoading ||
		isGerVipRebateDetailLoading

	useEffect(() => {
		if (
			!isGetCategoryListLoading &&
			categoryList.length > 0 &&
			isEmpty(queryParams)
		) {
			filterForm.setFieldsValue({
				categoryIds: categoryList?.map(({ categoryId }) => categoryId),
			})
		}
	}, [isGetCategoryListLoading])

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const {
				startDate,
				endDate,
				userName,
				payoutStatuses,
				pageNumber,
				pageSize,
				timeZone,
				categoryIds,
				currencyIds,
				baseCurrencyId,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				categoryIds: categoryIds?.map((categoryId: string) =>
					Number(categoryId)
				),
				currencyIds: currencyIds?.map((currencyId: string) =>
					Number(currencyId)
				),
				baseCurrencyId: Number(baseCurrencyId),
				dateRange: [moment(startDate), moment(endDate)],
				userName,
				payoutStatuses: payoutStatuses?.map((status: string) => Number(status)),
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<VipRebateReportFilter
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				form={filterForm}
				onSearch={handleSearch}
				categoryList={categoryList}
				currencyListBySite={currencyListBySite}
			/>
			{!isEmpty(queryParams) && (
				<VipRebateReportTable
					vipRebateInfoList={vipRebateInfoList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					onDetailClicked={handleDetailClick}
				/>
			)}
			{currencyInfo.length > 0 && (
				<VipRebateReportOverviewTable
					currencyInfo={currencyInfo}
					loading={loading}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportForVipLoading}
				/>
			</AffixButtons>
			<VipRebateReportDetailModal
				detailModal={detailModal}
				selectedDetailTarget={selectedDetailTarget}
				vipRebateDetail={vipRebateDetail}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
			/>
		</LayoutContent.Main>
	)
}

export default VipRebateReport

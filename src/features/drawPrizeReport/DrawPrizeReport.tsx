import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useGetDrawPrizesEventNamesQuery } from 'features/bonusExport/api'
import {
	useExportDrawPrizeReportMutation,
	useLazyGetDrawPrizeLogQuery,
	useLazyGetDrawPrizeReportQuery,
} from 'features/drawPrizeReport/api'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { DrawPrizeReportFilter } from 'features/drawPrizeReport/DrawPrizeReportFilter'
import { useTimeZone } from 'components/TimeZoneSelect'
import { Form, message, TablePaginationConfig } from 'antd'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useEffect, useRef } from 'react'
import {
	IDrawPrizeReport,
	IFilterForm,
	IGetDrawPrizeReportData,
} from 'features/drawPrizeReport/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import download from 'downloadjs'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { DrawPrizeReportTable } from 'features/drawPrizeReport/DrawPrizeReportTable'
import { DrawPrizeOverviewTable } from 'features/drawPrizeReport/DrawPrizeOverviewTable'
import { DrawPrizeDetailModal } from 'features/drawPrizeReport/DrawPrizeDetailModal'

const DrawPrizeReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [filterForm] = Form.useForm<IFilterForm>()
	// 用來存取當前選擇的 record , 因為 detail api 有換頁機制 , 故需將當前 record 暫存起來供 query Api 使用
	const drawPrizeDetailRecord = useRef<IDrawPrizeReport | undefined>()
	const drawPrizeModal = useModal()

	const {
		data: { data: drawPrizesEventNames = [] } = {},
		isLoading: isGetDrawPrizesEventNamesLoading,
	} = useGetDrawPrizesEventNamesQuery(null)

	const [
		getDrawPrizeReport,
		{
			data: {
				data: drawPrizeReport,
			} = {} as IAxiosResponse<IGetDrawPrizeReportData>,
			isFetching: isGetDrawPrizeReportLoading,
		},
	] = useLazyGetDrawPrizeReportQuery()

	// response 內會用到的資料, 在這裡先解構出來使用
	const {
		currencyAmount = [],
		data: drawPrizeReportTableData = [],
		rowCount: drawPrizeReportTotal = 0,
	} = drawPrizeReport ?? {}

	const [pagination, setPagination] = usePagination({
		paginationTotal: drawPrizeReportTotal,
	})

	const [
		getDrawPrizeLog,
		{
			data: {
				data: drawPrizeDetailData = [],
				rowCount: drawPrizeDetailTotal = 0,
			} = {},
			isFetching: isGetDrawPrizeDetailLoading,
		},
	] = useLazyGetDrawPrizeLogQuery()

	const [detailPagination, setDetailPagination] = usePagination({
		paginationTotal: drawPrizeDetailTotal,
	})

	const [exportDrawPrizeReport, { isLoading: isExportDrawPrizeReportLoading }] =
		useExportDrawPrizeReportMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, ...restValue } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			await getDrawPrizeReport({
				siteId,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				...restValue,
			}).unwrap()

			setQueryParams({
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
				...restValue,
			})
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
		const { dateRange, ...restValue } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			const blob = await exportDrawPrizeReport({
				siteId,
				startDate,
				endDate,
				...restValue,
			}).unwrap()

			download(
				blob,
				`Draw_Prize_Report_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// Table Detail Click
	const handleDetailClicked = async (record: IDrawPrizeReport) => {
		drawPrizeDetailRecord.current = record
		drawPrizeModal.onOpen()
		await handleGetDetail({})
	}

	const handleGetDetail = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!drawPrizeDetailRecord.current) return

		const { eventId, prizeId, eventTime, prizeName } =
			drawPrizeDetailRecord.current

		try {
			await getDrawPrizeLog({
				eventId,
				prizeId,
				eventTime,
				prizeName,
				pageNumber: current,
				pageSize,
			}).unwrap()
			setDetailPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDetailTableChange = async (
		newPagination: TablePaginationConfig
	) => {
		const { current, pageSize } = newPagination
		await handleGetDetail({
			current,
			pageSize,
		})
	}

	useEffect(() => {
		if (!isGetDrawPrizesEventNamesLoading) {
			if (!isEmpty(queryParams)) {
				const {
					startDate,
					endDate,
					pageNumber,
					pageSize,
					timeZone,
					currencyIds = [],
					eventNames = [],
				} = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					dateRange: [moment(startDate), moment(endDate)],
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					eventNames,
				})

				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
					currentTimeZoneUtcOffset: Number(timeZone),
				})
			} else {
				filterForm.setFieldsValue({
					eventNames: drawPrizesEventNames.map(({ eventName }) => eventName),
				})
			}
		}
	}, [isGetDrawPrizesEventNamesLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<DrawPrizeReportFilter
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				drawPrizesEventNames={drawPrizesEventNames}
				loading={isGetDrawPrizesEventNamesLoading}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<DrawPrizeReportTable
					loading={isGetDrawPrizeReportLoading}
					drawPrizeReportTableData={drawPrizeReportTableData}
					pagination={pagination}
					onDetailClicked={handleDetailClicked}
					onTableChange={handleTableChange}
				/>
			)}
			{currencyAmount.length > 0 && (
				<DrawPrizeOverviewTable
					currencyAmount={currencyAmount}
					loading={isGetDrawPrizeReportLoading}
				/>
			)}
			<DrawPrizeDetailModal
				loading={isGetDrawPrizeDetailLoading}
				visible={drawPrizeModal.visible}
				timeZoneUtcOffset={timeZoneUtcOffset}
				prizeName={drawPrizeDetailRecord.current?.prizeName ?? ''}
				pagination={detailPagination}
				drawPrizeDetailData={drawPrizeDetailData}
				onTableChange={handleDetailTableChange}
				onCancel={() => {
					drawPrizeModal.onCancel()
					drawPrizeDetailRecord.current = undefined
				}}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportDrawPrizeReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DrawPrizeReport

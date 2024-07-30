import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'
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
import { dateRangeToUtcFormatter } from 'common/utils'
import { LotteryStickerReportFilter } from 'features/lotteryStickerReport/LotteryStickerReportFilter'
import { LotteryStickerReportTable } from 'features/lotteryStickerReport/LotteryStickerReportTable'
import {
	useLazyGetStickerReportQuery,
	useExportStickerReportExportMutation,
} from './api'
import type { TStickerReportResponse, IFilterForm } from './type'

const LotteryStickerReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	/**  ======= api ======= */

	/** 取得 StickerReport 資料 */
	const [
		getStickerReport,
		{
			data: {
				data: {
					stickerReportData = [],
					stickerReportCurrencyTotal = [],
					rowCount: memberReportTotal = 0,
				} = {},
			} = {} as TStickerReportResponse,
			isFetching: isGetMemberReportLoading,
		},
	] = useLazyGetStickerReportQuery()

	/** 匯出 StickerReport api */
	const [exportStickerReport, { isLoading: isExportStickerReportLoading }] =
		useExportStickerReportExportMutation()

	/**  ======= hook ======= */

	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm<IFilterForm>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	// 頁碼
	const [pagination, setPagination] = usePagination({
		paginationTotal: memberReportTotal,
	})

	/**  ======= 函數 ======= */

	/**
	 * 將時間轉換後端格式
	 * @param {string} date 需要轉換格式的時間
	 * @return 'YYYY-MM-DD'
	 * @example "2024-08-23T16:00:00.000Z" => "2024-08-23" */
	const formatDate = (date: string): string =>
		dayjs.utc(date).format('YYYY-MM-DD')

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { currencyIds, dateRange, roundId, siteIds, userName } =
			form.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(dateRange)

		try {
			await getStickerReport({
				siteIds,
				currencyIds,
				roundId,
				startDate: formatDate(startDate),
				endDate: formatDate(endDate),
				userName: userName || null,
				pageSize,
				pageNumber: current,
			}).unwrap()

			setQueryParams({
				siteIds,
				currencyIds,
				roundId,
				startDate,
				endDate,
				userName: userName || null,
				pageSize,
				pageNumber: current,
				timeZone: currentTimeZoneUtcOffset,
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
		handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleExport = async () => {
		const {
			currencyIds = [],
			roundId = 0,
			siteIds = [],
			userName = null,
			startDate,
			endDate,
		} = queryParams

		try {
			const blob = await exportStickerReport({
				siteIds,
				currencyIds,
				roundId,
				userName: userName || null,
				startDate: formatDate(startDate),
				endDate: formatDate(endDate),
			}).unwrap()

			download(
				blob,
				`ExportStickerReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = async () => {
			if (isEmpty(queryParams)) return
			const {
				currencyIds,
				roundId,
				siteIds,
				startDate,
				endDate,
				userName,
				pageSize,
				pageNumber,
				timeZone,
			} = queryParams

			form.setFieldsValue({
				currencyIds: currencyIds.map((id: string) => Number(id)),
				siteIds: siteIds.map((id: string) => Number(id)),
				dateRange: [dayjs(startDate), dayjs(endDate)],
				roundId: Number(roundId),
				userName,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<LotteryStickerReportFilter
				form={form}
				loading={isGetMemberReportLoading}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				timeZoneUtcOffset={timeZoneUtcOffset}
			/>
			{!isEmpty(queryParams) && (
				<LotteryStickerReportTable
					loading={isGetMemberReportLoading}
					stickerReportData={stickerReportData}
					stickerReportCurrencyTotal={stickerReportCurrencyTotal}
					pagination={pagination}
					onTableChange={handleTableChange}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportStickerReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default LotteryStickerReport

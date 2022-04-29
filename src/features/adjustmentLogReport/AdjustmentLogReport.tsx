import { useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { RequestStatusType } from 'type'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTimeZone, dateRangeToUtcFormatter } from 'components/TimeZoneSelect'
import { usePagination } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AdjustmentLogReportFilter } from './AdjustmentLogReportFilter'
import { fetchLogReportListAsync } from './thunk'
import { AdjustmentLogReportTable } from './AdjustmentLogReportTable'
import { selectAdjustmentLogReportStatus } from './slice'

const AdjustmentLogReport = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const userSite = useAppSelector(selectUserSite)

	const adjustmentLogReportStatus = useAppSelector(
		selectAdjustmentLogReportStatus
	)

	const [pagination, setPagination] = usePagination()

	const onSearch = async ({
		current = 1,
		pageSize = 10,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { actionTypes, currencyIds, menus, transId, userName, dateRange } =
			form.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			await dispatch(
				fetchLogReportListAsync({
					pageNumber: current,
					pageSize,
					actionTypes,
					currencyIds,
					menus,
					transId,
					userName,
					startDate,
					endDate,
					siteIds: userSite?.siteId ? [userSite?.siteId] : [],
				})
			)

			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await onSearch({ current, pageSize })
	}

	const loading = adjustmentLogReportStatus === 'pending'

	return (
		<main>
			<LayoutContent.Title title={t('Label_AdjustmentLogReport')} />

			<AdjustmentLogReportFilter
				form={form}
				loading={loading}
				onSearch={onSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{adjustmentLogReportStatus !== 'idle' && (
				<AdjustmentLogReportTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
				/>
			)}
		</main>
	)
}

export default AdjustmentLogReport

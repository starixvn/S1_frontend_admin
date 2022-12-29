import FailBetFilter from 'features/failBet/FailBetFilter'
import FailBetTable from 'features/failBet/FailBetTable'
import { Form, message, TablePaginationConfig } from 'antd'
import moment from 'moment'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { PAGINATION, useAuth, usePagination } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { selectUserSite } from 'common/enum'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'

import {
	useGetTpIdListQuery,
	useLazyGetFailRecordReportQuery,
	useExportFailRecordReportMutation,
} from 'features/failBet/api'

import { filterForm } from 'features/failBet/type'
import download from 'downloadjs'

const FailBet = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<filterForm>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const {
		data: { data: tpIdList = [] } = {},
		isFetching: isGetTpIdListFetching,
	} = useGetTpIdListQuery(null)

	const [
		getFailRecordReport,
		{
			data: {
				data: failRecordReportList = [],
				rowCount: paginationTotal = 0,
			} = {},
			isFetching: isGetFailRecordReportFetching,
		},
	] = useLazyGetFailRecordReportQuery()

	const [
		exportFailRecordReport,
		{ isLoading: isExportFailRecordReportLoading },
	] = useExportFailRecordReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal,
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
		if (!siteId) return
		const { dateRange, ...args } = await form.validateFields()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		try {
			await getFailRecordReport({
				siteIds: [siteId],
				startTime,
				endTime,
				pageNumber: current,
				pageSize,
				...args,
			}).unwrap()

			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const { dateRange, ...args } = await form.validateFields()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)

		try {
			const blob = await exportFailRecordReport({
				siteIds: [siteId],
				startTime,
				endTime,
				...args,
			}).unwrap()
			download(
				blob,
				`ExportFailBetRecordReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
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

	const loading = isGetFailRecordReportFetching || isGetTpIdListFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<FailBetFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				tpIdList={tpIdList}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>

			<FailBetTable
				loading={loading}
				pagination={pagination}
				failRecordReportList={failRecordReportList}
				onTableChange={handleTableChange}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportFailRecordReportLoading}
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default FailBet

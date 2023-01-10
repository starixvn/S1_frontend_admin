import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IFinancialLogsResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination } from 'common/hooks'
import {
	useExportFinancialLogMutation,
	useLazyGetFinancialLogsQuery,
} from 'features/memberProfile/api'
import FinancialTable from 'features/memberProfile/pages/finance/financialLog/FinancialTable'
import { FinancialFilter } from 'features/memberProfile/pages/finance/financialLog/FinancialFilter'
import { AffixButtons } from 'components/AffixButtons'
import download from 'downloadjs'
import moment from 'moment'
import { AdjustTypeEnum } from 'features/memberProfile/constants'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { head } from 'lodash'

const FinancialLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<{
		dateRange: [moment.Moment, moment.Moment]
		type: AdjustTypeEnum
		refTransId: string
	}>()

	const [
		getFinancialLogs,
		{
			data: {
				data: financialLogs = [],
				rowCount: financialLogsTotal = 0,
			} = {} as IFinancialLogsResponse,
			isFetching: isGetTpAdjustmentLogLoading,
		},
	] = useLazyGetFinancialLogsQuery()

	const [exportFinancialLog, { isLoading: isExportFinancialLogLoading }] =
		useExportFinancialLogMutation()

	const {
		data: { data: typeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'FinancialType' })

	const [pagination, setPagination] = usePagination({
		paginationTotal: financialLogsTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		const { dateRange, type, refTransId = '' } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			await getFinancialLogs({
				pageNumber: current,
				pageSize,
				custId: Number(custId),
				financialType: type,
				startDate,
				endDate,
				refTransId,
			}).unwrap()
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
		const { dateRange, type, refTransId = '' } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)
		const args = {
			pageNumber: pagination.current,
			pageSize: pagination.pageSize,
			custId: Number(custId),
			startDate,
			endDate,
			refTransId,
			financialType: type,
		}
		try {
			const blob = await exportFinancialLog(args).unwrap()
			download(
				blob,
				`ExportFinancialLog_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId])

	useEffect(() => {
		if (!isGetTypeListLoading && typeList.length > 0) {
			filterForm.setFieldsValue({
				type: head(typeList)?.value,
			})
		}
	}, [isGetTypeListLoading])

	const loading = isGetTpAdjustmentLogLoading || isGetTypeListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_FinancialLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<FinancialFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
					typeList={typeList}
				/>
				<FinancialTable
					financialLogs={financialLogs}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					typeList={typeList}
				/>
			</LayoutContent.Card>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					onClick={handleExport}
					loading={isExportFinancialLogLoading}
				/>
			</AffixButtons>
		</>
	)
}

export default FinancialLog

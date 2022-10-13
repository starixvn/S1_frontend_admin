import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { Form, message, TablePaginationConfig } from 'antd'
import { VipRebateFilter } from 'features/memberProfile/pages/marketing/vipRebateLog/VipRebateFilter'
import { useLazyGetVipRebateLogQuery } from 'features/memberProfile/api'
import { PAGINATION, usePagination } from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { VipRebateTable } from 'features/memberProfile/pages/marketing/vipRebateLog/VipRebateTable'

const VipRebateLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()

	const [
		getVipRebateLog,
		{
			data: { data: vipRebateLog = [], rowCount: vipRebateTotal = 0 } = {},
			isFetching: isGetVipRebateLogLoading,
		},
	] = useLazyGetVipRebateLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: vipRebateTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getVipRebateLog({
				custId: Number(custId),
				pageSize,
				pageNumber: current,
				startDate,
				endDate,
			}).unwrap()
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
		await handleSearch({
			current,
			pageSize,
		})
	}

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Marketing.Label_VipRebateLog')}
			/>
			<LayoutContent.Card style={{ padding: '24px' }}>
				<VipRebateFilter
					loading={isGetVipRebateLogLoading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<VipRebateTable
					loading={isGetVipRebateLogLoading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
					vipRebateLog={vipRebateLog}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default VipRebateLog

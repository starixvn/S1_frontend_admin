import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { LayoutContent } from 'app/pages/layout'
import React, { useEffect } from 'react'
import { useLazyGetRewardPointLogQuery } from 'features/memberProfile/api'
import { PAGINATION, usePagination } from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { RewardPointLogFilter } from 'features/memberProfile/pages/marketing/rewardPointLog/RewardPointLogFilter'
import { RewardPointLogTable } from 'features/memberProfile/pages/marketing/rewardPointLog/RewardPointLogTable'

const RewardPointLog = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()

	const [
		getRewardPointLog,
		{
			data: {
				data: rewardPointLog = [],
				rowCount: rewardPointLogTotal = 0,
			} = {},
			isFetching: isGetRewardPointLogLoading,
		},
	] = useLazyGetRewardPointLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: rewardPointLogTotal,
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
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getRewardPointLog({
				custId: Number(custId),
				pageSize,
				pageNumber: current,
				startTime,
				endTime,
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
				title={t('MemberProfile.Menu.Marketing.Label_RewardsPointLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<RewardPointLogFilter
					loading={isGetRewardPointLogLoading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<RewardPointLogTable
					loading={isGetRewardPointLogLoading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
					rewardPointLog={rewardPointLog}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default RewardPointLog

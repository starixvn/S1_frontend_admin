import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetWithdrawalLimitLogResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useLazyGetWithdrawalLimitLogQuery } from 'features/memberProfile/api'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { PAGINATION, usePagination } from 'common/hooks'
import moment from 'moment'
import WithdrawalLimitTable from 'features/memberProfile/pages/finance/withdrawalLimitLog/WithdrawalLimitTable'
import { WithdrawalLimitFilter } from 'features/memberProfile/pages/finance/withdrawalLimitLog/WithdrawalLimitFilter'

const WithdrawalLimitLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<{
		dateRange: [moment.Moment, moment.Moment]
	}>()

	const [
		getWithdrawalLimitLog,
		{
			data: {
				data: withdrawalLimitLogList = [],
				rowCount: custWithdrawalLimitLogTotal = 0,
			} = {} as IGetWithdrawalLimitLogResponse,
			isFetching: isGetWithdrawalLimitLogLoading,
		},
	] = useLazyGetWithdrawalLimitLogQuery()

	const {
		data: { data: typeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'WithdrawalLimitLogMainTypeEnum' })

	const [pagination, setPagination] = usePagination({
		paginationTotal: custWithdrawalLimitLogTotal,
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
			await getWithdrawalLimitLog({
				pageNumber: current,
				pageSize,
				custId: Number(custId),
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
		const { current, pageSize } = newPagination

		await handleSearch({
			current,
			pageSize,
		})
	}

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId])

	const loading = isGetWithdrawalLimitLogLoading || isGetTypeListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_WithdrawalLimitLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<WithdrawalLimitFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<WithdrawalLimitTable
					withdrawalLimitLogList={withdrawalLimitLogList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					typeList={typeList}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default WithdrawalLimitLog

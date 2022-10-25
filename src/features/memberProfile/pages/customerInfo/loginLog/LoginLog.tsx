import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { LayoutContent } from 'app/pages/layout'
import { LoginLogFilter } from 'features/memberProfile/pages/customerInfo/loginLog/LoginLogFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { PAGINATION, usePagination } from 'common/hooks'
import { useLazyGetLoginLogQuery } from 'features/memberProfile/api'
import { IGetLoginLogResponse } from 'features/memberProfile/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { LoginLogTable } from 'features/memberProfile/pages/customerInfo/loginLog/LoginLogTable'
import { useEffect } from 'react'

const LoginLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()

	const [
		getLoginLog,
		{
			data: {
				data: loginLog = [],
				rowCount: loginLogTotal = 0,
			} = {} as IGetLoginLogResponse,
			isFetching: isGetLoginLogLoading,
		},
	] = useLazyGetLoginLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: loginLogTotal,
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
		if (!custId) return
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			await getLoginLog({
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
				title={t('MemberProfile.Menu.CustomerInfo.Label_LoginLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<LoginLogFilter
					loading={isGetLoginLogLoading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<LoginLogTable
					loading={isGetLoginLogLoading}
					loginLog={loginLog}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default LoginLog

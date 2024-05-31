import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter } from 'common/utils'
import { PAGINATION, usePagination, useQueryParams } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { LayoutContent } from 'app/pages/layout'
import { IFilterForm } from 'features/memberProfile/pages/adminUserLog/type'
import { useLazyGetAdminUserLogQuery } from 'features/memberProfile/pages/adminUserLog/api'
import { AdminUserLogFilter } from 'features/memberProfile/pages/adminUserLog/AdminUserLogFilter'
import { AdminUserLogTable } from 'features/memberProfile/pages/adminUserLog/AdminUserLogTable'

const AdminUserLog = () => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { custId } = useParams()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()

	const [
		getAdminUserLogList,
		{
			data: {
				data: adminUserLogList = [],
				rowCount: adminUserLogListTotal = 0,
			} = {},
			isFetching: isGetAdminUserLogLoading,
		},
	] = useLazyGetAdminUserLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: adminUserLogListTotal,
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
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		const payload = {
			pageNumber: current,
			pageSize,
			custId: Number(custId),
			startDate,
			endDate,
		}

		try {
			await getAdminUserLogList(payload).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...payload })
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
		if (!isEmpty(queryParams)) {
			const { startDate, endDate, pageNumber, pageSize, timeZone } = queryParams

			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [dayjs(startDate), dayjs(endDate)],
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
	}, [])

	return (
		<>
			<LayoutContent.Title title={t('Label_AdminUserLog')} />
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<AdminUserLogFilter
					form={filterForm}
					loading={isGetAdminUserLogLoading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
				/>
				{!isEmpty(queryParams) && (
					<AdminUserLogTable
						adminUserLogList={adminUserLogList}
						pagination={pagination}
						loading={isGetAdminUserLogLoading}
						timeZoneUtcOffset={timeZoneUtcOffset}
						onTableChange={handleTableChange}
					/>
				)}
			</LayoutContent.Card>
		</>
	)
}

export default AdminUserLog

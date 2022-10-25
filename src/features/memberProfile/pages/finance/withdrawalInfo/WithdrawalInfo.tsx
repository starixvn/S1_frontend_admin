import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetWithdrawalInfoResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useLazyGetWithdrawalInfoQuery } from 'features/memberProfile/api'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { head } from 'lodash'
import { PAGINATION, usePagination } from 'common/hooks'
import { WithdrawalFilter } from 'features/memberProfile/pages/finance/withdrawalInfo/WithdrawalFilter'
import WithdrawalTable from 'features/memberProfile/pages/finance/withdrawalInfo/WithdrawalTable'
import moment from 'moment'

const WithdrawalInfo = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<{
		status: number
		dateRange: [moment.Moment, moment.Moment]
	}>()

	const [
		getWithdrawalInfo,
		{
			data: {
				data: withdrawalInfoList = [],
				rowCount: custWithdrawalInfoTotal = 0,
			} = {} as IGetWithdrawalInfoResponse,
			isFetching: isGetWithdrawalInfoLoading,
		},
	] = useLazyGetWithdrawalInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custWithdrawalInfoTotal,
	})

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'WithdrawalStatusEnum' })

	const {
		data: { data: typeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'WithdrawalTypeEnum' })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		const { dateRange, status } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)
		try {
			await getWithdrawalInfo({
				pageNumber: current,
				pageSize,
				custId: Number(custId),
				startDate,
				endDate,
				status,
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

	useEffect(() => {
		if (!isGetStatusListLoading && statusList.length > 0) {
			filterForm.setFieldsValue({ status: head(statusList)?.value })
		}
	}, [isGetStatusListLoading])

	const loading =
		isGetWithdrawalInfoLoading || isGetStatusListLoading || isGetTypeListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_WithdrawalInfo')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<WithdrawalFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					statusList={statusList}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<WithdrawalTable
					withdrawalInfoList={withdrawalInfoList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					statusList={statusList}
					typeList={typeList}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default WithdrawalInfo

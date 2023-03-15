import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
	AllWithdrawalStatusEnum,
	IGetWithdrawalInfoResponse,
} from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Descriptions, Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useLazyGetWithdrawalInfoQuery } from 'features/memberProfile/api'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { head, isEmpty } from 'lodash'
import { PAGINATION, usePagination, useQueryParams } from 'common/hooks'
import { WithdrawalFilter } from 'features/memberProfile/pages/finance/withdrawalInfo/WithdrawalFilter'
import WithdrawalTable from 'features/memberProfile/pages/finance/withdrawalInfo/WithdrawalTable'
import moment from 'moment'
import { numFormatToDigits } from 'common/utils/format'

const WithdrawalInfo = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<{
		status: number
		dateRange: [moment.Moment, moment.Moment]
	}>()

	const [
		getWithdrawalInfo,
		{
			data: {
				data: withdrawalInfoList = [],
				rowCount: withdrawalRowCount = 0,
				totalApproveRow: withdrawalApproveRowCount = 0,
				totalAmount: withdrawalTotalAmount = 0,
				totalApproveAmount: withdrawalApproveAmount = 0,
			} = {} as IGetWithdrawalInfoResponse,
			isFetching: isGetWithdrawalInfoLoading,
		},
	] = useLazyGetWithdrawalInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: withdrawalRowCount,
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
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!custId) return
		const { dateRange, status } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			const args = {
				pageNumber: current,
				pageSize,
				custId: Number(custId),
				startDate,
				endDate,
				status,
			}
			await getWithdrawalInfo(args).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
			setQueryParams({
				...args,
				status: String(status),
				timeZone: currentTimeZoneUtcOffset,
			})
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
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	useEffect(() => {
		if (custId) {
			if (!isEmpty(queryParams) && !isGetStatusListLoading) {
				const {
					pageNumber,
					pageSize,
					startDate,
					endDate,
					status: queryStatus,
					timeZone,
				} = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					dateRange: [moment(startDate), moment(endDate)],
					status: statusList?.find(status => status === queryStatus)?.value,
				})
				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
					currentTimeZoneUtcOffset: Number(timeZone),
				})
			} else {
				handleSearch({})
			}
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
				{Number(queryParams.status) === AllWithdrawalStatusEnum.Draft ||
				Number(queryParams.status) === AllWithdrawalStatusEnum.Approved ? (
					<Descriptions size='middle' column={2} bordered>
						<Descriptions.Item
							label={t('Label_TotalCount')}
							style={{ whiteSpace: 'nowrap' }}
						>
							{numFormatToDigits(withdrawalRowCount || 0)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t('Label_TotalAmount')}
							style={{ whiteSpace: 'nowrap' }}
						>
							{numFormatToDigits(withdrawalTotalAmount || 0)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t('Label_TotalApprovedCount')}
							style={{ whiteSpace: 'nowrap' }}
						>
							{numFormatToDigits(withdrawalApproveRowCount || 0)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t('Label_TotalApprovedAmount')}
							style={{ whiteSpace: 'nowrap' }}
						>
							{numFormatToDigits(withdrawalApproveAmount || 0)}
						</Descriptions.Item>
					</Descriptions>
				) : (
					<Descriptions size='middle' column={2} bordered>
						<Descriptions.Item
							label={t('Label_TotalCount')}
							style={{ whiteSpace: 'nowrap' }}
						>
							{numFormatToDigits(withdrawalRowCount || 0)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t('Label_TotalAmount')}
							style={{ whiteSpace: 'nowrap' }}
						>
							{numFormatToDigits(withdrawalTotalAmount || 0)}
						</Descriptions.Item>
					</Descriptions>
				)}
			</LayoutContent.Card>
		</>
	)
}

export default WithdrawalInfo

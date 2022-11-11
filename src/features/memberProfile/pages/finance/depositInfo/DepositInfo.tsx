import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetDepositInfoResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { DepositFilter } from 'features/memberProfile/pages/finance/depositInfo/DepositFilter'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useLazyGetDepositInfoQuery } from 'features/memberProfile/api'
import DepositTable from 'features/memberProfile/pages/finance/depositInfo/DepositTable'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { head } from 'lodash'
import { PAGINATION, usePagination } from 'common/hooks'
import moment from 'moment'

const DepositInfo = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<{
		status: number
		dateRange: [moment.Moment, moment.Moment]
	}>()

	const [
		getDepositInfo,
		{
			data: {
				data: depositInfoList = [],
				rowCount: custDepositInfoTotal = 0,
			} = {} as IGetDepositInfoResponse,
			isFetching: isGetDepositInfoLoading,
		},
	] = useLazyGetDepositInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custDepositInfoTotal,
	})

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'DepositStatusEnum' })

	const {
		data: { data: typeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'DepositTypeEnum' })

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
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getDepositInfo({
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
		isGetDepositInfoLoading || isGetStatusListLoading || isGetTypeListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_DepositInfo')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<DepositFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					statusList={statusList}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<DepositTable
					depositInfoList={depositInfoList}
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

export default DepositInfo

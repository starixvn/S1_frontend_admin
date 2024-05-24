import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetTransferInfoResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useLazyGetTransferInfoQuery } from 'features/memberProfile/api'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { PAGINATION, usePagination } from 'common/hooks'
import { TransferFilter } from 'features/memberProfile/pages/finance/transferInfo/TransferFilter'
import TransferTable from 'features/memberProfile/pages/finance/transferInfo/TransferTable'
import dayjs from 'dayjs'

const TransferInfo = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<{
		dateRange: [dayjs.Dayjs, dayjs.Dayjs]
	}>()

	const [
		getTransferInfo,
		{
			data: {
				data: transferInfoList = [],
				rowCount: custTransferInfoTotal = 0,
			} = {} as IGetTransferInfoResponse,
			isFetching: isGetTransferInfoLoading,
		},
	] = useLazyGetTransferInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custTransferInfoTotal,
	})

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'TransferStatusEnum' })

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
			await getTransferInfo({
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

	const loading = isGetTransferInfoLoading || isGetStatusListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_TransferInfo')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<TransferFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<TransferTable
					transferInfoList={transferInfoList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					statusList={statusList}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default TransferInfo

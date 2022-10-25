import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetAdjustmentInfoResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { PAGINATION, usePagination } from 'common/hooks'
import { useLazyGetAdjustmentInfoQuery } from 'features/memberProfile/api'
import AdjustmentTable from 'features/memberProfile/pages/finance/adjustmentInfo/AdjustmentTable'
import { AdjustmentFilter } from 'features/memberProfile/pages/finance/adjustmentInfo/AdjustmentFilter'
import moment from 'moment'

const AdjustmentInfo = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<{
		type: number
		dateRange: [moment.Moment, moment.Moment]
	}>()

	const [
		getAdjustmentInfo,
		{
			data: {
				data: adjustmentInfoList = [],
				rowCount: custAdjustmentInfoTotal = 0,
			} = {} as IGetAdjustmentInfoResponse,
			isFetching: isGetAdjustmentInfoLoading,
		},
	] = useLazyGetAdjustmentInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custAdjustmentInfoTotal,
	})

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'AdjustmentInfoStatusEnum' })

	const {
		data: { data: typeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'AdjustTypeEnum' })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		const { dateRange, type } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)

		try {
			await getAdjustmentInfo({
				pageNumber: current,
				pageSize,
				custId: Number(custId),
				startDate,
				endDate,
				adjustType: type,
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

	const loading =
		isGetAdjustmentInfoLoading || isGetStatusListLoading || isGetTypeListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_AdjustmentInfo')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<AdjustmentFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<AdjustmentTable
					adjustmentInfoList={adjustmentInfoList}
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

export default AdjustmentInfo

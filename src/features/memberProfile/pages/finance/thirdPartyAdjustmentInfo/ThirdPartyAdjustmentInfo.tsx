import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetTpAdjustmentLogResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { PAGINATION, usePagination } from 'common/hooks'
import { useLazyGetTpAdjustmentLogQuery } from 'features/memberProfile/api'
import { ThirdPartyAdjustmentFilter } from 'features/memberProfile/pages/finance/thirdPartyAdjustmentInfo/ThirdPartyAdjustmentFilter'
import ThirdPartyAdjustmentTable from 'features/memberProfile/pages/finance/thirdPartyAdjustmentInfo/ThirdPartyAdjustmentTable'
import moment from 'moment'

const ThirdPartyAdjustmentInfo = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<{
		type: number
		dateRange: [moment.Moment, moment.Moment]
	}>()

	const [
		getTpAdjustmentLog,
		{
			data: {
				data: tpAdjustmentLogList = [],
				rowCount: custTpAdjustmentLogTotal = 0,
			} = {} as IGetTpAdjustmentLogResponse,
			isFetching: isGetTpAdjustmentLogLoading,
		},
	] = useLazyGetTpAdjustmentLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custTpAdjustmentLogTotal,
	})

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'AdjustmentInfoStatusEnum' })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		const { dateRange, type } = filterForm.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getTpAdjustmentLog({
				pageNumber: current,
				pageSize,
				custId: Number(custId),
				startTime,
				endTime,
				// 後端表示此處帶0
				tpId: 0,
				direction: type,
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

	const loading = isGetTpAdjustmentLogLoading || isGetStatusListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_3RDPartyAdjustmentInfo')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<ThirdPartyAdjustmentFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<ThirdPartyAdjustmentTable
					tpAdjustmentLogList={tpAdjustmentLogList}
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

export default ThirdPartyAdjustmentInfo

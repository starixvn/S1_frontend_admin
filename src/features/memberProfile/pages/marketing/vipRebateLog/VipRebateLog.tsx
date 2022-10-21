import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { Form, message, TablePaginationConfig } from 'antd'
import { VipRebateFilter } from 'features/memberProfile/pages/marketing/vipRebateLog/VipRebateFilter'
import {
	useLazyGetVipRebateDetailQuery,
	useLazyGetVipRebateLogQuery,
} from 'features/memberProfile/api'
import { PAGINATION, useModal, usePagination } from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { VipRebateTable } from 'features/memberProfile/pages/marketing/vipRebateLog/VipRebateTable'
import { VipRebateDetailModal } from 'features/memberProfile/pages/marketing/vipRebateLog/VipRebateDetailModal'

const VipRebateLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()

	// 將上一層的資料帶入 modal 內
	const [modalInfo, setModalInfo] = useState<{
		createTime: string
		maxPayout: number
		minPayout: number
	}>({
		createTime: '',
		maxPayout: 0,
		minPayout: 0,
	})
	const detailModal = useModal()

	const [
		getVipRebateLog,
		{
			data: { data: vipRebateLog = [], rowCount: vipRebateTotal = 0 } = {},
			isFetching: isGetVipRebateLogLoading,
		},
	] = useLazyGetVipRebateLogQuery()

	const [
		getVipRebateDetail,
		{
			data: { data: vipRebateDetail = [] } = {},
			isFetching: isGetVipRebateDetailLoading,
		},
	] = useLazyGetVipRebateDetailQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: vipRebateTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		const { dateRange, payoutStatuses } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getVipRebateLog({
				custId: Number(custId),
				pageSize,
				pageNumber: current,
				startDate,
				endDate,
				payoutStatuses,
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

	const handleDetailClicked = async ({
		createTime,
		minPayout,
		maxPayout,
		refId,
		categoryId,
	}: {
		createTime: string
		maxPayout: number
		minPayout: number
		refId: string
		categoryId: number
	}) => {
		setModalInfo({ createTime, minPayout, maxPayout })
		detailModal.onOpen()
		try {
			await getVipRebateDetail({
				custId: Number(custId),
				refId,
				tpCategoryId: categoryId,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [])

	const loading = isGetVipRebateDetailLoading || isGetVipRebateLogLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Marketing.Label_VipRebateLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<VipRebateFilter
					loading={isGetVipRebateLogLoading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<VipRebateTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
					vipRebateLog={vipRebateLog}
					onDetailClicked={handleDetailClicked}
				/>
				<VipRebateDetailModal
					loading={isGetVipRebateDetailLoading}
					vipRebateDetail={vipRebateDetail}
					visible={detailModal.visible}
					onCancel={detailModal.onCancel}
					modalInfo={modalInfo}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default VipRebateLog

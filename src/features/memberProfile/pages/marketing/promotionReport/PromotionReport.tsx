import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import React, { useEffect } from 'react'
import { PromotionReportFilter } from 'features/memberProfile/pages/marketing/promotionReport/PromotionReportFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useParams } from 'react-router-dom'
import {
	useCancelPromotionMutation,
	useLazyGetPromotionReportQuery,
} from 'features/memberProfile/api'
import { PAGINATION, usePagination } from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { PromotionReportTable } from 'features/memberProfile/pages/marketing/promotionReport/PromotionReportTable'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

const PromotionReport = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const [
		getPromotionReport,
		{
			data: {
				data: promotionReport = [],
				rowCount: promotionReportTotal = 0,
			} = {},
			isFetching: isGetPromotionReportLoading,
		},
	] = useLazyGetPromotionReportQuery()
	const [pagination, setPagination] = usePagination({
		paginationTotal: promotionReportTotal,
	})

	const [cancelPromotion, { isLoading: isCancelPromotionLoading }] =
		useCancelPromotionMutation()

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
			await getPromotionReport({
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

	const handlePromotionCancel = async ({
		bonusId,
		currencyId,
	}: {
		bonusId: number
		currencyId: number
	}) => {
		try {
			await cancelPromotion({ custId, siteId, bonusId, currencyId }).unwrap()
			message.success(t('System.Label_Success'))
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

	const loading = isCancelPromotionLoading || isGetPromotionReportLoading
	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Marketing.Label_PromotionReport')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<PromotionReportFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<PromotionReportTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
					promotionReport={promotionReport}
					onCancelPromotion={handlePromotionCancel}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default PromotionReport

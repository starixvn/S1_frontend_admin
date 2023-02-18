import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useLazyGetPromotionReceiveFailLogQuery } from 'features/memberProfile/api'
import PromotionLogFailFilter from 'features/memberProfile/pages/marketing/promotionFailLog/PromotionLogFailFilter'
import PromotionFailLogTable from 'features/memberProfile/pages/marketing/promotionFailLog/PromotionFailLogTable'

const PromotionFailLog = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()

	const [
		getPromotionReceiveFailLog,
		{
			data: { data: promotionReceiveFailLogList = [] } = {},
			isFetching: promotionReceiveFailLogFetching,
		},
	] = useLazyGetPromotionReceiveFailLogQuery()

	const handleSearch = async () => {
		if (!custId) return
		const { dateRange } = filterForm.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getPromotionReceiveFailLog({
				custId: Number(custId),
				startTime,
				endTime,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (custId) {
			handleSearch()
		}
	}, [])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Marketing.Label_PromotionFailLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<PromotionLogFailFilter
					loading={promotionReceiveFailLogFetching}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<PromotionFailLogTable
					loading={promotionReceiveFailLogFetching}
					promotionReceiveFailLogList={promotionReceiveFailLogList}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default PromotionFailLog

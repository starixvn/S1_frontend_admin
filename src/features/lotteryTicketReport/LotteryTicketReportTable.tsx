import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useTimeZone } from 'components/TimeZoneSelect'
import { timeFormat } from 'common/utils/format'
import { Table } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { ICustLotteryTicketData } from './type'

interface ILotteryTicketReportTableProps {
	loading: boolean
	custLotteryTicketData: ICustLotteryTicketData[]
}

const LotteryTicketReportTable: FC<ILotteryTicketReportTableProps> = ({
	loading,
	custLotteryTicketData,
}) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()

	/** lotteryTicket 紀錄 */
	const lotteryTicketColumns = [
		{
			title: t('Label_Round'),
			key: 'roundId',
			dataIndex: 'roundId',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Period'),
			key: 'period',
			width: 170,
			align: 'center' as 'center',
			render: ({ periodStartTime, periodEndTime }: ICustLotteryTicketData) => {
				const hasTime = periodStartTime && periodEndTime
				const startDate = dayjs(periodStartTime)
					.utcOffset(timeZoneUtcOffset)
					.format(timeFormat)

				const endDate = dayjs(periodEndTime)
					.utcOffset(timeZoneUtcOffset)
					.format(timeFormat)

				return hasTime ? `${startDate} - ${endDate}` : '-'
			},
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TicketNumber'),
			key: 'ticketNo',
			dataIndex: 'ticketNo',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ReceivedTime'),
			key: 'sticker',
			width: 100,
			align: 'center' as 'center',
			render: ({ receivedTime }: ICustLotteryTicketData) => {
				return receivedTime
					? dayjs(receivedTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '-'
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={lotteryTicketColumns}
				dataSource={custLotteryTicketData ?? []}
				scroll={{ y: '500px' }}
				pagination={false}
				bordered
			/>
		</LayoutContent.Card>
	)
}
export { LotteryTicketReportTable }

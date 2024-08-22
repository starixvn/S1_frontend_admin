import { useTranslation } from 'react-i18next'
import { Table, Modal } from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { ILotteryTicketHistoryData } from '../type'
import { LotteryPrizeEnum, LOTTERY_STICKER_NAME } from '../contants'
import { useGetLotteryTicketHistoryQuery } from '../api'

interface ITicketHistoryModalProps {
	visible: boolean
	ticketHistoryParams: {
		roundId: number
		startDate: string
		endDate: string
	}
	onCancel: () => void
}

const TicketHistoryModal = ({
	visible,
	ticketHistoryParams,
	onCancel,
}: ITicketHistoryModalProps) => {
	/**  ======= hooks ======= */

	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { t } = useTranslation()

	/**  ======= props ======= */

	const { roundId, startDate, endDate } = ticketHistoryParams

	/**  ======= api ======= */

	const {
		data: { data: ticketHistory = {} as ILotteryTicketHistoryData } = {},
		isFetching: isTicketHistoryLoading,
	} = useGetLotteryTicketHistoryQuery({
		siteId,
		roundId,
	})

	const {
		firstPrizeList = [],
		secondPrizeList = [],
		thirdPrizeList = [],
		consolationPrizeList = [],
		smallPrizeList = [],
		stickerId = 0,
	} = ticketHistory ?? {}

	/**  ======= 函數 ======= */

	/** 陣列轉字串 ["123" , "456"] => "123, 456" */
	const convertArrayToString = (arr: string[]): string => {
		if (arr.length === 0) return '-'
		return arr.join(', ')
	}

	/**  ======= 常數 ======= */

	const columns = [
		{
			title: t('Label_Prize'),
			key: 'prize',
			dataIndex: 'prize',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LuckyNumber'),
			key: 'luckyNumber',
			dataIndex: 'luckyNumber',
			width: 250,
			align: 'center' as 'center',
		},
	]

	const columnData = [
		{ prize: LotteryPrizeEnum.First, luckyNumber: firstPrizeList[0] ?? '-' },
		{ prize: LotteryPrizeEnum.Second, luckyNumber: secondPrizeList[0] ?? '-' },
		{ prize: LotteryPrizeEnum.Third, luckyNumber: thirdPrizeList[0] ?? '-' },
		{
			prize: LotteryPrizeEnum.Consolation,
			luckyNumber: convertArrayToString(consolationPrizeList),
		},
		{
			prize: LotteryPrizeEnum.Small,
			luckyNumber: convertArrayToString(smallPrizeList),
		},
		{
			prize: t('Label_Sticker'),
			luckyNumber: t(LOTTERY_STICKER_NAME[stickerId]),
		},
	]

	return (
		<Modal
			width='40%'
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_RoundAndResult')} ({startDate.split('T')[0]} -
					{endDate.split('T')[0]})
				</div>
			}
			onCancel={onCancel}
			destroyOnClose
			footer={false}
		>
			<Table
				columns={columns}
				dataSource={columnData}
				pagination={false}
				bordered
				loading={isTicketHistoryLoading}
			/>
		</Modal>
	)
}

export { TicketHistoryModal }

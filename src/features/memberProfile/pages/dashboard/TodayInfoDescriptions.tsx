import { Descriptions, Spin, Typography } from 'antd'
import { isPositiveNum } from 'common/utils'
import { numberFormatter } from 'common/utils/format'
import { ITodayInfoData } from 'features/memberProfile/type'

const { Text } = Typography

interface ITodayInfoDescriptionsProps {
	loading: boolean
	todayInfoData: ITodayInfoData | undefined
}

const TodayInfoDescriptions = ({
	loading,
	todayInfoData,
}: ITodayInfoDescriptionsProps) => {
	const {
		todayWinLoss = 0,
		todayDeposit = 0,
		todayWithdrawal = 0,
		todayBetting = 0,
	} = todayInfoData ?? {}

	return (
		<Spin spinning={loading}>
			<Descriptions layout='vertical' bordered column={4} size='small'>
				<Descriptions.Item label="Today's WinLoss">
					<Text type={isPositiveNum(todayWinLoss) ? undefined : 'danger'}>
						{numberFormatter.format(todayWinLoss || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Deposit">
					<Text type={isPositiveNum(todayDeposit) ? undefined : 'danger'}>
						{numberFormatter.format(todayDeposit || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Withdrawal">
					<Text type={isPositiveNum(todayWithdrawal) ? undefined : 'danger'}>
						{numberFormatter.format(todayWithdrawal || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Betting">
					<Text type={isPositiveNum(todayBetting) ? undefined : 'danger'}>
						{numberFormatter.format(todayBetting || 0)}
					</Text>
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default TodayInfoDescriptions

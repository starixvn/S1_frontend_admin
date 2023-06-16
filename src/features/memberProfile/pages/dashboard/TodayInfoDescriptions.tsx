import { Descriptions, Spin, Typography } from 'antd'
import { isPositiveNum } from 'common/utils'
import { numFormatToDigits } from 'common/utils/format'
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
		todayBonus = 0,
		todayReward = 0,
	} = todayInfoData ?? {}

	return (
		<Spin spinning={loading}>
			<Descriptions layout='vertical' bordered column={6} size='small'>
				<Descriptions.Item label="Today's WinLoss">
					<Text type={isPositiveNum(todayWinLoss) ? undefined : 'danger'}>
						{numFormatToDigits(todayWinLoss || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Deposit">
					<Text type={isPositiveNum(todayDeposit) ? undefined : 'danger'}>
						{numFormatToDigits(todayDeposit || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Withdrawal">
					<Text type={isPositiveNum(todayWithdrawal) ? undefined : 'danger'}>
						{numFormatToDigits(todayWithdrawal || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Betting">
					<Text type={isPositiveNum(todayBetting) ? undefined : 'danger'}>
						{numFormatToDigits(todayBetting || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Bonus">
					<Text type={isPositiveNum(todayBonus) ? undefined : 'danger'}>
						{numFormatToDigits(todayBonus || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label="Today's Reward">
					<Text type={isPositiveNum(todayReward) ? undefined : 'danger'}>
						{numFormatToDigits(todayReward || 0)}
					</Text>
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default TodayInfoDescriptions

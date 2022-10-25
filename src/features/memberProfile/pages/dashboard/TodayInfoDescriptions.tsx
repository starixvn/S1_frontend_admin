import { Descriptions, Spin } from 'antd'
import { numberFormatter } from 'common/utils/format'
import { ITodayInfoData } from 'features/memberProfile/type'
import React from 'react'

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
			<Descriptions layout='vertical' bordered column={4} size='default'>
				<Descriptions.Item label="Today's WinLoss">
					{numberFormatter.format(todayWinLoss)}
				</Descriptions.Item>
				<Descriptions.Item label="Today's Deposit">
					{numberFormatter.format(todayDeposit)}
				</Descriptions.Item>
				<Descriptions.Item label="Today's Withdrawal">
					{numberFormatter.format(todayWithdrawal)}
				</Descriptions.Item>
				<Descriptions.Item label="Today's Summary">
					{numberFormatter.format(todayBetting)}
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default TodayInfoDescriptions

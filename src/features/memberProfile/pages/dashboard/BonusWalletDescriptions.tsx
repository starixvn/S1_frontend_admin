import { Descriptions, Popover, Spin, Typography } from 'antd'
import { isPositiveNum } from 'common/utils'
import { numFormatToDigits } from 'common/utils/format'
import {
	IBonusWalletDetailData,
	IBonusWalletInfoData,
} from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

interface IBonusWalletDescriptionsProps {
	loading: boolean
	bonusWalletInfoData: IBonusWalletInfoData
	bonusWalletDetailData: IBonusWalletDetailData | undefined
}

const BonusWalletDescriptions = ({
	loading,
	bonusWalletInfoData,
	bonusWalletDetailData,
}: IBonusWalletDescriptionsProps) => {
	const { t } = useTranslation()

	const {
		bonus: bonusWallet = 0,
		remainingTurnover: bonusRollover = 0,
		description = '',
	} = bonusWalletInfoData

	const { custBonusSum, custRewardSum, custRebateSum } =
		bonusWalletDetailData ?? {}

	const {
		totalBonus = 0,
		firstDeposit = 0,
		reDeposit = 0,
		freeBet = 0,
		cashBack = 0,
		retentionBonus = 0,
		manualBonus = 0,
		cancelBonusAmount = 0,
		rewardPoint = 0,
		deviceBonus = 0,
	} = custBonusSum ?? {}

	const { custRewardTotalSum = 0, custRewardType = [] } = custRewardSum ?? {}

	const { custRebateTotalSum = 0, custRebateCategory = [] } =
		custRebateSum ?? {}

	return (
		<Spin spinning={loading}>
			<Descriptions
				size='small'
				layout='horizontal'
				bordered
				column={1}
				labelStyle={{ width: '50%' }}
			>
				<Descriptions.Item label={t('Label_BonusWallet')}>
					<Text type={isPositiveNum(bonusWallet) ? undefined : 'danger'}>
						{numFormatToDigits(bonusWallet || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_BonusRollover')}>
					<Text type={isPositiveNum(bonusRollover) ? undefined : 'danger'}>
						{numFormatToDigits(bonusRollover || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalBonus')}>
					{totalBonus > 0 ? (
						<Popover
							content={
								<Descriptions
									size='small'
									bordered
									title={t('Label_TotalBonus')}
									column={1}
								>
									<Descriptions.Item label={t('BonusType.Label_FirstDeposit')}>
										<Text
											type={isPositiveNum(firstDeposit) ? undefined : 'danger'}
										>
											{numFormatToDigits(firstDeposit || 0)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_ReDeposit')}>
										<Text
											type={isPositiveNum(reDeposit) ? undefined : 'danger'}
										>
											{numFormatToDigits(reDeposit || 0)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_FreeBet')}>
										<Text type={isPositiveNum(freeBet) ? undefined : 'danger'}>
											{numFormatToDigits(freeBet || 0)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_CashBack')}>
										<Text type={isPositiveNum(cashBack) ? undefined : 'danger'}>
											{numFormatToDigits(cashBack || 0)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item
										label={t('BonusType.Label_RetentionBonus')}
									>
										<Text
											type={
												isPositiveNum(retentionBonus) ? undefined : 'danger'
											}
										>
											{numFormatToDigits(retentionBonus || 0)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_ManualBonus')}>
										<Text
											type={isPositiveNum(manualBonus) ? undefined : 'danger'}
										>
											{numFormatToDigits(manualBonus || 0)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_DeviceBonus')}>
										<Text
											type={isPositiveNum(deviceBonus) ? undefined : 'danger'}
										>
											{numFormatToDigits(deviceBonus || 0)}
										</Text>
									</Descriptions.Item>
								</Descriptions>
							}
							trigger='click'
						>
							<Typography.Link
								type={isPositiveNum(totalBonus) ? undefined : 'danger'}
							>
								{numFormatToDigits(totalBonus || 0)}
							</Typography.Link>
						</Popover>
					) : (
						<Text type={isPositiveNum(totalBonus) ? undefined : 'danger'}>
							{numFormatToDigits(totalBonus || 0)}
						</Text>
					)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalReward')}>
					{custRewardTotalSum > 0 ? (
						<Popover
							content={
								<Descriptions
									size='small'
									bordered
									title={t('Label_TotalReward')}
									column={1}
								>
									{custRewardType.map(({ typeName, rewardAmountSum }) => (
										<Descriptions.Item label={typeName}>
											<Text
												type={
													isPositiveNum(rewardAmountSum) ? undefined : 'danger'
												}
											>
												{numFormatToDigits(rewardAmountSum || 0)}
											</Text>
										</Descriptions.Item>
									))}
								</Descriptions>
							}
							trigger='click'
						>
							<Typography.Link
								type={isPositiveNum(custRewardTotalSum) ? undefined : 'danger'}
							>
								{numFormatToDigits(custRewardTotalSum || 0)}
							</Typography.Link>
						</Popover>
					) : (
						<Text
							type={isPositiveNum(custRewardTotalSum) ? undefined : 'danger'}
						>
							{numFormatToDigits(custRewardTotalSum || 0)}
						</Text>
					)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalRebate')}>
					{custRebateTotalSum > 0 ? (
						<Popover
							content={
								<Descriptions
									size='small'
									bordered
									title={t('Label_TotalRebate')}
									column={1}
								>
									{custRebateCategory.map(
										({ categoryName, rebateAmountSum }) => (
											<Descriptions.Item label={categoryName}>
												<Text
													type={
														isPositiveNum(rebateAmountSum)
															? undefined
															: 'danger'
													}
												>
													{numFormatToDigits(rebateAmountSum || 0)}
												</Text>
											</Descriptions.Item>
										)
									)}
								</Descriptions>
							}
							trigger='click'
						>
							<Typography.Link
								type={isPositiveNum(custRebateTotalSum) ? undefined : 'danger'}
							>
								{numFormatToDigits(custRebateTotalSum || 0)}
							</Typography.Link>
						</Popover>
					) : (
						<Typography.Text
							type={isPositiveNum(custRebateTotalSum) ? undefined : 'danger'}
						>
							{numFormatToDigits(custRebateTotalSum ?? 0)}
						</Typography.Text>
					)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_CancelBonus')}>
					<Typography.Text
						type={isPositiveNum(cancelBonusAmount) ? undefined : 'danger'}
					>
						{numFormatToDigits(cancelBonusAmount ?? 0)}
					</Typography.Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_RewardsPoint')}>
					<Typography.Text
						type={isPositiveNum(rewardPoint) ? undefined : 'danger'}
					>
						{numFormatToDigits(rewardPoint ?? 0)}
					</Typography.Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_RunningBonus')}>
					<Typography.Text>{description}</Typography.Text>
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default BonusWalletDescriptions

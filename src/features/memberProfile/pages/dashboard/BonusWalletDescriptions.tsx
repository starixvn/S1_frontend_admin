import { Descriptions, Popover, Spin, Typography } from 'antd'
import { numberFormatter } from 'common/utils/format'
import {
	IBonusWalletDetailData,
	IBonusWalletInfoData,
} from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'

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

	const { bonus: bonusWallet = 0, remainingTurnover: bonusRollover = 0 } =
		bonusWalletInfoData

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
					{numberFormatter.format(bonusWallet)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_BonusRollover')}>
					{numberFormatter.format(bonusRollover)}
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
										{numberFormatter.format(firstDeposit)}
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_ReDeposit')}>
										{numberFormatter.format(reDeposit)}
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_FreeBet')}>
										{numberFormatter.format(freeBet)}
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_CashBack')}>
										{numberFormatter.format(cashBack)}
									</Descriptions.Item>
									<Descriptions.Item
										label={t('BonusType.Label_RetentionBonus')}
									>
										{numberFormatter.format(retentionBonus)}
									</Descriptions.Item>
									<Descriptions.Item label={t('BonusType.Label_ManualBonus')}>
										{numberFormatter.format(manualBonus)}
									</Descriptions.Item>
								</Descriptions>
							}
							trigger='click'
						>
							<Typography.Link>
								{numberFormatter.format(totalBonus ?? 0)}
							</Typography.Link>
						</Popover>
					) : (
						<Typography.Text>
							{numberFormatter.format(totalBonus ?? 0)}
						</Typography.Text>
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
											{numberFormatter.format(rewardAmountSum)}
										</Descriptions.Item>
									))}
								</Descriptions>
							}
							trigger='click'
						>
							<Typography.Link>
								{numberFormatter.format(custRewardTotalSum ?? 0)}
							</Typography.Link>
						</Popover>
					) : (
						<Typography.Text>
							{numberFormatter.format(custRewardTotalSum ?? 0)}
						</Typography.Text>
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
												{numberFormatter.format(rebateAmountSum)}
											</Descriptions.Item>
										)
									)}
								</Descriptions>
							}
							trigger='click'
						>
							<Typography.Link>
								{numberFormatter.format(custRebateTotalSum ?? 0)}
							</Typography.Link>
						</Popover>
					) : (
						<Typography.Text>
							{numberFormatter.format(custRebateTotalSum ?? 0)}
						</Typography.Text>
					)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_CancelBonus')}>
					{numberFormatter.format(cancelBonusAmount ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_RewardsPoint')}>
					{numberFormatter.format(rewardPoint ?? 0)}
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default BonusWalletDescriptions

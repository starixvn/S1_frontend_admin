import { Descriptions, Spin } from 'antd'
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

	const { custBonusSum, custRebateSum, custRewardSum } =
		bonusWalletDetailData ?? {}

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
					{numberFormatter.format(custBonusSum?.totalBonus ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalReward')}>
					{numberFormatter.format(custRewardSum?.custRewardTotalSum ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalRebate')}>
					{numberFormatter.format(custRebateSum?.custRebateTotalSum ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_CancelBonus')}>
					{numberFormatter.format(custBonusSum?.cancelBonusAmount ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_RewardsPoint')}>
					{numberFormatter.format(custBonusSum?.rewardPoint ?? 0)}
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default BonusWalletDescriptions

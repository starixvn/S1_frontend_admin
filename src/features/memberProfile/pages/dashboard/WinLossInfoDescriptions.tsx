import { Descriptions, Spin } from 'antd'
import { numberFormatter } from 'common/utils/format'
import { IWinLossInfoData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'

interface IWinLossInfoDescriptionsProps {
	loading: boolean
	winLossInfo: IWinLossInfoData | undefined
}

const WinLossInfoDescriptions = ({
	loading,
	winLossInfo,
}: IWinLossInfoDescriptionsProps) => {
	const { t } = useTranslation()
	const { winLoss, validBet, winnings, losses, outstandingAmount } =
		winLossInfo ?? {}

	return (
		<Spin spinning={loading}>
			<Descriptions
				layout='horizontal'
				bordered
				column={1}
				size='middle'
				labelStyle={{ width: '50%' }}
			>
				<Descriptions.Item label={t('Label_WinLoss')}>
					{numberFormatter.format(winLoss ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_ValidBet')}>
					{numberFormatter.format(validBet ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Winnings')}>
					{numberFormatter.format(winnings ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Losses')}>
					{numberFormatter.format(losses ?? 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_OutstandingAmount')}>
					{numberFormatter.format(outstandingAmount ?? 0)}
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default WinLossInfoDescriptions

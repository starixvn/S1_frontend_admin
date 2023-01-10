import { Descriptions, Spin, Typography } from 'antd'
import { isPositiveNum } from 'common/utils'
import { numFormatToDigits } from 'common/utils/format'
import { IWinLossInfoData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

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
				size='small'
				layout='horizontal'
				bordered
				column={1}
				labelStyle={{ width: '50%' }}
			>
				<Descriptions.Item label={t('Label_WinLoss')}>
					<Text type={isPositiveNum(winLoss || 0) ? undefined : 'danger'}>
						{numFormatToDigits(winLoss || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_ValidBet')}>
					<Text type={isPositiveNum(validBet || 0) ? undefined : 'danger'}>
						{numFormatToDigits(validBet || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Winnings')}>
					<Text type={isPositiveNum(winnings || 0) ? undefined : 'danger'}>
						{numFormatToDigits(winnings || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Losses')}>
					<Text type={isPositiveNum(losses || 0) ? undefined : 'danger'}>
						{numFormatToDigits(losses || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_OutstandingAmount')}>
					<Text
						type={isPositiveNum(outstandingAmount || 0) ? undefined : 'danger'}
					>
						{numFormatToDigits(outstandingAmount || 0)}
					</Text>
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default WinLossInfoDescriptions

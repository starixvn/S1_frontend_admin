import { isPositiveNum } from 'common/utils'
import { Descriptions, Spin, Typography } from 'antd'
import { numFormatToDigits } from 'common/utils/format'
import { IConfiscatedSummaryData } from 'features/confiscatedSummaryReport/type'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

interface IConfiscatedSummaryTableProps {
	loading: boolean
	confiscatedSummaryData: IConfiscatedSummaryData
}

const ConfiscatedSummaryDescription = ({
	loading,
	confiscatedSummaryData,
}: IConfiscatedSummaryTableProps) => {
	const { t } = useTranslation()
	const {
		totalUser,
		totalSeamlessWallet,
		totalDeposit,
		totalWithdrawal,
		totalNetDeposit,
		totalNetConfiscatedCash,
	} = confiscatedSummaryData
	return (
		<Spin spinning={loading}>
			<Descriptions layout='vertical' bordered column={6} size='small'>
				<Descriptions.Item label={t('Label_TotalUsers')}>
					<Text type={isPositiveNum(totalUser) ? undefined : 'danger'}>
						{numFormatToDigits(totalUser || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_SeamlessWallet')}>
					<Text
						type={isPositiveNum(totalSeamlessWallet) ? undefined : 'danger'}
					>
						{numFormatToDigits(totalSeamlessWallet || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalDeposit')}>
					<Text type={isPositiveNum(totalDeposit) ? undefined : 'danger'}>
						{numFormatToDigits(totalDeposit || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalWithdrawal')}>
					<Text type={isPositiveNum(totalWithdrawal) ? undefined : 'danger'}>
						{numFormatToDigits(totalWithdrawal || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_ToTalNetDeposit')}>
					<Text type={isPositiveNum(totalNetDeposit) ? undefined : 'danger'}>
						{numFormatToDigits(totalNetDeposit || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_TotalNetConfiscatedCash')}>
					<Text
						type={isPositiveNum(totalNetConfiscatedCash) ? undefined : 'danger'}
					>
						{numFormatToDigits(totalNetConfiscatedCash || 0)}
					</Text>
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default ConfiscatedSummaryDescription

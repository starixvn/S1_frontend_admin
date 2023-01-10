import React from 'react'
import { Descriptions, Spin, Typography } from 'antd'
import { numFormatToDigits } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { ICustTpWalletData } from 'features/memberProfile/type'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography

interface ITpWalletDescriptionsProps {
	loading: boolean
	tpWalletData: ICustTpWalletData | undefined
}

const TpWalletDescriptions = ({
	loading,
	tpWalletData,
}: ITpWalletDescriptionsProps) => {
	const { t } = useTranslation()

	return (
		<Spin spinning={loading}>
			<Descriptions
				size='small'
				layout='horizontal'
				bordered
				column={1}
				labelStyle={{ width: '50%' }}
			>
				<Descriptions.Item label={t('Label_TransferWallet')}>
					<Text
						type={
							isPositiveNum(tpWalletData?.totalTpWalletBalance || 0)
								? undefined
								: 'danger'
						}
					>
						{numFormatToDigits(tpWalletData?.totalTpWalletBalance || 0)}
					</Text>
				</Descriptions.Item>

				{tpWalletData?.tpWalletList.map(({ tpName, tpId, balance }) => (
					<Descriptions.Item label={tpName} key={tpId}>
						{numFormatToDigits(balance ?? 0)}
					</Descriptions.Item>
				))}
			</Descriptions>
		</Spin>
	)
}

export default TpWalletDescriptions

import { Descriptions, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { SelectOutlined } from '@ant-design/icons'
import { IPaymentData } from 'common/service/baseDataApi/type'

const DepositRequestPaymentInfoDescriptions = ({
	paymentInfo,
}: {
	paymentInfo: IPaymentData | undefined
}) => {
	const { t } = useTranslation()
	const {
		payName,
		loginUrl,
		loginAccount,
		loginPassword,
		transferPin,
		loginPin,
	} = paymentInfo ?? {}

	return (
		<Descriptions
			title={t('Label_PaymentInfo')}
			bordered
			column={1}
			labelStyle={{ minWidth: '160px' }}
			size='small'
		>
			<Descriptions.Item label={t('Label_Payment')}>
				{payName || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_Link')}>
				<Typography.Link href={loginUrl || '/'} target='_blank'>
					<SelectOutlined />
				</Typography.Link>
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_Account')}>
				{loginAccount || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_Password')}>
				{loginPassword || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_TransferPin')}>
				{transferPin || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_LoginPin')}>
				{loginPin || '-'}
			</Descriptions.Item>
		</Descriptions>
	)
}

export default DepositRequestPaymentInfoDescriptions

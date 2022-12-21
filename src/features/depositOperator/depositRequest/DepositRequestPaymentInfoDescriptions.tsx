import { Button, Descriptions, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { CopyOutlined, SelectOutlined } from '@ant-design/icons'
import { IPaymentData } from 'common/service/baseDataApi/type'
import { useCopy } from 'common/hooks'

const DepositRequestPaymentInfoDescriptions = ({
	paymentInfo,
}: {
	paymentInfo: IPaymentData | undefined
}) => {
	const { t } = useTranslation()
	const { onCopy } = useCopy()
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
				<Row align='middle' justify='space-between'>
					{loginAccount || '-'}
					<Button
						disabled={!loginAccount}
						type='link'
						style={{ padding: '0px' }}
						icon={<CopyOutlined />}
						onClick={() => onCopy(String(loginAccount))}
					/>
				</Row>
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_Password')}>
				<Row align='middle' justify='space-between'>
					{loginPassword || '-'}
					<Button
						disabled={!loginPassword}
						type='link'
						style={{ padding: '0px' }}
						icon={<CopyOutlined />}
						onClick={() => onCopy(String(loginPassword))}
					/>
				</Row>
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

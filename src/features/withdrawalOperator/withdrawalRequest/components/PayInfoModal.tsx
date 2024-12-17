import { useTranslation } from 'react-i18next'
import { Descriptions, Modal, Row, Typography } from 'antd'
import type { IPayInfoWithBankLoginInfo } from 'features/withdrawalOperator/type'
import React from 'react'
import { WithdrawalTypeEnum } from 'features/withdrawalOperator/constants'
import { CopyOutlined } from '@ant-design/icons'
import { useCopy } from 'common/hooks'

interface IPayInfoModalProps {
	visible: boolean
	type: number
	payInfo?: IPayInfoWithBankLoginInfo
	onCancel: () => void
}

const { Item } = Descriptions

const PayInfoModal = ({
	visible,
	type,
	payInfo,
	onCancel,
}: IPayInfoModalProps) => {
	const { t } = useTranslation()
	const { onCopy } = useCopy()
	const isLocalBankingOrCryptoWallet =
		type === WithdrawalTypeEnum.LocalBank ||
		type === WithdrawalTypeEnum.CryptoWallet

	const {
		accountNo,
		transferPin,
		bankLoginInfo = [],
		loginPin,
		loginUrl,
		mobilePin,
		corporateID,
	} = payInfo ?? {}

	return (
		<Modal
			closable
			open={visible}
			footer={false}
			onCancel={onCancel}
			title={<div style={{ textAlign: 'center' }}>{t('Label_LoginInfo')}</div>}
		>
			<Descriptions layout='horizontal' column={1} bordered size='small'>
				<Item
					label={
						isLocalBankingOrCryptoWallet
							? t('Label_AccountNo')
							: t('Label_PayName')
					}
				>
					{accountNo || '-'}
				</Item>
				<Item label={t('Label_Link')}>
					{/* 沒有連結就回首頁 */}
					<Typography.Link href={loginUrl || '/'} target='_blank'>
						{t('Label_ClickHere')}
					</Typography.Link>
				</Item>

				{bankLoginInfo.map((info, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<React.Fragment key={index}>
						<Item label={`${t('Label_LoginAccount')} ${index + 1}`}>
							<Row justify='space-between'>
								{info.account || '-'}
								<Typography.Link onClick={() => onCopy(String(info.account))}>
									<CopyOutlined style={{ fontSize: '1rem' }} />
								</Typography.Link>
							</Row>
						</Item>
						<Item label={`${t('Label_LoginPassword')} ${index + 1}`}>
							<Row justify='space-between'>
								{info.password || '-'}
								<Typography.Link onClick={() => onCopy(String(info.password))}>
									<CopyOutlined style={{ fontSize: '1rem' }} />
								</Typography.Link>
							</Row>
						</Item>
					</React.Fragment>
				))}

				<Item label={t('Label_TransferPin')}>{transferPin || '-'}</Item>
				<Item label={t('Label_LoginPin')}>{loginPin || '-'}</Item>
				{isLocalBankingOrCryptoWallet && (
					<>
						<Item label={t('Label_MobilePin')}>{mobilePin || '-'}</Item>
						<Item label={t('Label_CorporateID')}>{corporateID || '-'}</Item>
					</>
				)}
			</Descriptions>
		</Modal>
	)
}

export { PayInfoModal }

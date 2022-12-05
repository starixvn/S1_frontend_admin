import React from 'react'
import { Descriptions, Typography } from 'antd'
import { IBankInfoOffState } from 'common/service/baseDataApi/type'
import { SelectOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const DepositRequestBankInfoDescriptions = ({
	bankInfo,
}: {
	bankInfo: IBankInfoOffState | undefined
}) => {
	const { t } = useTranslation()
	const {
		displayName,
		bankLoginUrl,
		bankLoginAccount,
		bankLoginPassword,
		transferPin,
		loginPin,
		mobilePin,
		corporateID,
	} = bankInfo ?? {}

	return (
		<Descriptions
			title='Deposit Info'
			bordered
			column={1}
			labelStyle={{ minWidth: '160px' }}
			size='small'
		>
			<Descriptions.Item label={t('Label_BankAccountNo')}>
				{displayName || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_Link')}>
				{/* // * 如果沒有連結就回首頁 */}
				<Typography.Link href={bankLoginUrl || '/'} target='_blank'>
					<SelectOutlined />
				</Typography.Link>
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_Account')}>
				{bankLoginAccount || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_Password')}>
				{bankLoginPassword || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_TransferPin')}>
				{transferPin || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_LoginPin')}>
				{loginPin || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_MobilePin')}>
				{mobilePin || '-'}
			</Descriptions.Item>
			<Descriptions.Item label={t('Label_CorporateID')}>
				{corporateID || '-'}
			</Descriptions.Item>
		</Descriptions>
	)
}

export default DepositRequestBankInfoDescriptions

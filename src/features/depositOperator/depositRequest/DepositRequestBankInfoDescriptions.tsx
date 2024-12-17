import React from 'react'
import { Button, Descriptions, Row, Typography } from 'antd'
import { IBankInfoOffState } from 'common/service/baseDataApi/type'
import { CopyOutlined, SelectOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useCopy } from 'common/hooks'

const DepositRequestBankInfoDescriptions = ({
	bankInfo,
}: {
	bankInfo: IBankInfoOffState | undefined
}) => {
	const { t } = useTranslation()
	const { onCopy } = useCopy()
	const {
		displayName,
		bankLoginUrl,
		bankLoginInfo = [{ account: '', password: '' }],
		transferPin,
		loginPin,
		mobilePin,
		corporateID,
	} = bankInfo ?? {}

	return (
		<Descriptions
			title={t('Label_BankInfo')}
			bordered
			column={1}
			labelStyle={{ minWidth: '140px' }}
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
			{bankLoginInfo.map((info, index) => {
				const { account, password } = info || {}
				return (
					// eslint-disable-next-line react/no-array-index-key
					<React.Fragment key={index}>
						<Descriptions.Item label={t('Label_Account')}>
							<Row align='middle' justify='space-between'>
								{account || '-'}
								<Button
									disabled={!account}
									type='link'
									style={{ padding: '0px' }}
									icon={<CopyOutlined />}
									onClick={() => onCopy(String(account))}
								/>
							</Row>
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_Password')}>
							<Row align='middle' justify='space-between'>
								{password || '-'}
								<Button
									disabled={!password}
									type='link'
									style={{ padding: '0px' }}
									icon={<CopyOutlined />}
									onClick={() => onCopy(String(password))}
								/>
							</Row>
						</Descriptions.Item>
					</React.Fragment>
				)
			})}
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

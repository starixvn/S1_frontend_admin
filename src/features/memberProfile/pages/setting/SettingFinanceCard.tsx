import React from 'react'
import { Card, Col, Popconfirm, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { MethodTypeEnum } from 'features/balanceAdjustment/constants'

interface ISettingFinanceCardProps {
	userName: string | undefined
	onResetBankInfo: () => void
	onResetEWallet: () => void
	onResetCryptoInfo: () => void
}

const SettingFinanceCard = ({
	userName,
	onResetBankInfo,
	onResetEWallet,
	onResetCryptoInfo,
}: ISettingFinanceCardProps) => {
	const { t } = useTranslation()
	return (
		<Col xxl={5} xl={5} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Finance')} style={{ height: '100%' }}>
				<p>
					<Popconfirm title={t('Label_AreYouSure')} onConfirm={onResetBankInfo}>
						<Typography.Link>{t('Label_ResetBankInfo')}</Typography.Link>
					</Popconfirm>
				</p>
				<p>
					<Popconfirm title={t('Label_AreYouSure')} onConfirm={onResetEWallet}>
						<Typography.Link>{t('Label_ResetEWallet')}</Typography.Link>
					</Popconfirm>
				</p>
				<p>
					<Popconfirm
						title={t('Label_AreYouSure')}
						onConfirm={onResetCryptoInfo}
					>
						<Typography.Link>{t('Label_ResetCryptoInfo')}</Typography.Link>
					</Popconfirm>
				</p>
				<p>
					<Link
						to={`/${NEW_SITE_PREFIX_URL}/${paths.finance.sub.adjustment.sub.balanceAdjustment.root}?userName=${userName}&methodType=${MethodTypeEnum.mainWallet}`}
					>
						{t('Label_BalanceAdjustment')}
					</Link>
				</p>
				<p>
					{/*  跳轉到調帳頁面自動搜本用戶 */}
					<Link
						to={`/${NEW_SITE_PREFIX_URL}/${paths.finance.sub.adjustment.sub.balanceAdjustment.root}?userName=${userName}&methodType=${MethodTypeEnum.thirdPartyWallet}`}
					>
						{t('Label_3RDPartyAdjustment')}
					</Link>
				</p>
			</Card>
		</Col>
	)
}

export default SettingFinanceCard

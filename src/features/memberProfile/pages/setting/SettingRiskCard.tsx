import { Card, Col, Popconfirm, Row, Switch, Typography } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import {
	IGetBasicInfoData,
	SettingEditTypeEnum,
	SettingSwitchTypeEnum,
} from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ISettingRiskCardProps {
	custId: number
	custBasicInfo: IGetBasicInfoData
	isSwitchIsKycLoading: boolean
	isSwitchRiskLoading: boolean
	isSwitchPhoneVerifiedLoading: boolean
	isSwitchEmailVerifiedLoading: boolean
	onSwitch: (newSwitchType: SettingSwitchTypeEnum, checked: boolean) => void
	onEditTypeChange: (newEditType: SettingEditTypeEnum | undefined) => void
	onResetPassword: () => void
}

const SettingRiskCard = ({
	custId,
	custBasicInfo,
	isSwitchIsKycLoading,
	isSwitchPhoneVerifiedLoading,
	isSwitchRiskLoading,
	isSwitchEmailVerifiedLoading,
	onSwitch,
	onEditTypeChange,
	onResetPassword,
}: ISettingRiskCardProps) => {
	const { t } = useTranslation()
	const { isKyc, isRisk, phoneVerified, emailVerified } = custBasicInfo

	return (
		<Col xxl={5} xl={5} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Risk')} style={{ height: '100%' }}>
				<p>
					<Row>
						<Col span={6}>{t('Label_IsKyc')}</Col>
						<Col span={6} offset={12}>
							<Switch
								loading={isSwitchIsKycLoading}
								checked={isKyc}
								onChange={checked =>
									onSwitch(SettingSwitchTypeEnum.IsKyc, checked)
								}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Row>
						<Col span={6}>{t('Label_IsRisk')}</Col>
						<Col span={6} offset={12}>
							<Switch
								loading={isSwitchRiskLoading}
								checked={isRisk}
								onChange={checked =>
									onSwitch(SettingSwitchTypeEnum.Risk, checked)
								}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Row>
						<Col span={6}>{t('Label_PhoneVerified')}</Col>
						<Col span={6} offset={12}>
							<Switch
								loading={isSwitchPhoneVerifiedLoading}
								checked={phoneVerified}
								onChange={checked =>
									onSwitch(SettingSwitchTypeEnum.PhoneVerified, checked)
								}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Row>
						<Col span={6}>{t('Label_EmailVerified')}</Col>
						<Col span={6} offset={12}>
							<Switch
								loading={isSwitchEmailVerifiedLoading}
								checked={emailVerified}
								onChange={checked =>
									onSwitch(SettingSwitchTypeEnum.EmailVerified, checked)
								}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Popconfirm title={t('Label_AreYouSure')} onConfirm={onResetPassword}>
						<Typography.Link>{t('Label_ResetPassword')}</Typography.Link>
					</Popconfirm>
				</p>
				<p>
					<Link
						to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/ipLog/${custId}`}
					>
						{t('Label_BlockIP')}
					</Link>
				</p>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.LockAccount)}
					>
						{t('Label_LockAccount')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.CloseAccount)}
					>
						{t('Label_CloseAccount')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.KickOutUser)}
					>
						{t('Label_KickOut')}
					</Typography.Link>
				</p>
			</Card>
		</Col>
	)
}

export default SettingRiskCard

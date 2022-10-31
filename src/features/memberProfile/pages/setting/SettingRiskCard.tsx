import { Card, Col, Popconfirm, Row, Switch, Typography } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import {
	IGetBasicInfoData,
	ISettingRiskPermissions,
	SettingEditTypeEnum,
	SettingSwitchTypeEnum,
} from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ISettingRiskCardProps {
	riskPermissions: ISettingRiskPermissions
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
	riskPermissions: {
		isKycPermission,
		isRickPermission,
		phoneVerifiedPermission,
		emailVerifiedPermission,
		resetPasswordPermission,
		lockAccountPermission,
		closeAccountPermission,
		kickOutPermission,
	},
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
								disabled={!isKycPermission?.canUse}
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
								disabled={!isRickPermission?.canUse}
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
								disabled={!phoneVerifiedPermission?.canUse}
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
								disabled={!emailVerifiedPermission?.canUse}
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
					<Popconfirm
						disabled={!resetPasswordPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={onResetPassword}
					>
						<Typography.Link disabled={!resetPasswordPermission?.canUse}>
							{t('Label_ResetPassword')}
						</Typography.Link>
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
						disabled={!lockAccountPermission?.canUse}
						onClick={() => onEditTypeChange(SettingEditTypeEnum.LockAccount)}
					>
						{t('Label_LockAccount')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						disabled={!closeAccountPermission?.canUse}
						onClick={() => onEditTypeChange(SettingEditTypeEnum.CloseAccount)}
					>
						{t('Label_CloseAccount')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						disabled={!kickOutPermission?.canUse}
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

import { Card, Col, Popconfirm, Row, Switch, Typography } from 'antd'
import {
	IGetBasicInfoData,
	PayoutVerificationRewardOTPTypeEnum,
	SettingSwitchTypeEnum,
	ISettingMarketingPermissions,
} from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'

interface ISettingMarketingCardProps {
	marketingPermissions: ISettingMarketingPermissions
	custBasicInfo: IGetBasicInfoData
	isSwitchRebatePayoutLoading: boolean
	onSwitch: (newSwitchType: SettingSwitchTypeEnum, checked: boolean) => void
	onSetPayoutVerificationReward: (
		OTPType: PayoutVerificationRewardOTPTypeEnum
	) => void
}

const SettingMarketingCard = ({
	marketingPermissions: {
		phoneVerifiedRewardPermission,
		emailVerifiedRewardPermission,
		lockRebatePayoutPermission,
	},
	custBasicInfo,
	isSwitchRebatePayoutLoading,
	onSwitch,
	onSetPayoutVerificationReward,
}: ISettingMarketingCardProps) => {
	const { t } = useTranslation()
	const isRebatePayoutStatus = Boolean(custBasicInfo.enableRebate)
	return (
		<Col xxl={5} xl={5} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Marketing')} style={{ height: '100%' }}>
				<p>
					<Popconfirm
						disabled={!phoneVerifiedRewardPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() =>
							onSetPayoutVerificationReward(
								PayoutVerificationRewardOTPTypeEnum.Phone
							)
						}
					>
						<Typography.Link disabled={!phoneVerifiedRewardPermission?.canUse}>
							{t('Label_PhoneVerifiedReward')}
						</Typography.Link>
					</Popconfirm>
				</p>
				<p>
					<Popconfirm
						disabled={!emailVerifiedRewardPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() =>
							onSetPayoutVerificationReward(
								PayoutVerificationRewardOTPTypeEnum.Email
							)
						}
					>
						<Typography.Link disabled={!emailVerifiedRewardPermission?.canUse}>
							{t('Label_EmailVerifiedReward')}
						</Typography.Link>
					</Popconfirm>
				</p>
				<p>
					<Row>
						<Col span={6}>{t('Label_RebatePayout')}</Col>
						<Col span={6} offset={12}>
							<Switch
								disabled={!lockRebatePayoutPermission?.canUse}
								loading={isSwitchRebatePayoutLoading}
								checked={isRebatePayoutStatus}
								onChange={checked =>
									onSwitch(SettingSwitchTypeEnum.RebatePayout, checked)
								}
							/>
						</Col>
					</Row>
				</p>
			</Card>
		</Col>
	)
}

export default SettingMarketingCard

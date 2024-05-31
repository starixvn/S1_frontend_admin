import { Card, Col, Popconfirm, Row, Space, Switch, Typography } from 'antd'
import {
	IGetBasicInfoData,
	PayoutVerificationRewardOTPTypeEnum,
	SettingSwitchTypeEnum,
	ISettingMarketingPermissions,
	ICustPromotionWhiteData,
	SettingCustPromotionWitheListEnum,
} from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { useTimeZone } from 'components/TimeZoneSelect'
import { isNull } from 'lodash'

interface ISettingMarketingCardProps {
	marketingPermissions: ISettingMarketingPermissions
	custBasicInfo: IGetBasicInfoData
	custPromotionWhiteData: ICustPromotionWhiteData
	isSwitchRebatePayoutLoading: boolean
	isSwitchVipAutomationLoading: boolean
	onSwitch: (newSwitchType: SettingSwitchTypeEnum, checked: boolean) => void
	onSwitchPromotionWhiteList: (
		newSwitchType: SettingCustPromotionWitheListEnum,
		checkedIp: boolean,
		checkedDevice: boolean,
		checkedRealName: boolean
	) => void
	onSetPayoutVerificationReward: (
		OTPType: PayoutVerificationRewardOTPTypeEnum
	) => void
}

const SettingMarketingCard = ({
	marketingPermissions: {
		phoneVerifiedRewardPermission,
		emailVerifiedRewardPermission,
		lockRebatePayoutPermission,
		exclusiveVipPermission,
	},
	custBasicInfo,
	custPromotionWhiteData,
	isSwitchRebatePayoutLoading,
	isSwitchVipAutomationLoading,
	onSwitch,
	onSwitchPromotionWhiteList,
	onSetPayoutVerificationReward,
}: ISettingMarketingCardProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const { enableRebate, phoneRewardTime, emailRewardTime, exclusive } =
		custBasicInfo
	const isRebatePayoutStatus = Boolean(enableRebate)

	return (
		<Col xxl={5} xl={5} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Marketing')} style={{ height: '100%' }}>
				<p>
					{isNull(phoneRewardTime) ? (
						<Popconfirm
							disabled={!phoneVerifiedRewardPermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() =>
								onSetPayoutVerificationReward(
									PayoutVerificationRewardOTPTypeEnum.Phone
								)
							}
						>
							<Typography.Link
								disabled={!phoneVerifiedRewardPermission?.canUse}
							>
								{t('Label_PhoneVerifiedReward')}
							</Typography.Link>
						</Popconfirm>
					) : (
						<Space direction='vertical'>
							<Typography.Text type='success'>
								{t('Label_PhoneVerifiedReward')}
							</Typography.Text>
							<Typography.Text>
								{phoneRewardTime
									? dayjs(phoneRewardTime)
											.utcOffset(timeZoneUtcOffset)
											.format(timeFormat)
									: ''}
							</Typography.Text>
						</Space>
					)}
				</p>
				<p>
					{isNull(emailRewardTime) ? (
						<Popconfirm
							disabled={!emailVerifiedRewardPermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() =>
								onSetPayoutVerificationReward(
									PayoutVerificationRewardOTPTypeEnum.Email
								)
							}
						>
							<Typography.Link
								disabled={!emailVerifiedRewardPermission?.canUse}
							>
								{t('Label_EmailVerifiedReward')}
							</Typography.Link>
						</Popconfirm>
					) : (
						<Space direction='vertical'>
							<Typography.Text type='success'>
								{t('Label_EmailVerifiedReward')}
							</Typography.Text>
							<Typography.Text>
								{emailRewardTime
									? dayjs(emailRewardTime)
											.utcOffset(timeZoneUtcOffset)
											.format(timeFormat)
									: ''}
							</Typography.Text>
						</Space>
					)}
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
				<p>
					<Row>
						<Col span={16}>{t('Label_BonusIPDisable')}</Col>
						<Col span={6} offset={2}>
							<Switch
								//  目前 api 3個switch做一起 先不綁 loading
								checked={custPromotionWhiteData.ipEnable}
								onChange={checkedIP =>
									onSwitchPromotionWhiteList(
										SettingCustPromotionWitheListEnum.ipEnable,
										checkedIP,
										custPromotionWhiteData.deviceEnable,
										custPromotionWhiteData.realNameEnable
									)
								}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Row>
						<Col span={16}>{t('Label_BonusDeviceDisable')}</Col>
						<Col span={6} offset={2}>
							<Switch
								//  目前 api 3個switch做一起 先不綁 loading
								checked={custPromotionWhiteData.deviceEnable}
								onChange={checkedDevice =>
									onSwitchPromotionWhiteList(
										SettingCustPromotionWitheListEnum.deviceEnable,
										custPromotionWhiteData.ipEnable,
										checkedDevice,
										custPromotionWhiteData.realNameEnable
									)
								}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Row>
						<Col span={16}>{t('Label_BonusRealNameDisable')}</Col>
						<Col span={6} offset={2}>
							<Switch
								//  目前 api 3個switch做一起 先不綁 loading
								checked={custPromotionWhiteData.realNameEnable}
								onChange={checkedRealName =>
									onSwitchPromotionWhiteList(
										SettingCustPromotionWitheListEnum.realNameEnable,
										custPromotionWhiteData.ipEnable,
										custPromotionWhiteData.deviceEnable,
										checkedRealName
									)
								}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Row>
						<Col span={16}>{t('Label_ExclusiveVIP')}</Col>
						<Col span={6} offset={2}>
							<Switch
								checked={Boolean(exclusive)}
								loading={isSwitchVipAutomationLoading}
								disabled={!exclusiveVipPermission?.canUse}
								onChange={checked =>
									onSwitch(SettingSwitchTypeEnum.ExclusiveVIP, checked)
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

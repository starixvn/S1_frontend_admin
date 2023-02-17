import { useEffect, useState } from 'react'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { useAuth, useModal } from 'common/hooks'
import { useParams } from 'react-router-dom'
import { Button, Form, message, notification, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { uniqueId } from 'lodash'
import {
	useCloseAccountMutation,
	useEditAddressMutation,
	useEditBirthdayMutation,
	useEditEmailNameMutation,
	useEditFullNameMutation,
	useEditPhoneNoMutation,
	useGetBasicInfoQuery,
	useLockAccountMutation,
	useResetBankInfoMutation,
	useResetEWalletMutation,
	useResetCryptoInfoMutation,
	useResetPasswordMutation,
	useSetPayoutVerificationRewardMutation,
	useSwitchEmailVerifiedMutation,
	useSwitchIsKycMutation,
	useSwitchPhoneVerifiedMutation,
	useSwitchRebatePayoutMutation,
	useSwitchRiskMutation,
	useKickOutUserMutation,
	useGetCustPromotionWhiteListDataQuery,
	useEditCustPromotionWhiteListMutation,
} from 'features/memberProfile/api'
import {
	ISettingFinancePermissions,
	IGetBasicInfoResponse,
	ISettingForm,
	ISettingRiskPermissions,
	PayoutVerificationRewardOTPTypeEnum,
	LockAccountTypeEnum,
	SettingEditTypeEnum,
	SettingSwitchTypeEnum,
	ISettingMarketingPermissions,
	ISettingInfoPermissions,
	ICustPromotionWhiteResponse,
	SettingCustPromotionWitheListEnum,
} from 'features/memberProfile/type'
import copy from 'copy-to-clipboard'
import SettingInfoCard from './SettingInfoCard'
import SettingEditModal from './SettingEditModal'
import SettingRiskCard from './SettingRiskCard'
import SettingMarketingCard from './SettingMarketingCard'
import SettingFinanceCard from './SettingFinanceCard'
import SettingTagsModal from './SettingTagsModal'
import SettingVipLevelModal from './SettingVipLevelModal'
import SettingGameCard from './SettingGameCard'

const Setting = () => {
	const { t } = useTranslation()
	const {
		actionPermissions: {
			// * infoPermissions
			editFullNamePermission,
			editEMailPermission,
			editPhoneNumberPermission,
			changeVIPLevelPermission,
			editBirthdayPermission,
			editAddressPermission,
			editTagPermission,
			// * riskPermissions
			isKycPermission,
			isRickPermission,
			phoneVerifiedPermission,
			emailVerifiedPermission,
			resetPasswordPermission,
			lockAccountPermission,
			closeAccountPermission,
			kickOutPermission,
			// * financePermissions
			resetBankInfoPermission,
			resetEWalletPermission,
			resetCryptoInfoPermission,
			// * marketingPermissions
			phoneVerifiedRewardPermission,
			emailVerifiedRewardPermission,
			lockRebatePayoutPermission,
		} = {},
	} = useAuth()

	const infoPermissions: ISettingInfoPermissions = {
		editFullNamePermission,
		editEMailPermission,
		editPhoneNumberPermission,
		changeVIPLevelPermission,
		editBirthdayPermission,
		editAddressPermission,
		editTagPermission,
	}

	const riskPermissions: ISettingRiskPermissions = {
		isKycPermission,
		isRickPermission,
		phoneVerifiedPermission,
		emailVerifiedPermission,
		resetPasswordPermission,
		lockAccountPermission,
		closeAccountPermission,
		kickOutPermission,
	}

	const financePermissions: ISettingFinancePermissions = {
		resetBankInfoPermission,
		resetEWalletPermission,
		resetCryptoInfoPermission,
	}

	const marketingPermissions: ISettingMarketingPermissions = {
		phoneVerifiedRewardPermission,
		emailVerifiedRewardPermission,
		lockRebatePayoutPermission,
	}

	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const [form] = Form.useForm<ISettingForm>()
	const [editType, setEditType] = useState<SettingEditTypeEnum | undefined>()
	const editModal = useModal()
	const tagsModal = useModal()
	const vipLevelModal = useModal()

	const {
		data: { data: custBasicInfo } = {} as IGetBasicInfoResponse,
		isFetching: isGetCustBasicInfoLoading,
	} = useGetBasicInfoQuery({
		custId,
	})

	const {
		data: { data: custPromotionWhiteData } = {} as ICustPromotionWhiteResponse,
	} = useGetCustPromotionWhiteListDataQuery({
		custId,
	})

	const [editFullName, { isLoading: isEditFullNameLoading }] =
		useEditFullNameMutation()

	const [editEmail, { isLoading: isEditEmailLoading }] =
		useEditEmailNameMutation()

	const [editPhoneNo, { isLoading: isEditPhoneNoLoading }] =
		useEditPhoneNoMutation()

	const [editBirthday, { isLoading: isEditBirthdayLoading }] =
		useEditBirthdayMutation()

	const [editAddress, { isLoading: isEditAddressLoading }] =
		useEditAddressMutation()

	const [switchIsKyc, { isLoading: isSwitchIsKycLoading }] =
		useSwitchIsKycMutation()

	const [switchRisk, { isLoading: isSwitchRiskLoading }] =
		useSwitchRiskMutation()

	const [switchPhoneVerified, { isLoading: isSwitchPhoneVerifiedLoading }] =
		useSwitchPhoneVerifiedMutation()

	const [switchEmailVerified, { isLoading: isSwitchEmailVerifiedLoading }] =
		useSwitchEmailVerifiedMutation()

	const [resetPassword] = useResetPasswordMutation()

	const [lockAccount, { isLoading: isLockAccountLoading }] =
		useLockAccountMutation()

	const [closeAccount, { isLoading: isCloseAccountLoading }] =
		useCloseAccountMutation()

	const [kickOutUser, { isLoading: isKickOutUserLoading }] =
		useKickOutUserMutation()

	const [resetBankInfo] = useResetBankInfoMutation()

	const [resetEWallet] = useResetEWalletMutation()

	const [resetCryptoInfo] = useResetCryptoInfoMutation()

	const [switchRebatePayout, { isLoading: isSwitchRebatePayoutLoading }] =
		useSwitchRebatePayoutMutation()

	const [setPayoutVerificationReward] = useSetPayoutVerificationRewardMutation()

	const [editCustPromotionWhiteList] = useEditCustPromotionWhiteListMutation()

	const onEditTypeChange = (newEditType: SettingEditTypeEnum | undefined) => {
		setEditType(newEditType)
		editModal.onOpen()
	}

	const handleSwitch = async (
		newSwitchType: SettingSwitchTypeEnum,
		checked: boolean
	) => {
		try {
			switch (newSwitchType) {
				case SettingSwitchTypeEnum.IsKyc: {
					await switchIsKyc({ custId, status: checked ? 1 : 0 }).unwrap()
					break
				}
				case SettingSwitchTypeEnum.Risk: {
					await switchRisk({
						custId,
						status: checked ? 1 : 0,
					}).unwrap()
					break
				}
				case SettingSwitchTypeEnum.PhoneVerified: {
					await switchPhoneVerified({
						custId,
						status: checked ? 1 : 0,
					}).unwrap()
					break
				}
				case SettingSwitchTypeEnum.EmailVerified: {
					await switchEmailVerified({
						custId,
						status: checked ? 1 : 0,
					}).unwrap()
					break
				}
				case SettingSwitchTypeEnum.RebatePayout: {
					await switchRebatePayout({
						custId,
						status: checked ? 1 : 0,
					}).unwrap()
					break
				}
				default:
					break
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSwitchPromotionWhiteList = async (
		newSwitchType: SettingCustPromotionWitheListEnum,
		checkedIp: boolean,
		checkedDevice: boolean,
		checkedRealName: boolean
	) => {
		try {
			switch (newSwitchType) {
				case SettingCustPromotionWitheListEnum.ipEnable: {
					await editCustPromotionWhiteList({
						custId,
						ipEnable: checkedIp,
						deviceEnable: checkedDevice,
						realNameEnable: checkedRealName,
					}).unwrap()
					break
				}
				case SettingCustPromotionWitheListEnum.deviceEnable: {
					await editCustPromotionWhiteList({
						custId,
						ipEnable: checkedIp,
						deviceEnable: checkedDevice,
						realNameEnable: checkedRealName,
					}).unwrap()
					break
				}
				case SettingCustPromotionWitheListEnum.realNameEnable: {
					await editCustPromotionWhiteList({
						custId,
						ipEnable: checkedIp,
						deviceEnable: checkedDevice,
						realNameEnable: checkedRealName,
					}).unwrap()
					break
				}

				default:
					break
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleEditModalSubmit = async () => {
		const { fullName, email, phoneNo, birthDay, address, reason } =
			form.getFieldsValue()

		try {
			switch (editType) {
				case SettingEditTypeEnum.FullName:
					await editFullName({ custId, fullName }).unwrap()
					break
				case SettingEditTypeEnum.Email:
					await editEmail({ custId, email }).unwrap()
					break
				case SettingEditTypeEnum.PhoneNo:
					await editPhoneNo({ custId, phoneNo }).unwrap()
					break
				case SettingEditTypeEnum.Birthday: {
					const payload = {
						custId,
						birthYear: moment(birthDay).get('year'),
						birthMonth: moment(birthDay).get('month') + 1,
						birthDate: moment(birthDay).get('date'),
					}
					await editBirthday(payload).unwrap()
					break
				}
				case SettingEditTypeEnum.Address: {
					const { country, state, postCode, city, line1, line2 } = address ?? {}
					await editAddress({
						custId,
						country,
						state,
						postCode,
						city,
						line1,
						line2,
					}).unwrap()
					break
				}
				case SettingEditTypeEnum.LockAccount: {
					await lockAccount({
						custId,
						status: LockAccountTypeEnum.Suspend,
						reason,
					}).unwrap()
					break
				}
				case SettingEditTypeEnum.UnLockAccount: {
					await lockAccount({
						custId,
						status: LockAccountTypeEnum.Running,
						reason,
					}).unwrap()
					break
				}
				case SettingEditTypeEnum.CloseAccount: {
					await closeAccount({ custId, reason }).unwrap()
					break
				}
				case SettingEditTypeEnum.KickOutUser: {
					await kickOutUser({ custId, reason }).unwrap()
					break
				}
				default:
					break
			}
			editModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleResetPassword = async () => {
		try {
			const { data: newPassword } = await resetPassword({ custId }).unwrap()
			const key = uniqueId()
			const btn = (
				<Button
					type='primary'
					size='small'
					onClick={() => {
						copy(newPassword)
					}}
				>
					{t('Label_Copy')}
				</Button>
			)
			notification.open({
				key,
				message: t('ChangePassword.Label_NewPassword'),
				// * duration: null => 只能手動關閉
				duration: null,
				description: (
					<Typography.Text type='success'>{newPassword}</Typography.Text>
				),
				btn,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleResetBankInfo = async () => {
		try {
			await resetBankInfo({ custId }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleResetCryptoInfo = async () => {
		try {
			await resetCryptoInfo({ custId }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleResetEWallet = async () => {
		try {
			await resetEWallet({ custId }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetPayoutVerificationReward = async (
		OTPType: PayoutVerificationRewardOTPTypeEnum
	) => {
		try {
			const payload = {
				custId,
				OTPType,
			}
			const response = await setPayoutVerificationReward(payload).unwrap()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const isEditModalLoading =
		isEditFullNameLoading ||
		isEditEmailLoading ||
		isEditPhoneNoLoading ||
		isEditBirthdayLoading ||
		isEditAddressLoading ||
		isLockAccountLoading ||
		isCloseAccountLoading ||
		isKickOutUserLoading

	const isEditModalOpen = editModal.visible && Boolean(editType)

	useEffect(() => {
		if ((!isGetCustBasicInfoLoading || !isEditModalOpen) && custBasicInfo) {
			const {
				accountName,
				email,
				mobileNumber,
				birthDay: birthDate = '',
				birthMonth = '',
				birthYear = '',
				address: originAddress,
			} = custBasicInfo

			// * ex: '(+60) 7997979979' => ['(+60)', '7997979979'] => '7997979979'
			const phoneNo = mobileNumber.split(' ')[1] || ''

			const isBirthday =
				Number(birthYear) && Number(birthMonth) && Number(birthDate)
			const birthDay = isBirthday
				? moment()
						.set('year', Number(birthYear))
						// * gets or sets the month accepts numbers from 0 to 11
						// * birthMonth return numbers from 1 to 12,
						.set('month', Number(birthMonth) - 1)
						.set('date', Number(birthDate))
				: moment()

			const [
				line2 = '',
				line1 = '',
				city = '',
				postCode = '',
				state = '',
				country = '',
			] = originAddress.split(',')
			const address = { line2, line1, city, postCode, state, country }

			form.setFieldsValue({
				fullName: accountName,
				email: email || '',
				phoneNo,
				birthDay,
				address,
			})
		}
	}, [isGetCustBasicInfoLoading, isEditModalOpen])

	const { tagList = [] } = custBasicInfo ?? {}
	return (
		<>
			<LayoutContent.Title title='Setting' />

			<LayoutContent.Card style={{ marginTop: -20 }}>
				<Row gutter={16} justify='start'>
					<SettingInfoCard
						infoPermissions={infoPermissions}
						onEditTypeChange={onEditTypeChange}
						openTagsModal={tagsModal.onOpen}
						openVipLevelModal={vipLevelModal.onOpen}
					/>

					<SettingRiskCard
						riskPermissions={riskPermissions}
						custId={custId}
						custBasicInfo={custBasicInfo ?? {}}
						isSwitchIsKycLoading={isSwitchIsKycLoading}
						isSwitchRiskLoading={isSwitchRiskLoading}
						isSwitchPhoneVerifiedLoading={isSwitchPhoneVerifiedLoading}
						isSwitchEmailVerifiedLoading={isSwitchEmailVerifiedLoading}
						onEditTypeChange={onEditTypeChange}
						onSwitch={handleSwitch}
						onResetPassword={handleResetPassword}
					/>

					<SettingFinanceCard
						financePermissions={financePermissions}
						userName={custBasicInfo?.userName}
						onResetBankInfo={handleResetBankInfo}
						onResetEWallet={handleResetEWallet}
						onResetCryptoInfo={handleResetCryptoInfo}
					/>

					<SettingMarketingCard
						marketingPermissions={marketingPermissions}
						custBasicInfo={custBasicInfo ?? {}}
						custPromotionWhiteData={custPromotionWhiteData ?? {}}
						isSwitchRebatePayoutLoading={isSwitchRebatePayoutLoading}
						onSwitch={handleSwitch}
						onSwitchPromotionWhiteList={handleSwitchPromotionWhiteList}
						onSetPayoutVerificationReward={handleSetPayoutVerificationReward}
					/>

					<SettingGameCard />
				</Row>
			</LayoutContent.Card>

			<SettingEditModal
				isEditModalLoading={isEditModalLoading}
				isEditModalOpen={isEditModalOpen}
				editType={editType}
				editModal={editModal}
				form={form}
				onEditModalSubmit={handleEditModalSubmit}
			/>

			<SettingTagsModal
				custId={custId}
				tagsModal={tagsModal}
				tagList={tagList}
			/>

			<SettingVipLevelModal custId={custId} vipLevelModal={vipLevelModal} />
		</>
	)
}

export default Setting

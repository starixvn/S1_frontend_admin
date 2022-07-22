import { FC, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import {
	useGetVerificationRewardQuery,
	useSetVerificationRewardMutation,
	useSetVerificationStatusMutation,
} from 'features/verificationManagement/api'
import {
	IGetVerificationRewardData,
	IGetVerificationRewardResponse,
	IVerificationRewardSettingArgs,
} from 'features/verificationManagement/type'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useAuth } from 'common/hooks'
import { Form, message } from 'antd'
import { VerificationManagementTable } from 'features/verificationManagement/VerificationManagementTable'
import { useTranslation } from 'react-i18next'

const VerificationManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const [editingCurrencyId, setEditingCurrencyId] = useState<
		number | undefined
	>()

	const {
		data: {
			data: verificationRewardData,
		} = {} as IGetVerificationRewardResponse,
		isFetching: isGetVerificationRewardFetching,
	} = useGetVerificationRewardQuery({ siteId })

	const [setVerificationStatus, { isLoading: isSetStatusLoading }] =
		useSetVerificationStatusMutation()

	const [setVerificationReward, { isLoading: isSetVerificationRewardLoading }] =
		useSetVerificationRewardMutation()

	const handleSaved = async (record: IGetVerificationRewardData) => {
		const { phoneReward, emailReward, verificationType } =
			await form.validateFields()

		const {
			currencyId,
			phoneReward: phoneRewardBefore,
			emailReward: emailRewardBefore,
			verificationType: verificationTypeBefore,
		} = record

		const after: IVerificationRewardSettingArgs = {
			phoneReward,
			emailReward,
			verificationType,
		}
		const before: IVerificationRewardSettingArgs = {
			phoneReward: phoneRewardBefore,
			emailReward: emailRewardBefore,
			verificationType: verificationTypeBefore,
		}

		try {
			await setVerificationReward({
				siteId,
				currencyId,
				before,
				after,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setEditingCurrencyId(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSwitchStatus = async (
		currencyId: number,
		before: number,
		after: number
	) => {
		try {
			await setVerificationStatus({
				siteId,
				currencyId,
				before: { status: before },
				after: { status: after },
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isSetStatusLoading ||
		isGetVerificationRewardFetching ||
		isSetVerificationRewardLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<VerificationManagementTable
				form={form}
				loading={loading}
				verificationRewardData={verificationRewardData}
				onSaved={handleSaved}
				setEditingKey={setEditingCurrencyId}
				editingKey={editingCurrencyId}
				onSwitchStatus={handleSwitchStatus}
				editPermission={editPermission}
			/>
		</LayoutContent.Main>
	)
}

export default VerificationManagement

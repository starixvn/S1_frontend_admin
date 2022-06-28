import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { isEqual } from 'lodash'
import { Form, message, Spin } from 'antd'
import { useAppSelector } from 'app/store'
import { useAuth } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { selectUserSite } from 'common/enum'
import {
	useGetInactivePointExpirySettingQuery,
	useSetInactivePointExpirySettingMutation,
} from './api'
import InactivePointExpiryForm from './InactivePointExpiryForm'

const InactivePointExpiry: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const [componentDisabled, setComponentDisabled] = useState<boolean>(true)
	const toggleDisabled = () => setComponentDisabled(prev => !prev)
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const {
		data: { data: inactivePointExpirySetting } = {},
		isFetching: isGetInactivePointExpirySettingFetching,
	} = useGetInactivePointExpirySettingQuery({
		siteId,
	})

	const [
		setInactivePointExpirySetting,
		{ isLoading: isSetInactivePointExpirySettingLoading },
	] = useSetInactivePointExpirySettingMutation()

	const handleSetInactivePointExpirySetting = async () => {
		const isValidate = await form.validateFields()
		if (!isValidate) {
			return
		}
		const { days, status }: { days: number; status: number } =
			form.getFieldsValue()
		const isFormEqual = isEqual(
			{ days, status },
			{
				days: inactivePointExpirySetting?.days,
				status: Boolean(inactivePointExpirySetting?.status),
			}
		)
		try {
			if (!isFormEqual) {
				await setInactivePointExpirySetting({
					siteId,
					days: days >= 0 ? days : 0,
					status,
				}).unwrap()
			}

			toggleDisabled()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (isGetInactivePointExpirySettingFetching === false) {
			const { days, status } = inactivePointExpirySetting ?? {}
			form.setFieldsValue({
				days,
				status: Boolean(status),
			})
		}
	}, [isGetInactivePointExpirySettingFetching])

	const loading =
		isGetInactivePointExpirySettingFetching ||
		isSetInactivePointExpirySettingLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<Spin spinning={loading}>
				<InactivePointExpiryForm
					form={form}
					componentDisabled={componentDisabled}
					onSetInactivePointExpirySetting={handleSetInactivePointExpirySetting}
				/>
			</Spin>

			<AffixButtons>
				{componentDisabled ? (
					<AffixButtons.Edit
						disabled={!editPermission?.canUse}
						loading={loading}
						onClick={toggleDisabled}
					/>
				) : (
					<AffixButtons.Saved
						loading={loading}
						onClick={handleSetInactivePointExpirySetting}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default InactivePointExpiry

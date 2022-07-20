import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useAuth } from 'common/hooks'
import { SpecialPasswordManagementForm } from 'features/specialPasswordManagement/SpecialPasswordManagementForm'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import {
	useGetPasswordQuery,
	useSetPasswordMutation,
} from 'features/specialPasswordManagement/api'
import { IGetSpecialPasswordResponse } from 'features/specialPasswordManagement/type'
import { useTranslation } from 'react-i18next'

const SpecialPasswordManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const [editing, setEditing] = useState(false)

	const {
		data: { data: passwordData } = {} as IGetSpecialPasswordResponse,
		isFetching: isGetPasswordLoading,
	} = useGetPasswordQuery({ siteId })

	const [setPassword, { isLoading: isSetPasswordLoading }] =
		useSetPasswordMutation()

	const handleSetPassword = async () => {
		const { password } = await form.validateFields()
		try {
			await setPassword({
				siteId,
				password,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setEditing(false)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isGetPasswordLoading && passwordData) {
			const { password } = passwordData
			form.setFieldsValue({
				password,
			})
		}
	}, [isGetPasswordLoading])

	const loading = isGetPasswordLoading || isSetPasswordLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<SpecialPasswordManagementForm
				form={form}
				editing={editing}
				loading={loading}
			/>
			<AffixButtons>
				{editing ? (
					<AffixButtons.Saved
						loading={isSetPasswordLoading}
						onClick={handleSetPassword}
					/>
				) : (
					<AffixButtons.Edit
						disabled={!editPermission?.canUse}
						onClick={() => setEditing(true)}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default SpecialPasswordManagement

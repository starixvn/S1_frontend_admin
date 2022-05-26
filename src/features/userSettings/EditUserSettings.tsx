import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { getPermissionList } from 'common/permissionForm/utils'
import { Form, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import paths from 'app/constants/paths'
import { AffixButtons } from 'components/AffixButtons'
import { usePermissionForm } from 'common/permissionForm'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import {
	useLazyGetUpdateAdminUserQuery,
	useLazyGetOriginAdminPermissionListByRoleQuery,
	useUpdateAdminUserMutation,
} from './api'
import UserSettingsForm from './UserSettingsForm'
import { AdminUserInterface, AdminUserPermissionInterface } from './type'

const EditUserSettings = () => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const navigate = useNavigate()
	const userSite = useAppSelector(selectUserSite)
	const { userId } = useParams()
	const [form] = Form.useForm()

	const [adminPermissionList, setAdminPermissionList] = useState<
		AdminUserPermissionInterface[]
	>([])

	const {
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	} = usePermissionForm(form)

	const [
		getUpdateAdminUser,
		{
			data: {
				data: updateAdminUserData,
			} = {} as IAxiosResponse<AdminUserInterface>,
			isLoading: isGetUpdateAdminUserLoading,
		},
	] = useLazyGetUpdateAdminUserQuery()

	const [getOriginAdminPermissionListByRole] =
		useLazyGetOriginAdminPermissionListByRoleQuery()

	const [updateAdminUser, { isLoading: isUpdateAdminUserLoading }] =
		useUpdateAdminUserMutation()

	const handleUpdate = async () => {
		await form.validateFields()

		const { userName, password, currencyList, role } = form.getFieldsValue()

		try {
			await updateAdminUser({
				siteId: userSite?.siteId,
				userId: Number(userId),
				userName,
				password,
				role,
				currencyList,
				permission: permissionList.filter(
					permission => permission.permissionIdList.length > 0
				),
			}).unwrap()

			navigate(
				`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.userSetting.root}`
			)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handlePermissionListChange = (permission: any) => {
		if (permission && permission?.length > 0) {
			const newPermissionList = getPermissionList(permission)

			setPermissionList(newPermissionList)
		}
	}

	const handleRoleChange = async (role: number | null) => {
		if (role) {
			const { data: newOriginAdminPermissionList } =
				await getOriginAdminPermissionListByRole({
					role,
					siteId: userSite?.siteId,
				})

			const newOriginPermissionList = getPermissionList(
				newOriginAdminPermissionList ?? []
			)

			setAdminPermissionList(newOriginAdminPermissionList ?? [])
			setPermissionList(newOriginPermissionList)
		} else {
			setPermissionList([])
		}
	}

	useEffect(() => {
		const init = async () => {
			const {
				data: {
					data: newUpdateAdminUserData,
				} = {} as IAxiosResponse<AdminUserInterface>,
			} = await getUpdateAdminUser({
				userId: Number(userId),
				siteId: userSite?.siteId,
			})

			const { userName, password, selectCurrencyList, role, permission } =
				newUpdateAdminUserData ?? {}

			form.setFieldsValue({
				userName,
				password,
				currencyList: selectCurrencyList,
				role,
			})

			setAdminPermissionList(permission ?? [])
			handlePermissionListChange(permission)
		}

		init()
	}, [userId])

	if (!editPermission?.canUse) return <Navigate to='/403' />

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_EditUser')} />

			<UserSettingsForm
				loading={isGetUpdateAdminUserLoading}
				form={form}
				permissionList={permissionList}
				roleCurrencyList={updateAdminUserData?.currencyList ?? []}
				originAdminPermissionList={adminPermissionList ?? []}
				onPermissionChange={handlePermissionChange}
				onCheckAllPermission={handleCheckAllPermission}
				onRoleChange={handleRoleChange}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					loading={isUpdateAdminUserLoading}
					onClick={handleUpdate}
				/>

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditUserSettings

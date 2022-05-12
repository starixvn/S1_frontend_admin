import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { useNavigate } from 'react-router-dom'
import { Form, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { selectUserSite } from 'common/enum'
import { usePermissionForm } from 'common/permissionForm'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { getPermissionList } from 'common/permissionForm/utils'
import {
	useAddAdminUserMutation,
	useGetAddAdminUserCurrencyQuery,
	useLazyGetOriginAdminPermissionListByRoleQuery,
} from './api'
import UserSettingsForm from './UserSettingsForm'

const AddUserSettings: FC = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const userSite = useAppSelector(selectUserSite)

	const [form] = Form.useForm()

	const {
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	} = usePermissionForm(form)

	const {
		data: { data: roleCurrencyList } = {} as IAxiosResponse<any[]>,
		isFetching: isAddAdminUserCurrencyFetching,
	} = useGetAddAdminUserCurrencyQuery({
		siteId: userSite?.siteId,
	})

	const [
		getOriginAdminPermissionListByRole,
		{ data: originAdminPermissionList },
	] = useLazyGetOriginAdminPermissionListByRoleQuery()

	const [addAdminUser, { isLoading: isAddAdminUserLoading }] =
		useAddAdminUserMutation()

	const handleCreate = async () => {
		await form.validateFields()

		const { userName, password, currencyList, role } = form.getFieldsValue()

		try {
			await addAdminUser({
				siteId: userSite?.siteId,
				userName,
				password,
				role,
				currencyList,
				permission: permissionList,
			})

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

			setPermissionList(newOriginPermissionList)
		} else {
			setPermissionList([])
		}
	}

	return (
		<main>
			<LayoutContent.Title title={t('Label_AddUser')} />

			<UserSettingsForm
				loading={isAddAdminUserCurrencyFetching}
				form={form}
				permissionList={permissionList}
				roleCurrencyList={roleCurrencyList ?? []}
				originAdminPermissionList={originAdminPermissionList ?? []}
				onPermissionChange={handlePermissionChange}
				onCheckAllPermission={handleCheckAllPermission}
				onRoleChange={handleRoleChange}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					loading={isAddAdminUserLoading}
					onClick={handleCreate}
				/>

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</main>
	)
}

export default AddUserSettings

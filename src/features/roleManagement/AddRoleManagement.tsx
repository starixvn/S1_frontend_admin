import { message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppDispatch, useAppSelector } from 'app/store'
import { AffixButtons } from 'components/AffixButtons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RoleManagementForm, useRoleManagementForm } from './RoleManagementForm'
import { selectRoleManagementStatus } from './slice'
import {
	fetchPermissionAddRolePermissionAsync,
	fetchPermissionGetAddRolePermissionAsync,
	fetchPermissionGetRoleListAsync,
} from './thunk'

export interface FormPermissionInterface {
	displayKey: number
	permissionIdList: number[]
}

const AddRoleManagement = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const roleManagementStatus = useAppSelector(selectRoleManagementStatus)

	const {
		form,
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	} = useRoleManagementForm()

	const handleCreate = async () => {
		const isValid = await form.validateFields()

		if (!isValid) {
			return
		}

		const { roleName, remark, currencyList } = form.getFieldsValue()

		try {
			await dispatch(
				fetchPermissionAddRolePermissionAsync({
					name: roleName,
					mark: remark,
					currencyList,
					permission: permissionList,
				})
			).unwrap()

			form.setFieldsValue({
				roleName: undefined,
				remark: undefined,
				currencyList: [],
			})

			setPermissionList([])
			dispatch(fetchPermissionGetRoleListAsync(''))
			navigate(
				`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.roleManagement.root}`
			)

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		dispatch(fetchPermissionGetAddRolePermissionAsync())
	}, [])

	const loading = roleManagementStatus === 'pending'

	return (
		<main>
			<LayoutContent.Title title={t('Label_AddRoleManagement')} />

			<RoleManagementForm
				form={form}
				loading={loading}
				permissionList={permissionList}
				onPermissionChange={handlePermissionChange}
				onCheckAllPermission={handleCheckAllPermission}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved loading={loading} onClick={handleCreate} />

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</main>
	)
}

export default AddRoleManagement

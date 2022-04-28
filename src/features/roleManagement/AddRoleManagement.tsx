import { message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppDispatch } from 'app/store'
import { AffixButtons } from 'components/AffixButtons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RequestStatusType } from 'type'
import { RoleManagementForm, useRoleManagementForm } from './RoleManagementForm'
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
	const [requestStatus, setRequestStatus] = useState<RequestStatusType>()

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

		setRequestStatus('pending')

		try {
			await dispatch(
				fetchPermissionAddRolePermissionAsync({
					name: roleName,
					mark: remark,
					currencyList,
					permission: permissionList,
				})
			)
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
		} finally {
			setRequestStatus('idle')
		}
	}

	useEffect(() => {
		dispatch(fetchPermissionGetAddRolePermissionAsync())
	}, [])

	return (
		<main>
			<LayoutContent.Title title={t('Label_AddRoleManagement')} />

			<RoleManagementForm
				form={form}
				permissionList={permissionList}
				onPermissionChange={handlePermissionChange}
				onCheckAllPermission={handleCheckAllPermission}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					loading={requestStatus === 'pending'}
					onClick={handleCreate}
				/>

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</main>
	)
}

export default AddRoleManagement

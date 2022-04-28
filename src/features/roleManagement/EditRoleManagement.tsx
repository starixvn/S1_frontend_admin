import { message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import _ from 'lodash'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'app/store'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { RequestStatusType } from 'type'

import { RoleManagementForm, useRoleManagementForm } from './RoleManagementForm'
import { selectRoleManagementStatus, selectRolePermission } from './slice'
import {
	fetchPermissionGetRoleListAsync,
	fetchPermissionGetUpdateRolePermissionAsync,
} from './thunk'
import { updateRolePermission } from './api'
import { FormPermissionInterface } from './AddRoleManagement'

const getPermissionList = (
	permissionList: any[]
): {
	displayKey: number
	permissionIdList: number[]
}[] => {
	const newPermissionList: FormPermissionInterface[] = []

	const mapGroupPermission = (functionDatas: any[], subLayerDatas: any[]) => {
		if (functionDatas?.length) {
			functionDatas.map(functionData => makePermission(functionData))
		}
		if (subLayerDatas?.length) {
			subLayerDatas.map(subLayerData => makePermission(subLayerData))
		}
	}

	const makePermission = (permission: any) => {
		const {
			moduleId,
			settings,
			disPlayKey: displayKey,
			functionDatas,
			subLayerDatas,
		} = permission

		const isGroup = Boolean(moduleId)

		if (isGroup) {
			mapGroupPermission(functionDatas, subLayerDatas)

			return
		}

		const permissionIdList: number[] = _.map(
			_.filter(settings, { canUse: true }),
			({ permissionId }) => permissionId
		)

		newPermissionList.push({
			displayKey,
			permissionIdList,
		})
	}

	permissionList.forEach(permission => makePermission(permission))

	return newPermissionList
}

const EditRoleManagement = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const params = useParams()
	const [requestStatus, setRequestStatus] = useState<RequestStatusType>()

	const {
		form,
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	} = useRoleManagementForm()

	const roleManagementStatus = useAppSelector(selectRoleManagementStatus)
	const rolePermission = useAppSelector(selectRolePermission)

	const handleUpdate = async () => {
		const isValid = await form.validateFields()

		if (!isValid) {
			return
		}

		const { roleName, remark, currencyList } = form.getFieldsValue()

		setRequestStatus('pending')

		try {
			await updateRolePermission({
				name: roleName,
				mark: remark,
				role: Number(params.roleId),
				currencyList,
				permission: permissionList,
			})

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
		dispatch(
			fetchPermissionGetUpdateRolePermissionAsync(Number(params?.roleId))
		)
	}, [])

	useEffect(() => {
		if (roleManagementStatus === 'succeeded') {
			form.setFieldsValue({
				roleName: rolePermission.name,
				remark: rolePermission.mark,
				currencyList: rolePermission.selectCurrencyList,
			})

			if (rolePermission.permission.length > 0) {
				const newPermissionList = getPermissionList(rolePermission.permission)
				setPermissionList(newPermissionList)
			}
		}
	}, [roleManagementStatus])

	return (
		<main>
			<LayoutContent.Title title={t('Label_EditRoleManagement')} />

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
					onClick={handleUpdate}
				/>

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</main>
	)
}

export default EditRoleManagement

import { filter, map } from 'lodash'
import { message } from 'antd'
import { useEffect } from 'react'
import { selectUserSite } from 'common/enum'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { useAuth } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { RoleManagementForm } from './RoleManagementForm'
import { selectRoleManagementStatus, selectRolePermission } from './slice'
import {
	fetchPermissionGetRoleListAsync,
	fetchPermissionGetUpdateRolePermissionAsync,
} from './thunk'
import { updateRolePermission } from './api'
import { FormPermissionInterface } from './type'
import { useRoleManagementForm } from './hooks'

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

		const permissionIdList: number[] = map(
			filter(settings, { canUse: true }),
			({ permissionId }) => permissionId
		)

		if (permissionIdList.length > 0) {
			newPermissionList.push({
				displayKey,
				permissionIdList,
			})
		}
	}

	permissionList.forEach(permission => makePermission(permission))

	return newPermissionList
}

const EditRoleManagement = () => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const userSite = useAppSelector(selectUserSite)
	const params = useParams()

	const roleManagementStatus = useAppSelector(selectRoleManagementStatus)

	const {
		form,
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	} = useRoleManagementForm()

	const rolePermission = useAppSelector(selectRolePermission)

	const handleUpdate = async () => {
		const isValid = await form.validateFields()

		if (!isValid) {
			return
		}

		if (permissionList.length <= 0) {
			message.warning(
				t('Label_Required', {
					key: t('Label_Permission'),
				})
			)
			return
		}

		const { roleName, remark, currencyList } = form.getFieldsValue()

		try {
			await updateRolePermission({
				name: roleName,
				mark: remark,
				role: Number(params.roleId),
				currencyList,
				permission: permissionList.filter(
					permission => permission.permissionIdList.length > 0
				),
				siteId: userSite?.siteId,
			})

			await dispatch(
				fetchPermissionGetRoleListAsync({
					roleName: '',
					siteId: userSite?.siteId,
				})
			)
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
		dispatch(
			fetchPermissionGetUpdateRolePermissionAsync({
				role: Number(params?.roleId),
				siteId: userSite?.siteId,
			})
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

	const loading = roleManagementStatus === 'pending'

	if (!editPermission?.canUse) return <Navigate to='/403' />

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_EditRoleManagement')} />

			<RoleManagementForm
				form={form}
				loading={loading}
				permissionList={permissionList}
				onPermissionChange={handlePermissionChange}
				onCheckAllPermission={handleCheckAllPermission}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved loading={loading} onClick={handleUpdate} />

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditRoleManagement

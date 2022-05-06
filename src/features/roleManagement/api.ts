import BoApi from 'common/service/Api'
import {
	AddRolePermissionInterface,
	RoleManagementInterface,
	RolePermissionInterface,
	UpdateRolePermissionInterface,
} from './type'

export const fetchPermissionGetRoleList = async ({
	roleName,
	siteId,
}: {
	roleName: string
	siteId?: number
}): Promise<RoleManagementInterface[]> => {
	const response = await BoApi.post('Permission/GetRoleList', {
		roleName,
		siteId,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return response?.data?.data ?? []
}

export const fetchPermissionGetAddRolePermission = async ({
	siteId,
}: {
	siteId?: number
}) => {
	const response = await BoApi.post('Permission/GetAddRolePermission', {
		siteId,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return response?.data?.data
}

export const fetchPermissionAddRolePermission = async ({
	name = '',
	mark = '',
	currencyList = [],
	permission = [],
	siteId,
}: AddRolePermissionInterface) => {
	const response = await BoApi.post('Permission/AddRolePermission', {
		name,
		mark,
		currencyList,
		permission,
		siteId,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}
}

export const fetchPermissionDeleteRolePermission = async ({
	role,
	siteId,
}: {
	role: number
	siteId?: number
}) => {
	const response = await BoApi.post('Permission/DeleteRolePermission', {
		role,
		siteId,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return role
}

export const fetchPermissionGetUpdateRolePermission = async ({
	role,
	siteId,
}: {
	role: number
	siteId?: number
}): Promise<RolePermissionInterface> => {
	const response = await BoApi.post('Permission/GetUpdateRolePermission', {
		role,
		siteId,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return response?.data?.data
}

export const updateRolePermission = async ({
	name = '',
	mark = '',
	role,
	currencyList = [],
	permission = [],
	siteId,
}: UpdateRolePermissionInterface) => {
	const response = await BoApi.post('Permission/UpdateRolePermission', {
		name,
		mark,
		role,
		currencyList,
		permission,
		siteId,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}
}

import BoApi from 'common/service/Api'
import {
	AddRolePermissionInterface,
	RoleManagementInterface,
	RolePermissionInterface,
	UpdateRolePermissionInterface,
} from './type'

export const fetchPermissionGetRoleList = async (
	roleName: string
): Promise<RoleManagementInterface[]> => {
	const response = await BoApi.post('Permission/GetRoleList', {
		RoleName: roleName,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return response?.data?.data ?? []
}

export const fetchPermissionGetAllRolePermission = async () => {
	const response = await BoApi.post('Permission/GetAllRolePermission')

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
}: AddRolePermissionInterface) => {
	const response = await BoApi.post('Permission/AddRolePermission', {
		name,
		mark,
		currencyList,
		permission,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}
}

export const fetchPermissionDeleteRolePermission = async (role: number) => {
	const response = await BoApi.post('Permission/DeleteRolePermission', {
		role,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return role
}

export const fetchPermissionGetRolePermission = async (
	role: number
): Promise<RolePermissionInterface> => {
	const response = await BoApi.post('Permission/GetRolePermission', {
		role,
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
}: UpdateRolePermissionInterface) => {
	const response = await BoApi.post('Permission/UpdateRolePermission', {
		name,
		mark,
		role,
		currencyList,
		permission,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}
}

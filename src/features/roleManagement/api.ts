import BoApi from 'common/service/Api'
import { roleManagementInterface } from './type'

export const fetchPermissionGetRoleList = async (roleName: string) => {
	const response = await BoApi.post('Permission/GetRoleList', {
		RoleName: roleName,
	})

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return (response?.data?.data as roleManagementInterface[]) ?? []
}

export const fetchPermissionGetAllRolePermission = async () => {
	const response = await BoApi.post('Permission/GetAllRolePermission')

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return response?.data?.data
}

export interface AddRolePermissionInterface {
	name: string
	mark: string
	currencyList: number[]
	permission: any[]
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

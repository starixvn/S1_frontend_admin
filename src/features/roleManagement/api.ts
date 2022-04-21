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

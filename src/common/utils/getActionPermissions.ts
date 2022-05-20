import { ACTION_NAMES } from 'app/constants/actionNames'
import { ActionPermissions, PermissionInterface } from 'type'

interface FunctionPermission {
	permissionId?: number
	canUse?: boolean
	name?: string
}

export const getActionPermissions = (
	permission: PermissionInterface[]
): ActionPermissions => {
	const actionPermissions = permission?.reduce((acc, cur) => {
		const { permissionId } = cur

		const newPermission: FunctionPermission = {
			[ACTION_NAMES[permissionId]]: cur,
		}

		return { ...acc, ...newPermission }
	}, {})

	return actionPermissions as ActionPermissions
}

import { filter, map } from 'lodash'
import { FormPermissionInterface } from 'type'

export const getPermissionList = (
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

		newPermissionList.push({
			displayKey,
			permissionIdList,
		})
	}

	permissionList.forEach(permission => makePermission(permission))

	return newPermissionList
}

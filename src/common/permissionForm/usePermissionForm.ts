import { FormInstance } from 'antd'
import { cloneDeep, filter, includes } from 'lodash'
import { useState } from 'react'
import { PermissionInterface } from 'type'

interface FormPermission {
	displayKey: number
	permissionIdList: number[]
}

const usePermissionForm = (form: FormInstance) => {
	const [permissionList, setPermissionList] = useState<FormPermission[]>([])

	const handlePermissionChange = ({
		displayKey,
		permissionId,
	}: {
		displayKey: number
		permissionId: number
	}) => {
		const newPermissionList = cloneDeep(permissionList)
		const currentIndex = newPermissionList?.findIndex(
			permission => permission.displayKey === displayKey
		)

		if (currentIndex === -1) {
			setPermissionList([
				...newPermissionList,
				{
					displayKey,
					permissionIdList: [permissionId],
				},
			])
		} else {
			const originPermissionIdList =
				newPermissionList[currentIndex].permissionIdList
			let newPermissionIdList = []

			if (includes(originPermissionIdList, permissionId)) {
				newPermissionIdList = filter(
					originPermissionIdList,
					mapPermissionId => mapPermissionId !== permissionId
				)
			} else {
				newPermissionIdList = [...originPermissionIdList, permissionId]
			}

			newPermissionList[currentIndex] = {
				displayKey,
				permissionIdList: newPermissionIdList,
			}

			setPermissionList(newPermissionList)
		}
	}

	const handleCheckAllPermission = (
		displayKey: number,
		settings: PermissionInterface[]
	) => {
		const newPermissionList = cloneDeep(permissionList)
		const currentIndex = newPermissionList?.findIndex(
			permission => permission.displayKey === displayKey
		)

		const originPermissionIds = settings
			.map(({ permissionId, enable, canUse }) =>
				!enable ?? canUse ? permissionId : null
			)
			.filter(Boolean) as number[]

		const allPermissionIds: number[] = settings.map(
			(setting: any) => setting.permissionId
		)

		const currentPermissionIdList =
			newPermissionList[currentIndex].permissionIdList

		newPermissionList[currentIndex] = {
			displayKey,
			permissionIdList:
				currentPermissionIdList.length === originPermissionIds.length
					? allPermissionIds
					: originPermissionIds,
		}

		setPermissionList(newPermissionList)
	}

	return {
		form,
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	}
}

export { usePermissionForm }

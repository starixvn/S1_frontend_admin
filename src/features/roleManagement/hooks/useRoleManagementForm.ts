import { Form } from 'antd'
import _ from 'lodash'
import { useState } from 'react'
import { FormPermissionInterface } from '../type'

export const useRoleManagementForm = () => {
	const [form] = Form.useForm()

	const [permissionList, setPermissionList] = useState<
		FormPermissionInterface[]
	>([])

	const handlePermissionChange = ({
		displayKey,
		permissionId,
	}: {
		displayKey: number
		permissionId: number
	}) => {
		const newPermissionList = _.cloneDeep(permissionList)
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

			if (_.includes(originPermissionIdList, permissionId)) {
				newPermissionIdList = _.filter(
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

	const handleCheckAllPermission = (displayKey: number, settings: any[]) => {
		const newPermissionList = _.cloneDeep(permissionList)
		const currentIndex = newPermissionList?.findIndex(
			permission => permission.displayKey === displayKey
		)

		const allPermissionIds: number[] = settings.map(
			(setting: any) => setting.permissionId
		)

		if (currentIndex === -1) {
			setPermissionList([
				...newPermissionList,
				{
					displayKey,
					permissionIdList: allPermissionIds,
				},
			])
		} else {
			const originPermissionIdList =
				newPermissionList[currentIndex].permissionIdList

			newPermissionList[currentIndex] = {
				displayKey,
				permissionIdList:
					originPermissionIdList.length === 0 ? allPermissionIds : [],
			}

			setPermissionList(newPermissionList)
		}
	}

	return {
		form,
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	}
}

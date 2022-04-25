import { Form, message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppDispatch } from 'app/store'
import { AffixButtons } from 'components/AffixButtons'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RequestStatusType } from 'type'
import { RoleManagementForm } from './RoleManagementForm'
import {
	fetchPermissionAddRolePermissionAsync,
	fetchPermissionGetRoleListAsync,
} from './thunk'

export interface FormPermissionInterface {
	displayKey: number
	permissionIdList: number[]
}

const AddRoleManagement = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [requestStatus, setRequestStatus] = useState<RequestStatusType>()
	const [form] = Form.useForm()
	const [permissionList, setPermissionList] = useState<
		FormPermissionInterface[]
	>([])

	const handleCreate = async () => {
		const isValid = await form.validateFields()

		if (!isValid) {
			return
		}

		const { roleName, remark, currencyList } = form.getFieldsValue()

		setRequestStatus('pending')

		try {
			await dispatch(
				fetchPermissionAddRolePermissionAsync({
					name: roleName,
					mark: remark,
					currencyList,
					permission: permissionList,
				})
			)
			form.setFieldsValue({
				roleName: undefined,
				remark: undefined,
				currencyList: [],
			})

			setPermissionList([])
			dispatch(fetchPermissionGetRoleListAsync(''))
			navigate(
				`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.roleManagement.root}`
			)

			message.success(t('Label_AddRoleSuccess'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		} finally {
			setRequestStatus('idle')
		}
	}

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

	return (
		<main>
			<LayoutContent.Title title={t('Label_AddRoleManagement')} />

			<RoleManagementForm
				form={form}
				permissionList={permissionList}
				onPermissionChange={handlePermissionChange}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					loading={requestStatus === 'pending'}
					onClick={handleCreate}
				/>

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</main>
	)
}

export default AddRoleManagement

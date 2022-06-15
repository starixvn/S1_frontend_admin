import { Form, message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useAuth, useQueryParams } from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RoleManagementFilter } from './RoleManagementFilter'
import { RoleManagementTable } from './RoleManagementTable'
import { selectRoleManagementStatus } from './slice'
import {
	fetchPermissionDeleteRolePermissionAsync,
	fetchPermissionGetRoleListAsync,
} from './thunk'

const RoleManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const {
		actionPermissions: { addPermission, deletePermission, editPermission } = {},
	} = useAuth()

	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()

	const [form] = Form.useForm()

	const roleManagementStatus = useAppSelector(selectRoleManagementStatus)

	const handleSearch = async () => {
		const { roleName = '' } = form.getFieldsValue()

		try {
			await dispatch(
				fetchPermissionGetRoleListAsync({ roleName, siteId })
			).unwrap()

			setQueryParams({
				roleName,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDelete = async (role: number) => {
		try {
			await dispatch(
				fetchPermissionDeleteRolePermissionAsync({
					role,
					siteId,
				})
			).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = roleManagementStatus === 'pending'

	useEffect(() => {}, [])

	useEffect(() => {
		const init = async () => {
			const { roleName } = queryParams

			await dispatch(
				fetchPermissionGetRoleListAsync({
					roleName: roleName ?? '',
					siteId,
				})
			)

			form.setFieldsValue({
				roleName: roleName ?? '',
			})
		}

		init()
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<RoleManagementFilter
				loading={loading}
				form={form}
				onSearch={handleSearch}
			/>

			{roleManagementStatus !== undefined && (
				<RoleManagementTable
					deletePermission={deletePermission}
					editPermission={editPermission}
					loading={loading}
					onDelete={handleDelete}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Create
					disabled={!addPermission?.canUse}
					onClick={() =>
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.addRoleManagement.root}`
						)
					}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default RoleManagement

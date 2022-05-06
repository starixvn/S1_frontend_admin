import { Form, message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useQueryParams } from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RoleManagementFilter } from './RoleManagementFilter'
import { RoleManagementTable } from './RoleManagementTable'
import { selectRoleManagementStatus } from './slice'
import {
	fetchPermissionDeleteRolePermissionAsync,
	fetchPermissionGetRoleListAsync,
} from './thunk'

const RoleManagement = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const userSite = useAppSelector(selectUserSite)
	const [queryParams, setQueryParams] = useQueryParams()

	const [form] = Form.useForm()

	const roleManagementStatus = useAppSelector(selectRoleManagementStatus)

	const handleSearch = async () => {
		const { roleName = '' } = form.getFieldsValue()

		try {
			await dispatch(
				fetchPermissionGetRoleListAsync({ roleName, siteId: userSite?.siteId })
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
					siteId: userSite?.siteId,
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
		if (!userSite?.siteId) return

		const init = async () => {
			const { roleName } = queryParams

			await dispatch(
				fetchPermissionGetRoleListAsync({
					roleName: roleName ?? '',
					siteId: userSite?.siteId,
				})
			)

			form.setFieldsValue({
				roleName: roleName ?? '',
			})
		}

		init()
	}, [userSite?.siteId])

	return (
		<main>
			<LayoutContent.Title title={t('Label_RoleManagement')} />

			<RoleManagementFilter
				loading={loading}
				form={form}
				onSearch={handleSearch}
			/>

			{roleManagementStatus !== undefined && (
				<RoleManagementTable loading={loading} onDelete={handleDelete} />
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Create
					onClick={() =>
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.addRoleManagement.root}`
						)
					}
				/>
			</AffixButtons>
		</main>
	)
}

export default RoleManagement

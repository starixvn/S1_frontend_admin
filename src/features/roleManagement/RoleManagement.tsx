import { Form, message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppDispatch, useAppSelector } from 'app/store'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RoleManagementFilter } from './RoleManagementFilter'
import { RoleManagementTable } from './RoleManagementTable'
import { selectRoleManagementStatus } from './slice'
import { fetchPermissionGetRoleListAsync } from './thunk'

const RoleManagement = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const [form] = Form.useForm()

	const roleManagementStatus = useAppSelector(selectRoleManagementStatus)

	const handleSearch = async (formValues: any) => {
		const { roleName = '' } = formValues

		try {
			await dispatch(fetchPermissionGetRoleListAsync(roleName)).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = roleManagementStatus === 'pending'

	return (
		<main>
			<LayoutContent.Title title={t('Label_RoleManagement')} />

			<RoleManagementFilter
				loading={loading}
				form={form}
				onSearch={handleSearch}
			/>

			{roleManagementStatus !== 'idle' && <RoleManagementTable />}

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

export { RoleManagement }

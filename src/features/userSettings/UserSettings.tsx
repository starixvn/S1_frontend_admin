import { Form, message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useModal, useQueryParams } from 'common/hooks'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { AffixButtons } from 'components/AffixButtons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
	useDeleteAdminUserByUserIdMutation,
	useLazyGetUserAdminListByUserNameQuery,
	useSetAdminUserPasswordMutation,
	useSetAdminUserStatusMutation,
} from './api'
import { ADMIN_USER_STATUS } from './constants'
import { UserAdminState } from './type'
import { UpdateUserPasswordModal } from './UpdateUserPasswordModal'
import { UserSettingsFilter } from './UserSettingsFilter'
import { UserSettingsTable } from './UserSettingsTable'

const UserSettings = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const updatePasswordModal = useModal()

	const [queryParams, setQueryParams] = useQueryParams()

	const [form] = Form.useForm()

	const userSite = useAppSelector(selectUserSite)

	const [
		getUserAdminListByUserName,
		{
			data: { data: userAdminList } = {} as IAxiosResponse<UserAdminState[]>,
			isFetching: isUserAdminListFetching,
		},
	] = useLazyGetUserAdminListByUserNameQuery()

	const [deleteAdminUserByUserId] = useDeleteAdminUserByUserIdMutation()

	const [setAdminUserStatus] = useSetAdminUserStatusMutation()

	const [setAdminUserPassword, { isLoading }] =
		useSetAdminUserPasswordMutation()

	const handleSearch = async () => {
		const { userName = '' } = form.getFieldsValue()

		try {
			await getUserAdminListByUserName({
				userName,
				siteId: userSite?.siteId,
			}).unwrap()

			setQueryParams({
				userName,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDelete = async (userId: number) => {
		try {
			await deleteAdminUserByUserId({
				userId,
				siteId: userSite?.siteId,
			})

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetAdminUserStatus = async (userId: number, status: number) => {
		try {
			setAdminUserStatus({
				userId,
				siteId: userSite?.siteId,
				status:
					status === ADMIN_USER_STATUS.OPEN
						? ADMIN_USER_STATUS.CLOSE
						: ADMIN_USER_STATUS.OPEN,
			})

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdatePassword = async (newPassword: any) => {
		const userId = form.getFieldValue('userId')

		try {
			await setAdminUserPassword({
				siteId: userSite?.siteId,
				password: newPassword,
				userId,
			})

			updatePasswordModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!userSite?.siteId) return

		const init = async () => {
			const { userName = '' } = queryParams

			form.setFieldsValue({
				userName,
			})

			handleSearch()
		}

		init()
	}, [userSite?.siteId])

	const loading = isUserAdminListFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_UserSetting')} />

			<UserSettingsFilter
				loading={loading}
				form={form}
				onSearch={handleSearch}
			/>

			<UserSettingsTable
				form={form}
				loading={loading}
				userAdminList={userAdminList ?? []}
				updatePasswordModal={updatePasswordModal}
				onSetAdminUserStatus={handleSetAdminUserStatus}
				onDelete={handleDelete}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Create
					onClick={() =>
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.addUserSetting.root}`
						)
					}
				/>
			</AffixButtons>

			<UpdateUserPasswordModal
				loading={isLoading}
				visible={updatePasswordModal.visible}
				onFinish={handleUpdatePassword}
				onCancel={updatePasswordModal.onCancel}
			/>
		</LayoutContent.Main>
	)
}

export default UserSettings

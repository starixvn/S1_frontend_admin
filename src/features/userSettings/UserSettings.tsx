import { Form, message } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
	useLazyGetUserAdminListByUserNameQuery,
	useSetAdminUserPasswordMutation,
	useSetAdminUserStatusMutation,
} from './api'
import { ADMIN_USER_STATUS } from './constants'
import { UserAdminState } from './type'
import { UpdateUserPasswordModal } from './UpdateUserPasswordModal'
import { UserSettingsFilter } from './UserSettingsFilter'
import { UserSettingsTable } from './UserSettingsTable'

const UserSettings: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const {
		actionPermissions: {
			addPermission,
			changePasswordPermission,
			editPermission,
			setActivePermission,
		} = {},
	} = useAuth()

	const navigate = useNavigate()

	const updatePasswordModal = useModal()
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const [form] = Form.useForm()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const [
		getUserAdminListByUserName,
		{
			data: { data: userAdminList } = {} as IAxiosResponse<UserAdminState[]>,
			isFetching: isUserAdminListFetching,
		},
	] = useLazyGetUserAdminListByUserNameQuery()

	const [setAdminUserStatus] = useSetAdminUserStatusMutation()

	const [setAdminUserPassword, { isLoading }] =
		useSetAdminUserPasswordMutation()

	const handleSearch = async () => {
		const { userName = '' } = form.getFieldsValue()

		try {
			await getUserAdminListByUserName({ userName, siteId }).unwrap()

			setQueryParams({
				userName,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetAdminUserStatus = async (userId: number, status: number) => {
		try {
			const afterStatus =
				status === ADMIN_USER_STATUS.OPEN
					? ADMIN_USER_STATUS.CLOSE
					: ADMIN_USER_STATUS.OPEN

			await setAdminUserStatus({
				siteId,
				before: {
					userId,
					status: !afterStatus,
				},
				after: {
					userId,
					status: Boolean(afterStatus),
				},
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
				siteId,
				after: {
					userId,
					password: newPassword,
				},
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
		const init = async () => {
			const { userName = '' } = queryParams

			form.setFieldsValue({
				userName,
			})

			handleSearch()
		}

		init()
	}, [])

	const loading = isUserAdminListFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

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
				changePasswordPermission={changePasswordPermission}
				editPermission={editPermission}
				setActivePermission={setActivePermission}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSetAdminUserStatus={handleSetAdminUserStatus}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Create
					disabled={!addPermission?.canUse}
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

import BoApi from 'common/service/Api'
import { useLocation, useNavigate } from 'react-router-dom'
import { createContext, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LocationState, UserAllowedRole, UserMenuState } from 'type'
import { message } from 'antd'
import path from 'app/constants/paths'

export interface AuthContextType {
	auth: AuthState
	userAllowedRoles: UserAllowedRole[] | undefined
	onSignIn: (userName: string, userPassword: string) => void
	onSignOut: () => void
	onCheckSignIn: () => void
	onChangePassword: ({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string
		newPassword: string
	}) => void
	onFetchUserAllowedRoles: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export interface AuthState {
	user: string
	isLogin: boolean | undefined
}

const initialAuth = {
	user: '',
	isLogin: undefined,
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const location = useLocation()

	const [auth, setAuth] = useState<AuthState>(initialAuth)
	const [userAllowedRoles, setUserAllowedRoles] = useState<
		UserAllowedRole[] | undefined
	>(undefined)

	const from = (location as LocationState)?.state?.from?.pathname || '/'

	const onCheckSignIn = async () => {
		try {
			const newAuth: AuthState = await BoApi.onCheckSignIn()

			setAuth(newAuth)
		} catch (error) {
			setAuth({ user: '', isLogin: false })
			message.warn(t('System.Label_Unauthorized'))
		}
	}

	const onSignIn = async (userName: string, userPassword: string) => {
		try {
			const newAuth = await BoApi.onSignIn(userName, userPassword)

			setAuth(newAuth)
			navigate(from, { replace: true })
			message.success(t('System.Label_LoginSuccess'))
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const onSignOut = async () => {
		try {
			await BoApi.onSignOut()

			setAuth(initialAuth)
			navigate(`/${path.login.root}`)
			message.success(t('System.Label_LogoutSuccess'))
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const onChangePassword = async ({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string
		newPassword: string
	}) => {
		try {
			await BoApi.onChangePassword({
				oldPassword,
				newPassword,
			})

			setAuth(initialAuth)
			navigate(`/${path.login.root}`)
			message.success(t('System.Label_ChangePasswordSuccess'))
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const onFetchUserAllowedRoles = async () => {
		const menuList = await BoApi.getUserMenu()

		const newUserAllowedRoles: UserAllowedRole[] = []

		const mapping = (_menuList: UserMenuState[]) => {
			_menuList.forEach(({ funcKey, childs }) => {
				if (funcKey) {
					newUserAllowedRoles.push({
						funcKey,
						isView: true,
						isEdit: true,
					})
				}

				if (childs?.length) {
					mapping(childs)
				}
			})

			return _menuList
		}

		if (menuList.length > 0) {
			mapping(menuList)
		}

		setUserAllowedRoles(newUserAllowedRoles)
	}

	const value = {
		auth,
		userAllowedRoles,
		onSignIn,
		onSignOut,
		onCheckSignIn,
		onChangePassword,
		onFetchUserAllowedRoles,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }

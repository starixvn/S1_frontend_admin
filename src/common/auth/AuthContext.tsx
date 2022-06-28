import BoApi from 'common/service/Api'
import { useLocation, useNavigate } from 'react-router-dom'
import { createContext, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	ActionPermissions,
	LocationState,
	MenuFunctionData,
	MenuInterface,
	UserDataState,
} from 'type'
import { message } from 'antd'
import paths from 'app/constants/paths'
import { getMapMenu } from 'app/constants/menuMapping'

export interface AuthContextType {
	internalAuth: AuthState
	onInternalCheckSignIn: () => void
	onInternalSignIn: (
		userName: string,
		userPassword: string,
		redirectUrl: string
	) => void
	onInternalSignOut: () => void
	userData?: UserDataState
	auth: AuthState
	userMenuList: MenuInterface[]
	userMenuFunctionData: MenuFunctionData[]
	actionPermissions?: ActionPermissions
	setActionPermissions: (newActionPermission: ActionPermissions) => void
	onGetUserData: (siteId: number) => void
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
	onFetchUserMenuList: ({
		lang,
		siteId,
	}: {
		lang: string
		siteId: number
	}) => void
}

const AuthContext = createContext<AuthContextType>(null!)

export interface AuthState {
	isLogin: boolean | undefined
}

const initialAuth = {
	isLogin: undefined,
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const location = useLocation()

	const [userData, setUserData] = useState<UserDataState>()
	const [actionPermissions, setActionPermissions] =
		useState<ActionPermissions>()

	const [auth, setAuth] = useState<AuthState>(initialAuth)
	const [internalAuth, setInternalAuth] = useState<AuthState>(initialAuth)

	const [userMenuList, setUserMenuList] = useState<MenuInterface[]>([])

	const onGetUserData = async (siteId: number) => {
		const newUserData = await BoApi.getUserData(siteId)

		setUserData(newUserData)
	}

	const onCheckSignIn = async () => {
		try {
			const newAuth: AuthState = await BoApi.onCheckSignIn()

			setAuth(newAuth)
		} catch (error) {
			setAuth({ isLogin: false })
		}
	}

	const onInternalCheckSignIn = async () => {
		try {
			const newInternalAuth: AuthState = await BoApi.onInternalCheckSignIn()
			setInternalAuth(newInternalAuth)
		} catch (error) {
			setInternalAuth({ isLogin: false })
		}
	}

	const onInternalSignIn = async (
		userName: string,
		userPassword: string,
		redirectUrl: string
	) => {
		try {
			const newAuth = await BoApi.onInternalSignIn(
				userName,
				userPassword,
				redirectUrl
			)

			setInternalAuth(newAuth)
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const onInternalSignOut = async () => {
		try {
			await BoApi.onInternalSignOut()

			setInternalAuth(initialAuth)
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const onSignIn = async (userName: string, userPassword: string) => {
		try {
			const newAuth = await BoApi.onSignIn(userName, userPassword)

			const { path: dashboardPath } = getMapMenu(1)

			const from = (location as LocationState)?.state?.from

			const path = from?.pathname
				? `${from?.pathname}${from?.search}`
				: dashboardPath

			setAuth(newAuth)
			navigate(path, { replace: true })
			message.success(t('System.Label_LoginSuccess'))
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const onSignOut = async () => {
		try {
			await BoApi.onSignOut()

			setAuth(initialAuth)

			window.location.href = `/${paths.login.root}`
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
			navigate(`/${paths.login.root}`)
			message.success(t('System.Label_ChangePasswordSuccess'))
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const onFetchUserMenuList = async ({
		lang,
		siteId,
	}: {
		lang: string
		siteId: number
	}) => {
		const originUserMenuList = await BoApi.getUserMenu({ lang, siteId })

		setUserMenuList(originUserMenuList)
	}

	const getUserMenuFunctionData = () => {
		const originAllMenuFunctionData: MenuFunctionData[] = []
		const mapping = (list: MenuInterface[]) => {
			list.forEach(menu => {
				if (menu.functionId) {
					originAllMenuFunctionData.push({
						functionId: menu.functionId,
						name: menu.name,
						permission: menu.permission,
					})
				}

				if (menu?.functionDatas ? menu?.functionDatas.length > 0 : 0) {
					menu?.functionDatas?.forEach((functionData: MenuFunctionData) => {
						originAllMenuFunctionData.push(functionData)
					})
				}

				if (menu.subLayerDatas) {
					mapping(menu.subLayerDatas)
				}
			})
		}

		mapping(userMenuList)

		return originAllMenuFunctionData
	}

	const userMenuFunctionData: MenuFunctionData[] = getUserMenuFunctionData()

	const value = {
		internalAuth,
		onInternalCheckSignIn,
		onInternalSignIn,
		onInternalSignOut,
		userData,
		auth,
		userMenuList,
		userMenuFunctionData,
		actionPermissions,
		setActionPermissions,
		onGetUserData,
		onSignIn,
		onSignOut,
		onCheckSignIn,
		onChangePassword,
		onFetchUserMenuList,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }

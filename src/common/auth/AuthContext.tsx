import BoApi from 'common/service/Api'
import { useLocation, useNavigate } from 'react-router-dom'
import { createContext, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LocationState, MenuFunctionDatas, MenuInterface } from 'type'
import { message } from 'antd'
import paths from 'app/constants/paths'
import { getMapMenu } from 'app/constants/menuMapping'

interface UserMenuState {
	childs: null | Array<UserMenuState>
	funcKey: string
}

export interface AuthContextType {
	auth: AuthState
	userMenuList: MenuInterface[]
	userMenuFunctionData: MenuFunctionDatas[]
	internalPermissionFunctionKeys?: string[]
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
	onFetchUserMenuList: (lang: string) => void
	onFetchInternalAllowRoles: () => void
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

	const [userMenuList, setUserMenuList] = useState<MenuInterface[]>([])
	const [internalPermissionFunctionKeys, setInternalPermissionFunctionKeys] =
		useState<string[]>()

	const onCheckSignIn = async () => {
		try {
			const newAuth: AuthState = await BoApi.onCheckSignIn()

			setAuth(newAuth)
		} catch (error) {
			setAuth({ user: '', isLogin: false })
		}
	}

	const onSignIn = async (userName: string, userPassword: string) => {
		try {
			const newAuth = await BoApi.onSignIn(userName, userPassword)

			const { path: dashboardPath } = getMapMenu(1)

			const from =
				(location as LocationState)?.state?.from?.pathname || dashboardPath

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
			navigate(`/${paths.login.root}`)
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

	const onFetchInternalAllowRoles = async () => {
		const internalAllowRoles = await BoApi.getUserMenu(null)

		const newInternalPermissionFunctionKeys: string[] = []

		const mapping = (_menuList: UserMenuState[]) => {
			_menuList.forEach(({ funcKey, childs }) => {
				if (funcKey) {
					newInternalPermissionFunctionKeys.push(funcKey)
				}

				if (childs?.length) {
					mapping(childs)
				}
			})

			return _menuList
		}

		if (internalAllowRoles.length > 0) {
			mapping(internalAllowRoles)
		}

		setInternalPermissionFunctionKeys(newInternalPermissionFunctionKeys)
	}

	const onFetchUserMenuList = async (lang: string) => {
		const originUserMenuList = await BoApi.getUserMenu(lang)

		setUserMenuList(originUserMenuList)
	}

	const getUserMenuFunctionData = () => {
		const originAllMenuFunctionData: MenuFunctionDatas[] = []
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
					menu?.functionDatas?.forEach((functionData: MenuFunctionDatas) => {
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

	const userMenuFunctionData: MenuFunctionDatas[] = getUserMenuFunctionData()

	const value = {
		auth,
		userMenuList,
		userMenuFunctionData,
		internalPermissionFunctionKeys,
		onSignIn,
		onSignOut,
		onCheckSignIn,
		onChangePassword,
		onFetchUserMenuList,
		onFetchInternalAllowRoles,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }

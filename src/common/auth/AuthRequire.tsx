import { find, isEmpty, includes } from 'lodash'
import { Navigate, useLocation } from 'react-router-dom'
import { useActionPermissionsEffect, useAuth } from 'common/hooks'
import paths from 'app/constants/paths'
import { cloneElement, useEffect } from 'react'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { NEW_SITE_PREFIX_URL } from 'app/config'

interface IAuthRequireProps {
	functionId?: number
	children: JSX.Element
}

const AuthRequire = ({ functionId, children }: IAuthRequireProps) => {
	const location = useLocation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions, auth, onCheckSignIn, userMenuFunctionData } =
		useAuth()
	const menuFunctionData = find(userMenuFunctionData, { functionId })

	useEffect(() => {
		onCheckSignIn()
	}, [location.pathname])

	useActionPermissionsEffect({ functionId })

	if (auth.isLogin === false)
		return (
			<Navigate
				to={`/${paths.login.root}`}
				state={{ from: location }}
				replace
			/>
		)

	// viewPermission 用來判斷在找到 menuFunctionData 時候的 view 權限
	const viewPermission = actionPermissions?.viewPermission?.canUse

	// 找不到 menuFunctionData 沒有 view 權限
	const notFoundPermission = !isEmpty(userMenuFunctionData) && !menuFunctionData

	// 找到 actionPermissions 的時候再判斷 viewPermission
	const notViewAllowed = !isEmpty(actionPermissions) && !viewPermission

	// Assign Brand 是透過元件內部判斷 userData isSuper 來控管
	const unrestrictedPaths: string[] = [
		paths.layout.root,
		`/${NEW_SITE_PREFIX_URL}/${paths.assignBrand.root}`,
	]

	// 路徑需要判斷 view 權限
	const isRestrictedPath = !includes(unrestrictedPaths, location.pathname)

	if (isRestrictedPath && (notFoundPermission || notViewAllowed)) {
		return <Navigate to='/403' state={{ from: location }} replace />
	}

	// 如果沒有選擇品牌，不顯示內容
	if (!siteId) return null

	return cloneElement(children, {
		pageTitle: menuFunctionData?.name,
	})
}

export { AuthRequire }

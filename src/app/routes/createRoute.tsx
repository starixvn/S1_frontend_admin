import { MenuItemType } from 'app/constants/menu'
import { Iframe } from 'components/Iframe'
import { RouteObject } from 'react-router-dom'
import { getRoutePath } from './getRoutePath'
import { AuthRequire } from '../../common/auth/AuthRequire'

export const createRoute = ({
	isIndex,
	pathMode,
	newPath,
	oldPath,
	element: originElement,
	allowedRole,
}: MenuItemType): RouteObject => {
	let route: any = {}

	const path = getRoutePath({
		pathMode,
		newPath,
		oldPath,
	})

	const element =
		pathMode === 'NewAdmin' ? (
			<AuthRequire allowedRole={allowedRole}>{originElement}</AuthRequire>
		) : (
			<AuthRequire allowedRole={allowedRole}>
				<Iframe path={oldPath || ''} />
			</AuthRequire>
		)

	if (isIndex) {
		route = { index: true, element }
	} else {
		route = { path, element }
	}

	return route
}

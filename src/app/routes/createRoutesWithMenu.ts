import _ from 'lodash'
import { RouteObject } from 'react-router-dom'
import { MenuItemType, MENU_LIST, MenuListType } from 'app/constants/menu'
import { createRoute } from './createRoute'

const createRoutesWithMenu = (): RouteObject[] => {
	const routes: RouteObject[] = []

	const mapping = (_menuList: MenuListType) => {
		_menuList.forEach(menu => {
			if (!menu.childs) {
				const route = createRoute(menu as MenuItemType)

				routes.push(route)
			}

			if (_.isArray(menu.childs)) {
				mapping(menu.childs)
			}
		})
	}

	mapping(MENU_LIST)

	return routes
}

export default createRoutesWithMenu

import { useState } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { LocationState, UserAllowedRole } from 'type'
import {
	MenuItemType,
	MenuListType,
	MENU_LIST,
	SubMenuType,
} from 'app/constants/menu'
import { Menu, MenuProps } from 'antd'
import { useAuth } from 'common/hooks'
import { useMediaQuery } from 'usehooks-ts'
import { getRoutePath } from 'app/routes/getRoutePath'

const { SubMenu } = Menu
// const { Search } = Input;

const menuConfig = ({
	collapsed,
	openKeys,
}: {
	collapsed: boolean
	openKeys: string[]
}): MenuProps => {
	let config: MenuProps = { mode: 'inline', theme: 'dark' }

	if (!collapsed) {
		config = { ...config, openKeys }
	}
	return config
}

const LayoutMenu = ({
	collapsed,
	onCloseCollapsed,
}: {
	collapsed: boolean
	onCloseCollapsed: () => void
}) => {
	const { t } = useTranslation()
	const location = useLocation()
	const mediaMdMatches = useMediaQuery('(min-width: 768px)')

	const [openKeys, setOpenKeys] = useState<string[]>([])

	const { userAllowedRoles } = useAuth()

	const from = (location as LocationState)?.state?.from?.pathname || '/'

	const handleClickMenuItem = () => {
		if (!mediaMdMatches) {
			onCloseCollapsed()
		}
	}

	const handleToggleMenu = ({ key }: { key: string }) => {
		let newOpenKeys: string[] = []
		const menuKeyArray = key.split('.')

		if (_.includes(openKeys, key)) {
			newOpenKeys =
				_.map(menuKeyArray, (_key, index) => {
					return _.join(_.slice(menuKeyArray, 0, index), '.')
				}) ?? []
		} else {
			newOpenKeys =
				_.map(menuKeyArray, (_key, index) => {
					return _.join(_.slice(menuKeyArray, 0, index + 1), '.')
				}) ?? []
		}

		setOpenKeys(newOpenKeys)
	}

	const mappingMenu = (_menuList: MenuListType) => {
		return _menuList.map(menu => {
			if (!menu.childs) {
				const { isIndex, pathMode, newPath, oldPath, allowedRole, displayKey } =
					menu as MenuItemType

				const path = getRoutePath({
					pathMode,
					newPath,
					oldPath,
				})

				const userAllowedRole = _.find(userAllowedRoles, {
					funcKey: allowedRole,
				}) as UserAllowedRole | undefined

				if (!userAllowedRole?.isView) return null

				return (
					<Menu.Item
						onClick={handleClickMenuItem}
						key={allowedRole}
						icon={menu.icon}
					>
						<Link to={isIndex ? '/' : path} state={{ from }}>
							{t(displayKey)}
						</Link>
					</Menu.Item>
				)
			}

			const { icon, childs, menuKey, displayKey }: SubMenuType = menu

			return (
				<SubMenu
					onTitleClick={handleToggleMenu}
					key={menuKey}
					title={t(displayKey)}
					icon={icon}
					theme={collapsed ? 'light' : 'dark'}
				>
					{mappingMenu(childs)}
				</SubMenu>
			)
		})
	}

	const renderMenu = mappingMenu(MENU_LIST)

	// TODOS
	// const onSearch = (value: string) => console.log(value);

	return (
		<Menu {...menuConfig({ collapsed, openKeys })}>
			{/* {!collapsed && (
				<Search
					placeholder="input search text"
					allowClear
					enterButton
					onSearch={onSearch}
				/>
			)} */}

			{renderMenu}
		</Menu>
	)
}

export { LayoutMenu }

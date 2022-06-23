import { Link } from 'react-router-dom'
import { Menu, MenuProps } from 'antd'
import { useMediaQuery } from 'usehooks-ts'
import { MenuInterface } from 'type'
import { getMapMenu, MODULE_ICON_MAPPING } from 'app/constants/menuMapping'
import { find } from 'lodash'
import { useAuth } from 'common/hooks'
import { makeMenuKey, useMenuAction } from './hooks'

// const { Search } = Input;

type MenuItem = Required<MenuProps>['items'][number]

const LayoutMenu = ({
	collapsed,
	onCloseCollapsed,
}: {
	collapsed: boolean
	onCloseCollapsed: () => void
}) => {
	const mediaMdMatches = useMediaQuery('(min-width: 768px)')
	const { userMenuList } = useAuth()
	const { openKeys, handleClickMenuItem, handleToggleMenu } = useMenuAction({
		mediaMdMatches,
		onCloseCollapsed,
		userMenuList,
	})

	// TODOS
	// const onSearch = (value: string) => console.log(value);

	const renderMenuItem = (menu: MenuInterface): MenuItem => {
		const { name, moduleId, functionId, permission } = menu
		const isGroup = Boolean(moduleId)
		const { path, icon } = getMapMenu(Number(functionId))
		const hasPermission = find(permission, {
			name: 'View',
		})?.canUse

		if (isGroup) return renderSubMenuItem(menu)

		if (!hasPermission) return null

		const menuItem: MenuItem = {
			style: { fontSize: '12px' },
			key: name,
			icon,
			label: (
				<Link to={path} onClick={handleClickMenuItem}>
					{name}
				</Link>
			),
		}

		return menuItem
	}

	const renderSubMenuItem = (menu: MenuInterface) => {
		const { name, moduleId } = menu
		const menuKey = makeMenuKey(name, moduleId)
		const moduleIcon = moduleId ? MODULE_ICON_MAPPING?.[moduleId] : null

		const renderFunctionDatas =
			menu.functionDatas
				?.map(functionData => renderMenuItem(functionData))
				.filter(Boolean) ?? []

		const renderSubLayerDatas =
			menu.subLayerDatas
				?.map(subLayerData => renderMenuItem(subLayerData))
				.filter(Boolean) ?? []

		if (
			renderFunctionDatas?.length === 0 &&
			renderSubLayerDatas?.length === 0
		) {
			return null
		}

		const subMenuItem: MenuItem = {
			style: { fontSize: '12px' },
			onTitleClick: () => handleToggleMenu(menuKey, moduleId),
			key: menuKey,
			label: name,
			icon: moduleIcon,
			theme: collapsed ? 'light' : 'dark',
			children: [...renderFunctionDatas, ...renderSubLayerDatas],
		}
		return subMenuItem
	}

	const items = userMenuList.map(menu => renderMenuItem(menu))

	return (
		<Menu
			{...{
				...(!collapsed && { openKeys }),
				mode: 'inline',
				theme: 'dark',
			}}
			items={items}
		>
			{/* {!collapsed && (
				<Search
					placeholder="input search text"
					allowClear
					enterButton
					onSearch={onSearch}
				/>
			)} */}
		</Menu>
	)
}

export { LayoutMenu }

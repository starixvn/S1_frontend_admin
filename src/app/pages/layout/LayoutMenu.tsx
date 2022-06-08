import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { useMediaQuery } from 'usehooks-ts'
import { MenuInterface } from 'type'
import { getMapMenu, MODULE_ICON_MAPPING } from 'app/constants/menuMapping'
import { filter, find, includes } from 'lodash'
import { useAuth } from 'common/hooks'

// const { Search } = Input;

const { SubMenu } = Menu

export const makeMenuKey = (name: string, moduleId: number | undefined) =>
	`${name.replace(/ /g, '')}-${moduleId}`

const makeRootSubmenuKeys = (menuList: MenuInterface[]) => {
	const menuKeys: Array<{ moduleId: number; key: string }> = []

	const getModuleKeys = (menu: MenuInterface, menuKey: string) => {
		const { moduleId, subLayerDatas } = menu

		if (moduleId) {
			const newKey = {
				moduleId,
				key: menuKey,
			}

			menuKeys.push(newKey)

			if (subLayerDatas) {
				subLayerDatas.forEach(childMenu => {
					const { name: childName, moduleId: childModuleId } = childMenu
					const childMenuKey = makeMenuKey(childName, childModuleId)

					getModuleKeys(childMenu, `${menuKey}.${childMenuKey}`)
				})
			}
		}
	}

	menuList.forEach(menu => {
		const { name, moduleId } = menu
		const menuKey = makeMenuKey(name, moduleId)

		getModuleKeys(menu, menuKey)
	})

	return menuKeys
}

const useMenuAction = ({
	mediaMdMatches,
	onCloseCollapsed,
	userMenuList,
}: {
	mediaMdMatches: boolean
	onCloseCollapsed: () => void
	userMenuList: MenuInterface[]
}) => {
	const [openKeys, setOpenKeys] = useState<string[]>([])

	const rootSubmenuKeys = makeRootSubmenuKeys(userMenuList)

	const handleClickMenuItem = () => {
		if (!mediaMdMatches) {
			onCloseCollapsed()
		}
	}

	const handleToggleMenu = (key: string, moduleId: number | undefined) => {
		const menuKeyArray =
			find(rootSubmenuKeys, { moduleId })?.key.split('.') ?? []

		if (includes(openKeys, key)) {
			setOpenKeys(filter(menuKeyArray, menuKey => menuKey !== key))
		} else {
			setOpenKeys(menuKeyArray)
		}
	}

	return { openKeys, handleClickMenuItem, handleToggleMenu }
}

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

	const renderMenuItem = (menu: MenuInterface) => {
		const { name, moduleId, functionId, permission } = menu
		const isGroup = Boolean(moduleId)

		const { path, icon } = getMapMenu(Number(functionId))

		const hasPermission = find(permission, {
			name: 'View',
		})?.canUse

		if (isGroup) return renderSubMenuItem(menu)

		if (!hasPermission) return null

		return (
			<Menu.Item
				style={{ fontSize: '12px' }}
				key={name}
				icon={icon}
				onClick={handleClickMenuItem}
			>
				<Link to={path}>{name}</Link>
			</Menu.Item>
		)
	}

	const renderSubMenuItem = (menu: MenuInterface) => {
		const { name, moduleId } = menu
		const menuKey = makeMenuKey(name, moduleId)
		const moduleIcon = moduleId ? MODULE_ICON_MAPPING?.[moduleId] : null

		const renderFunctionDatas = menu.functionDatas
			?.map(functionData => renderMenuItem(functionData))
			.filter(Boolean)

		const renderSubLayerDatas = menu.subLayerDatas
			?.map(subLayerData => renderMenuItem(subLayerData))
			.filter(Boolean)

		if (
			renderFunctionDatas?.length === 0 &&
			renderSubLayerDatas?.length === 0
		) {
			return null
		}

		return (
			<SubMenu
				style={{ fontSize: '12px' }}
				onTitleClick={() => handleToggleMenu(menuKey, moduleId)}
				key={menuKey}
				title={name}
				icon={moduleIcon}
				theme={collapsed ? 'light' : 'dark'}
			>
				{renderFunctionDatas}

				{renderSubLayerDatas}
			</SubMenu>
		)
	}

	return (
		<Menu
			{...{
				...(!collapsed && { openKeys }),
				mode: 'inline',
				theme: 'dark',
			}}
		>
			{/* {!collapsed && (
				<Search
					placeholder="input search text"
					allowClear
					enterButton
					onSearch={onSearch}
				/>
			)} */}

			{userMenuList.map(menu => renderMenuItem(menu))}
		</Menu>
	)
}

export { LayoutMenu }

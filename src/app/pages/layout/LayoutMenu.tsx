import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { useMediaQuery } from 'usehooks-ts'
import { MenuInterface } from 'type'
import { getMapMenu, MODULE_ICON_MAPPING } from 'app/constants/menuMapping'
import _ from 'lodash'
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
			_.find(rootSubmenuKeys, { moduleId })?.key.split('.') ?? []

		if (_.includes(openKeys, key)) {
			setOpenKeys(_.filter(menuKeyArray, menuKey => menuKey !== key))
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
		const { name, moduleId, functionId } = menu
		const isGroup = Boolean(moduleId)

		const menuMap = getMapMenu(Number(functionId))

		return isGroup ? (
			renderSubMenuItem(menu)
		) : (
			<Menu.Item key={name} icon={menuMap.icon} onClick={handleClickMenuItem}>
				<Link to={menuMap.path}>{name}</Link>
			</Menu.Item>
		)
	}

	const renderSubMenuItem = (menu: MenuInterface) => {
		const { name, moduleId } = menu
		const menuKey = makeMenuKey(name, moduleId)
		const moduleIcon = moduleId ? MODULE_ICON_MAPPING?.[moduleId] : null

		return (
			<SubMenu
				onTitleClick={() => handleToggleMenu(menuKey, moduleId)}
				key={menuKey}
				title={name}
				icon={moduleIcon}
				theme={collapsed ? 'light' : 'dark'}
			>
				{menu.functionDatas?.map(functionData => renderMenuItem(functionData))}

				{menu.subLayerDatas?.map(subLayerData => renderMenuItem(subLayerData))}
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

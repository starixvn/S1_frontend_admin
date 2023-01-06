import { CSSProperties, useEffect, useState } from 'react'
import { MenuProps, Typography } from 'antd'
import type { SelectProps } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { makeMenuKey, useMenuAction } from 'app/pages/layout/hooks'
import { MenuInterface } from 'type'
import {
	getMapMenu,
	MENU_MAPPING,
	MODULE_ICON_MAPPING,
} from 'app/constants/menuMapping'
import { Link, useLocation } from 'react-router-dom'
import { find, isEmpty } from 'lodash'
import { useAuth } from 'common/hooks'
import { useMediaQuery } from 'usehooks-ts'

type MenuItem = Required<MenuProps>['items'][number]

const labelStyle: CSSProperties = {
	position: 'absolute',
	top: 0,
	bottom: 0,
	right: 0,
	left: 0,
	cursor: 'default',
}

const useMenuItems = ({
	collapsed,
	onCloseCollapsed,
}: {
	collapsed: boolean
	onCloseCollapsed: () => void
}) => {
	const mediaMdMatches = useMediaQuery('(min-width: 768px)')
	const { userMenuList } = useAuth()
	const { pathname } = useLocation()
	const [menuItems, setMenuItems] = useState<ItemType[]>([])
	const [menuPaths, setMenuPaths] = useState<
		SelectProps['options'] | undefined
	>([])
	const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([])
	const [isFirstEffect, setIsFirstEffect] = useState(true)

	const { openKeys, onChangeOpenKeys, onToggleMenu } = useMenuAction({
		userMenuList,
	})

	const { functionId: currentFunctionId } =
		MENU_MAPPING.find(
			item =>
				pathname.match(item.newAdminPath || '!!!') ||
				pathname.match(item.internalPath || '!!!')
		) ?? {}

	// * 手機裝置的話點擊 item 自動將 menu 收合起來，桌機裝置則不用
	const onClickMenuItem = () => {
		if (!mediaMdMatches) {
			onCloseCollapsed()
		}
	}

	useEffect(() => {
		if (isEmpty(userMenuList)) return

		let newDefaultOpenKeys: (string | undefined)[] = []
		let newMenuPaths: SelectProps['options'] = []

		const renderMenuItem = (
			menu: MenuInterface,
			moduleKey?: string,
			rootMenuKey?: string
		): MenuItem => {
			const { name, moduleId, functionId, permission } = menu

			// * if is group menu, early return renderSubMenuItem
			const isGroup = Boolean(moduleId)
			if (isGroup) return renderSubMenuItem(menu, rootMenuKey)

			// * if has not permission, early return null
			const hasPermission = find(permission, {
				name: 'View',
			})?.canUse

			if (!hasPermission) return null

			const menuKey = makeMenuKey(name, functionId)
			const isCurrentFunctionId = currentFunctionId === functionId
			// * 用於初始 openKeys ，迭代的同時搜集當前 functionId (當前頁面) 的所有 menuKey
			if (isCurrentFunctionId && isFirstEffect) {
				newDefaultOpenKeys = [
					...newDefaultOpenKeys,
					menuKey,
					moduleKey,
					rootMenuKey,
				]
			}

			// * make menu item
			const { path, icon } = getMapMenu(Number(functionId))
			const menuItem: MenuItem = {
				style: { fontSize: '12px' },
				key: menuKey,
				icon,
				label: <Link to={path}>{name}</Link>,
				onClick: ({ keyPath }) => {
					onChangeOpenKeys(keyPath)
					onClickMenuItem()
				},
			}

			if (path && path !== '/') {
				newMenuPaths = [...(newMenuPaths || []), { value: path, label: name }]
			}

			return menuItem
		}

		const renderSubMenuItem = (
			menu: MenuInterface,
			rootMenuKey: string | undefined
		) => {
			const { name, moduleId } = menu
			const menuKey = makeMenuKey(name, moduleId)
			const moduleIcon = moduleId ? MODULE_ICON_MAPPING?.[moduleId] : null

			const labelItem: MenuItem = {
				style: { fontSize: '12px' },
				key: name,
				disabled: true,
				label: (
					<div style={labelStyle}>
						<Typography.Text style={{ marginLeft: 15 }} type='secondary'>
							{name}
						</Typography.Text>
					</div>
				),
			}

			const renderFunctionDatas =
				menu.functionDatas
					?.map(functionData =>
						renderMenuItem(functionData, menuKey, rootMenuKey)
					)
					.filter(Boolean) ?? []

			const renderSubLayerDatas =
				menu.subLayerDatas
					?.map(subLayerData =>
						renderMenuItem(subLayerData, menuKey, rootMenuKey)
					)
					.filter(Boolean) ?? []

			if (
				renderFunctionDatas?.length === 0 &&
				renderSubLayerDatas?.length === 0
			) {
				return null
			}

			// * 將所有透過 functionDatas 及 subLayerDatas 製作出來的 subMenu 串起來
			const subMenuItem: MenuItem = {
				style: { fontSize: '12px' },
				onTitleClick: () => onToggleMenu(menuKey, moduleId),
				key: menuKey,
				label: name,
				icon: moduleIcon,
				theme: collapsed ? 'light' : 'dark',
				children: collapsed
					? [labelItem, ...renderFunctionDatas, ...renderSubLayerDatas]
					: [...renderFunctionDatas, ...renderSubLayerDatas],
			}
			return subMenuItem
		}

		// * 製作 menuItems，並根據 functionId 或 moduleId 組合 menuKey 並綁定對應的 menuItem key
		const newMenuItems = userMenuList.map(menu => {
			const { name, moduleId } = menu
			const rootMenuKey = moduleId ? makeMenuKey(name, moduleId) : undefined
			return renderMenuItem(menu, undefined, rootMenuKey)
		})

		// * 用於初始 openKeys
		if (isFirstEffect) {
			setDefaultOpenKeys(
				// * 去除重複的 key、去除 undefined
				Array.from(new Set(newDefaultOpenKeys)).filter(Boolean) as string[]
			)
		}

		setMenuItems(newMenuItems)
		setIsFirstEffect(false)

		setMenuPaths(newMenuPaths)
	}, [isFirstEffect, userMenuList, openKeys, collapsed])

	// * 初始 openKeys ，跟著當前頁面打開至對應的 menuItem
	useEffect(() => {
		if (!isEmpty(defaultOpenKeys)) {
			onChangeOpenKeys(defaultOpenKeys)
		}
	}, [isFirstEffect, pathname])

	// *當路徑變動時再次初始 openKeys
	useEffect(() => {
		setIsFirstEffect(true)
	}, [pathname])

	return { openKeys, menuItems, menuPaths }
}

export { useMenuItems }

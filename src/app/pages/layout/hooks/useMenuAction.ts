import { filter, find, includes } from 'lodash'
import { useState } from 'react'
import { MenuInterface } from 'type'

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

export const useMenuAction = ({
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

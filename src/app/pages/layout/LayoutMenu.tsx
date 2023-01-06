import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { isEmpty, uniqueId } from 'lodash'
import { useMenuItems } from './hooks'
import { LayoutMenuSearch } from './LayoutMenuSearch'

const LayoutMenu = ({
	collapsed,
	onCloseCollapsed,
}: {
	collapsed: boolean
	onCloseCollapsed: () => void
}) => {
	const {
		openKeys,
		menuItems,
		menuPaths = [],
	} = useMenuItems({
		collapsed,
		onCloseCollapsed,
	})

	const searchMenuItem: ItemType = {
		label: <LayoutMenuSearch menuPaths={menuPaths} />,
		key: uniqueId(),
	}

	const items = [
		// * 收合狀態時不顯示搜尋元件
		!collapsed && !isEmpty(menuItems) && searchMenuItem,
		...menuItems,
	].filter(Boolean) as ItemType[]

	return (
		<Menu
			{...{
				// * 收合狀態時關閉菜單
				...(!collapsed && { openKeys, selectedKeys: openKeys }),
				mode: 'inline',
				theme: 'dark',
			}}
			items={items}
		/>
	)
}

export { LayoutMenu }

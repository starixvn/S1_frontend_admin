import { Menu } from 'antd'
import { useMenuItems } from './hooks'

// const { Search } = Input;

const LayoutMenu = ({
	collapsed,
	onCloseCollapsed,
}: {
	collapsed: boolean
	onCloseCollapsed: () => void
}) => {
	const { openKeys, menuItems } = useMenuItems({
		collapsed,
		onCloseCollapsed,
	})

	// TODOS
	// const onSearch = (value: string) => console.log(value);

	return (
		<Menu
			{...{
				// * 收合狀態時關閉菜單
				...(!collapsed && { openKeys, selectedKeys: openKeys }),
				mode: 'inline',
				theme: 'dark',
			}}
			items={menuItems}
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

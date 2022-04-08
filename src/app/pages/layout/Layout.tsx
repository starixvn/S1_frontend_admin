import { useAuth } from 'common/hooks'
import { useLocation } from 'react-router-dom'
import { useState, FC, useEffect } from 'react'
import { Layout as AntdLayout } from 'antd'
import { LayoutSideBar } from './LayoutSideBar'
import { LayoutHeader } from './LayoutHeader'
import { LayoutContent } from './LayoutContent'

const useMenuCollapsed = () => {
	const [collapsed, setCollapsed] = useState<boolean>(true)

	const onToggleCollapsed = () => {
		setCollapsed(prev => !prev)
	}

	const onCloseCollapsed = () => {
		setCollapsed(true)
	}

	return { collapsed, onToggleCollapsed, onCloseCollapsed }
}

const Layout: FC = () => {
	const auth = useAuth()
	const location = useLocation()

	const { collapsed, onToggleCollapsed, onCloseCollapsed } = useMenuCollapsed()

	useEffect(() => {
		auth.onCheckSignIn()
	}, [location.pathname])

	useEffect(() => {
		auth.onFetchUserAllowedRoles()
	}, [])

	return (
		<AntdLayout style={{ minHeight: '100vh' }}>
			<LayoutSideBar
				collapsed={collapsed}
				onToggleCollapsed={onToggleCollapsed}
				onCloseCollapsed={onCloseCollapsed}
			/>

			<AntdLayout>
				<LayoutHeader
					collapsed={collapsed}
					onToggleCollapsed={onToggleCollapsed}
				/>

				<AntdLayout style={{ padding: '0 24px 24px' }}>
					<LayoutContent />
				</AntdLayout>
			</AntdLayout>
		</AntdLayout>
	)
}

export { Layout }

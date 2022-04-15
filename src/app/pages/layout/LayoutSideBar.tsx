import { HomeOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import { getMapMenu } from 'app/constants/menuMapping'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'usehooks-ts'
import { LayoutMenu } from './LayoutMenu'

const { Header, Sider } = Layout

const LayoutSideBar = ({
	collapsed,
	onToggleCollapsed,
	onCloseCollapsed,
}: {
	collapsed: boolean
	onToggleCollapsed: () => void
	onCloseCollapsed: () => void
}) => {
	const mediaMdMatches = useMediaQuery('(min-width: 768px)')

	return (
		<Sider
			className='layout-side-bar'
			width={280}
			trigger={null}
			breakpoint='md'
			collapsedWidth={mediaMdMatches ? '80' : '0'}
			collapsible={false}
			collapsed={collapsed}
			onCollapse={onToggleCollapsed}
			style={{
				overflow: 'auto',
				height: '100vh',
				position: 'static',
			}}
		>
			<Header
				className='header'
				style={{ display: 'flex', justifyContent: 'center' }}
			>
				<Link to={getMapMenu(1).path}>
					<img
						width={80}
						src='http://admin.n88dev.com/images/logo.png'
						alt='logo'
					/>
				</Link>
			</Header>

			<LayoutMenu collapsed={collapsed} onCloseCollapsed={onCloseCollapsed} />
		</Sider>
	)
}

export { LayoutSideBar }

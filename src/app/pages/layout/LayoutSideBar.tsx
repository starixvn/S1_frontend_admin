import { Layout } from 'antd'
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
			width={240}
			trigger={null}
			breakpoint='md'
			collapsedWidth={mediaMdMatches ? '80' : '0'}
			collapsible={false}
			collapsed={collapsed}
			onCollapse={onToggleCollapsed}
		>
			<Header
				className='header'
				style={{ display: 'flex', justifyContent: 'center' }}
			>
				<Link to='/'>
					<img
						width={80}
						src='https://image.0814media.net/SiteSkin/img/logo_en.png'
						alt='logo'
					/>
				</Link>
			</Header>

			<LayoutMenu collapsed={collapsed} onCloseCollapsed={onCloseCollapsed} />
		</Sider>
	)
}

export { LayoutSideBar }

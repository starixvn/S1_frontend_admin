import { Layout } from 'antd'
import { SITE_LOGO_IMAGE } from 'app/constants/images'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'usehooks-ts'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { LayoutMenu } from './LayoutMenu'

const { Header, Sider } = Layout

const LayoutSideBar = ({
	loading,
	collapsed,
	onCloseCollapsed,
}: {
	loading: boolean
	collapsed: boolean
	onCloseCollapsed: () => void
}) => {
	const mediaMdMatches = useMediaQuery('(min-width: 768px)')
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const logoImage = siteId && SITE_LOGO_IMAGE[siteId]

	return (
		<Sider
			className='layout-side-bar'
			width={280}
			trigger={null}
			breakpoint='md'
			collapsedWidth={mediaMdMatches ? '80' : '0'}
			collapsible={false}
			collapsed={collapsed}
			style={{
				overflow: 'auto',
				height: '100vh',
				position: 'static',
				pointerEvents: loading ? 'none' : 'auto', // * 如果還在 loading 狀態不開放選擇 menu
			}}
		>
			<Header
				className='header'
				style={{ display: 'flex', justifyContent: 'center' }}
			>
				{!collapsed && logoImage && (
					<Link to='/'>
						<LazyLoadImage
							alt='site-logo'
							src={logoImage.url}
							width={logoImage.width}
							height={logoImage.height}
							style={logoImage.style}
						/>
					</Link>
				)}
			</Header>

			<LayoutMenu collapsed={collapsed} onCloseCollapsed={onCloseCollapsed} />
		</Sider>
	)
}

export { LayoutSideBar }

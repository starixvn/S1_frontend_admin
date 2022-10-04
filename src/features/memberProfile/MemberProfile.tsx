import { useState } from 'react'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import MemberProfileSider from 'features/memberProfile/sider/MemberProfileSider'
import MemberProfileHeader from 'features/memberProfile/MemberProfileHeader'

const { Content } = Layout

const StyleContent = styled(Content)`
	margin: 8px;
`

const useDrawer = () => {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

	const onOpenDrawer = () => {
		setDrawerOpen(true)
	}

	const onCloseDrawer = () => {
		setDrawerOpen(false)
	}

	return {
		drawerOpen,
		onOpenDrawer,
		onCloseDrawer,
	}
}

const MemberProfile = () => {
	const { drawerOpen, onOpenDrawer, onCloseDrawer } = useDrawer()

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<MemberProfileHeader onOpenDrawer={onOpenDrawer} />

			<Content style={{ padding: '0 24px' }}>
				<Layout>
					<MemberProfileSider
						drawerOpen={drawerOpen}
						onCloseDrawer={onCloseDrawer}
					/>

					<StyleContent>
						<Outlet />
						<br />
					</StyleContent>
				</Layout>
			</Content>
		</Layout>
	)
}

export default MemberProfile

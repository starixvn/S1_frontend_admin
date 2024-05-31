import { Drawer, Layout } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import React from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'usehooks-ts'
import MemberProfileSiderContent from 'features/memberProfile/sider/MemberProfileSiderContent'

const { Sider } = Layout

const StyleSider = styled(Sider)`
	background: transparent !important;
	margin: 8px;
`

interface IMemberProfileSiderProps {
	drawerOpen: boolean
	onCloseDrawer: () => void
}

const MemberProfileSider = ({
	drawerOpen,
	onCloseDrawer,
}: IMemberProfileSiderProps) => {
	const isMobileMedia = useMediaQuery('(max-width: 768px)')

	return isMobileMedia ? (
		<Drawer placement='left' onClose={onCloseDrawer} open={drawerOpen}>
			<MemberProfileSiderContent />
		</Drawer>
	) : (
		<StyleSider width={280}>
			<LayoutContent.Card
				style={{
					minHeight: '80vh',
					overflow: 'unset',
				}}
			>
				<MemberProfileSiderContent />
			</LayoutContent.Card>
		</StyleSider>
	)
}

export default MemberProfileSider

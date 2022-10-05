import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { AffixButtons } from 'components/AffixButtons'
import MemberProfileHeader from './MemberProfileHeader'

const { Sider, Content } = Layout

const StyleSider = styled(Sider)`
	border: 1px solid #f0f0f0;
`

const MemberProfile = () => {
	return (
		<Layout style={{ height: '100%' }}>
			<StyleSider theme='light'> </StyleSider>
			<Layout>
				<MemberProfileHeader />

				<Content
					style={{
						margin: '68px 16px 16px 16px',
						overflow: 'initial',
					}}
				>
					<Outlet />
				</Content>

				<AffixButtons>
					<AffixButtons.BackToTop />
				</AffixButtons>
			</Layout>
		</Layout>
	)
}

export default MemberProfile

import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { AffixButtons } from 'components/AffixButtons'
import { MemberProfileSider } from 'features/memberProfile/sider/MemberProfileSider'
import MemberProfileHeader from './MemberProfileHeader'

const { Content } = Layout

const MemberProfile = () => {
	return (
		<Layout style={{ height: '100%' }}>
			<MemberProfileSider />
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

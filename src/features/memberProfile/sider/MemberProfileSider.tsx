import { Layout } from 'antd'
import styled from 'styled-components'

const { Sider } = Layout

const StyleSider = styled(Sider)`
	border: 1px solid #f0f0f0;
`

const MemberProfileSider = () => {
	return <StyleSider theme='light'> </StyleSider>
}

export { MemberProfileSider }

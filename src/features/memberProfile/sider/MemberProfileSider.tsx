import { Divider, Layout, Spin } from 'antd'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useGetBasicInfoQuery } from 'features/memberProfile/api'
import { IGetBasicInfoResponse } from 'features/memberProfile/type'
import { BasicInfo } from 'features/memberProfile/sider/BasicInfo'
import { StatusInfo } from 'features/memberProfile/sider/StatusInfo'

const { Sider } = Layout

const StyleSider = styled(Sider)`
	border: 1px solid #f0f0f0;
	padding: 15px;
	overflow: auto;
	height: 100vh;
	position: static;
`

const MemberProfileSider = () => {
	const { custId = '' } = useParams()
	const {
		data: { data: custBasicInfo } = {} as IGetBasicInfoResponse,
		isFetching: isGetCustBasicInfoLoading,
	} = useGetBasicInfoQuery({
		custId: Number(custId),
	})

	return (
		<StyleSider theme='light' width={250}>
			<Spin spinning={isGetCustBasicInfoLoading}>
				<BasicInfo custBasicInfo={custBasicInfo} />
				<Divider />
				<StatusInfo custBasicInfo={custBasicInfo} />
				<Divider />
			</Spin>
		</StyleSider>
	)
}

export { MemberProfileSider }

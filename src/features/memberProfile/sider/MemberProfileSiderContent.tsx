import { BasicInfo } from 'features/memberProfile/sider/BasicInfo'
import { Divider, Spin } from 'antd'
import { StatusInfo } from 'features/memberProfile/sider/StatusInfo'
import { useParams } from 'react-router-dom'
import { IGetBasicInfoResponse } from 'features/memberProfile/type'
import { useGetBasicInfoQuery } from 'features/memberProfile/api'

const MemberProfileSiderContent = () => {
	const { custId = '' } = useParams()
	const {
		data: { data: custBasicInfo } = {} as IGetBasicInfoResponse,
		isFetching: isGetCustBasicInfoLoading,
	} = useGetBasicInfoQuery({
		custId: Number(custId),
	})
	return (
		<div>
			<Spin spinning={isGetCustBasicInfoLoading}>
				<BasicInfo custBasicInfo={custBasicInfo} />
				<Divider style={{ margin: '15px 0' }} />
				<StatusInfo custBasicInfo={custBasicInfo} />
				<Divider />
			</Spin>
		</div>
	)
}

export default MemberProfileSiderContent

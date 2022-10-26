import { Table } from 'antd'
import { IGetIpCountData } from 'features/memberProfile/type'

interface IIpCountsTableProps {
	loading: boolean
	ipCountList: IGetIpCountData[]
}

const IpCountsTable = ({ loading, ipCountList }: IIpCountsTableProps) => {
	const columns = [
		{
			title: 'Ip',
			dataIndex: 'loginIp',
			key: 'loginIp',
		},
		{
			title: 'User Count',
			dataIndex: 'userCount',
			key: 'userCount',
		},
	]

	return (
		<Table
			size='small'
			bordered
			loading={loading}
			dataSource={ipCountList}
			columns={columns}
			pagination={{ hideOnSinglePage: true }}
		/>
	)
}

export default IpCountsTable

import { Table, Typography } from 'antd'
import { IGetIpCountData } from 'features/memberProfile/type'
import { numFormatToDigits } from 'common/utils/format'

interface IIpCountsTableProps {
	loading: boolean
	ipCountList: IGetIpCountData[]
	onAccountClick: (ip: string) => void
}

const IpCountsTable = ({
	loading,
	ipCountList,
	onAccountClick,
}: IIpCountsTableProps) => {
	const columns = [
		{
			title: 'Ip',
			dataIndex: 'loginIp',
			key: 'loginIp',
		},
		{
			title: 'User Count',
			key: 'userCount',
			render: (record: IGetIpCountData) => {
				const { loginIp, userCount } = record
				return (
					<Typography.Link onClick={() => onAccountClick(loginIp)}>
						{numFormatToDigits(userCount || 0)}
					</Typography.Link>
				)
			},
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

import { Table, Typography } from 'antd'
import { timeFormat } from 'common/utils/format'
import { IGetDeviceData } from 'features/memberProfile/type'
import moment from 'moment'

interface IDeviceListTableProps {
	loading: boolean
	deviceList: IGetDeviceData[]
	timeZoneUtcOffset: number
}

const DeviceListTable = ({
	loading,
	deviceList,
	timeZoneUtcOffset,
}: IDeviceListTableProps) => {
	const columns = [
		{
			title: 'Device Id',
			dataIndex: 'deviceId',
			key: 'deviceId',
			align: 'center' as 'center',
			render: (deviceId: string) => (
				<div style={{ width: '80px' }}>{deviceId}</div>
			),
		},
		{
			title: 'Risk',
			key: 'risk',
			align: 'center' as 'center',
			render: (record: IGetDeviceData) => {
				const { score, risk } = record
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{`${risk}(${score})`}
					</Typography.Text>
				)
			},
		},
		{
			title: 'Frequency',
			dataIndex: 'frequency',
			key: 'frequency',
			width: '15%',
			align: 'center' as 'center',
		},
		{
			title: 'Associate Count',
			dataIndex: 'associateCount',
			key: 'associateCount',
			align: 'center' as 'center',
		},
		{
			title: 'last Used Time',
			dataIndex: 'lastUpdateTime',
			key: 'lastUpdateTime',
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime
					? moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
	]
	return (
		<Table
			bordered
			loading={loading}
			dataSource={deviceList}
			columns={columns}
			pagination={{ hideOnSinglePage: true }}
		/>
	)
}

export default DeviceListTable

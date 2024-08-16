import { Table, Typography } from 'antd'
import { timeFormat } from 'common/utils/format'
import { IGetDeviceData, IGetFpsDeviceData } from 'features/memberProfile/type'
import dayjs from 'dayjs'

interface IFpsDeviceListTableProps {
	loading: boolean
	fpsDeviceList: IGetFpsDeviceData[]
	timeZoneUtcOffset: number
	onAccountClick: (deviceId: string) => void
}

const FpsDeviceListTable = ({
	loading,
	fpsDeviceList,
	timeZoneUtcOffset,
	onAccountClick,
}: IFpsDeviceListTableProps) => {
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
			title: 'Risk Level',
			key: 'riskLevel',
			align: 'center' as 'center',
			render: (record: IGetFpsDeviceData) => {
				const { riskLevel } = record
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{riskLevel || '-'}
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
			key: 'associateCount',
			align: 'center' as 'center',
			render: (record: IGetDeviceData) => {
				const { associateCount, deviceId } = record
				return (
					<Typography.Link onClick={() => onAccountClick(deviceId)}>
						{associateCount}
					</Typography.Link>
				)
			},
		},
		{
			title: 'last Used Time',
			dataIndex: 'lastUpdateTime',
			key: 'lastUpdateTime',
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime
					? dayjs(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
	]
	return (
		<Table
			size='small'
			bordered
			loading={loading}
			dataSource={fpsDeviceList}
			columns={columns}
			pagination={{ hideOnSinglePage: true }}
		/>
	)
}

export default FpsDeviceListTable

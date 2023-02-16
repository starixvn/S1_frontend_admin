import { IGetDeviceData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { find } from 'lodash'
import { deviceStatusList } from 'features/memberProfile/constants'
import { Typography } from 'antd'
import moment from 'moment/moment'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { isPositiveNum } from 'common/utils'

interface IDeviceListTableProps {
	loading: boolean
	deviceList: IGetDeviceData[]
	timeZoneUtcOffset: number
	onAccountClick: (deviceId: string) => void
}
const DeviceListTable = ({
	loading,
	deviceList,
	timeZoneUtcOffset,
	onAccountClick,
}: IDeviceListTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_DeviceID'),
			dataIndex: 'deviceId',
			key: 'deviceId',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Allow'),
			dataIndex: 'risk',
			key: 'risk',
			width: 80,
			align: 'center' as 'center',
			render: (risk: string) => {
				const statusName = find(
					deviceStatusList,
					status => status.value === risk
				)?.displayName
				return statusName ? t(statusName) : '-'
			},
		},
		{
			title: t('Label_Score'),
			dataIndex: 'score',
			key: 'score',
			width: 80,
			align: 'center' as 'center',
			render: (risk: number) => (
				<Typography.Text
					type={isPositiveNum(risk) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(risk || 0)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Frequency'),
			dataIndex: 'frequency',
			key: 'frequency',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DeviceType'),
			dataIndex: 'deviceType',
			key: 'deviceType',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AssociateAccount'),
			key: 'count',
			width: 60,
			align: 'center' as 'center',
			render: (record: IGetDeviceData) => {
				const { associateCount, deviceId } = record
				return (
					<Typography.Link onClick={() => onAccountClick(deviceId)}>
						{numFormatToDigits(associateCount || 0)}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]
	return (
		<Table
			loading={loading}
			pagination={false}
			dataSource={deviceList ?? []}
			columns={columns}
			style={{ marginTop: '10px', marginBottom: '10px' }}
		/>
	)
}

export { DeviceListTable }

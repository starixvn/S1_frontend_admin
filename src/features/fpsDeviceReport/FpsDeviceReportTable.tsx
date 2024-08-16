import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { TablePaginationConfig, Typography } from 'antd'
import { TFpsReportData } from 'features/fpsDeviceReport/type'

interface IFpsDeviceReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	fpsReportList: TFpsReportData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	onAssociateAccountClick: (deviceId: string) => void
	onAssociateDevicesClick: (custId: number) => void
}

const FpsDeviceReportTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	fpsReportList,
	onTableChange,
	onAssociateAccountClick,
	onAssociateDevicesClick,
}: IFpsDeviceReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_LastUsedTime'),
			key: 'lastUsedTime',
			dataIndex: 'lastUsedTime',
			align: 'center' as 'center',
			width: '20%',
			render: (lastUsedTime: string) =>
				lastUsedTime
					? dayjs(lastUsedTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_SiteName'),
			key: 'siteName',
			dataIndex: 'siteName',
			align: 'center' as 'center',
			width: '20%',
			render: (siteName: string) => siteName || '-',
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			width: '10%',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Action'),
			key: 'action',
			dataIndex: 'action',
			align: 'center' as 'center',
			width: '10%',
			render: (action: string) => action || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			align: 'center' as 'center',
			width: '10%',
			render: (isoCode: string) => isoCode || '-',
		},
		{
			title: t('Label_DeviceId'),
			key: 'deviceId',
			dataIndex: 'deviceId',
			align: 'center' as 'center',
			width: '20%',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_RiskLevel'),
			key: 'riskLevel',
			dataIndex: 'riskLevel',
			align: 'center' as 'center',
			width: '10%',
			render: (riskLevel: string) => riskLevel || '-',
		},
		{
			title: t('Label_Browser'),
			key: 'browser',
			dataIndex: 'browser',
			align: 'center' as 'center',
			width: '10%',
			render: (browser: string) => browser || '-',
		},
		{
			title: t('Label_DeviceType'),
			key: 'deviceType',
			dataIndex: 'deviceType',
			align: 'center' as 'center',
			width: '10%',
			render: (deviceType: string) => deviceType || '-',
		},
		{
			title: t('Label_IpAddress'),
			key: 'ipAddress',
			dataIndex: 'ipAddress',
			align: 'center' as 'center',
			width: '10%',
			render: (ipAddress: string) => ipAddress || '-',
		},
		{
			title: t('Label_RobotTracking'),
			key: 'robotTracking',
			dataIndex: 'robotTracking',
			align: 'center' as 'center',
			width: '10%',
			render: (robotTracking: string) => robotTracking || '-',
		},
		{
			title: t('Label_AssociateDevices'),
			key: 'associateDevices',
			width: '5%',
			align: 'center' as 'center',
			render: (record: TFpsReportData) => {
				const { custId, associateDevices } = record
				return (
					<Typography.Link onClick={() => onAssociateDevicesClick(custId)}>
						{associateDevices}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_AssociateAccount'),
			key: 'associateCount',
			width: '5%',
			align: 'center' as 'center',
			render: (record: TFpsReportData) => {
				const { deviceId, associateCount } = record
				return (
					<Typography.Link onClick={() => onAssociateAccountClick(deviceId)}>
						{associateCount}
					</Typography.Link>
				)
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={fpsReportList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default FpsDeviceReportTable

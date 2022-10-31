import { IGetIpLogData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { Popconfirm, Typography } from 'antd'
import moment from 'moment'
import { timeFormat } from 'common/utils/format'
import { PermissionInterface } from 'type'

interface IPListTableProps {
	blockIPPermission: PermissionInterface | undefined
	ipList: IGetIpLogData[]
	loading: boolean
	timeZoneUtcOffset: number
	onUnblockClicked: (ip: string) => void
	onBlockClicked: (ip: string) => void
	onAccountClick: (ip: string) => void
}

const IpListTable = ({
	blockIPPermission,
	ipList,
	loading,
	timeZoneUtcOffset,
	onUnblockClicked,
	onBlockClicked,
	onAccountClick,
}: IPListTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetIpLogData) => {
				const { isBlock, loginIp } = record
				return isBlock ? (
					<Popconfirm
						disabled={!blockIPPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => onUnblockClicked(loginIp)}
					>
						<Typography.Link disabled={!blockIPPermission?.canUse}>
							{t('Label_Unlock')}
						</Typography.Link>
					</Popconfirm>
				) : (
					<Typography.Link
						disabled={!blockIPPermission?.canUse}
						onClick={() => onBlockClicked(loginIp)}
					>
						{t('Label_Block')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_LoginTime'),
			key: 'loginTime',
			dataIndex: 'loginTime',
			width: 120,
			align: 'center' as 'center',
			render: (loginTime: string) =>
				loginTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(loginTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_LoginIp'),
			key: 'loginIp',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetIpLogData) => {
				const { isBlock, loginIp } = record
				return isBlock ? (
					<Typography.Text type='danger'>{loginIp}</Typography.Text>
				) : (
					<Typography.Text type='success'>{loginIp}</Typography.Text>
				)
			},
		},
		{
			title: t('Label_AssociateAccount'),
			key: 'count',
			width: 60,
			align: 'center' as 'center',
			render: (record: IGetIpLogData) => {
				const { count, loginIp } = record
				return (
					<Typography.Link onClick={() => onAccountClick(loginIp)}>
						{count}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Location'),
			key: 'location',
			dataIndex: 'location',
			width: 120,
			align: 'center' as 'center',
			render: (location: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{location}
				</Typography.Text>
			),
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={ipList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={false}
		/>
	)
}

export { IpListTable }

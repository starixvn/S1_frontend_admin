import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { PaginationInterface } from 'common/hooks'
import { Popconfirm, Space, TablePaginationConfig, Tag, Typography } from 'antd'
import { IGetSMSInfoData } from 'features/memberProfile/type'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { PermissionInterface } from 'type'

interface ISmsInfoTableProps {
	smsInfoDeletePermission: PermissionInterface | undefined
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
	smsInfo: IGetSMSInfoData[]
	onDeleteMsg: (id: number) => void
	onViewClick: (record: IGetSMSInfoData) => void
}

const SmsInfoTable = ({
	smsInfoDeletePermission,
	loading,
	pagination,
	onTableChange,
	timeZoneUtcOffset,
	smsInfo,
	onDeleteMsg,
	onViewClick,
}: ISmsInfoTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: '15%',
			align: 'center' as 'center',
			render: (record: IGetSMSInfoData) => {
				const { id } = record
				return (
					<Space style={{ paddingLeft: '5px', paddingRight: '5px' }}>
						<Typography.Link onClick={() => onViewClick(record)}>
							{t('Label_View')}
						</Typography.Link>
						<Popconfirm
							disabled={!smsInfoDeletePermission?.canUse}
							title={t('Label_SureToDelete')}
							onConfirm={() => onDeleteMsg(id)}
						>
							<Typography.Link disabled={!smsInfoDeletePermission?.canUse}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Read'),
			key: 'read',
			dataIndex: 'flag',
			width: '10%',
			align: 'center' as 'center',
			render: (flag: boolean) => {
				return flag ? (
					<Tag icon={<CheckCircleOutlined />} color='success'>
						{t('Label_Read')}
					</Tag>
				) : (
					<Tag icon={<ClockCircleOutlined />} color='default'>
						{t('Label_UnRead')}
					</Tag>
				)
			},
		},
		{
			title: t('Label_Subject'),
			key: 'subject',
			dataIndex: 'title',
			width: '20%',
			align: 'center' as 'center',
			render: (title: string) => (
				<Typography.Text style={{ maxWidth: 180 }} ellipsis>
					{title}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Content'),
			key: 'content',
			dataIndex: 'contentRemoveTag',
			width: '25%',
			align: 'center' as 'center',
			render: (content: string) => (
				<Typography.Text style={{ maxWidth: 260 }} ellipsis>
					{content}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Sender'),
			key: 'sender',
			dataIndex: 'sender',
			width: '10%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: '20%',
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]
	return (
		<Table
			loading={loading}
			onChange={onTableChange}
			pagination={pagination as TablePaginationConfig}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={smsInfo ?? []}
			columns={columns}
			size='middle'
		/>
	)
}

export { SmsInfoTable }

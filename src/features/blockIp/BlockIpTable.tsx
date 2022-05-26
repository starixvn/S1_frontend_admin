import { FC } from 'react'
import moment from 'moment'
import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { useIsMounted } from 'usehooks-ts'
import { PaginationInterface } from 'common/hooks'
import { PermissionInterface } from 'type'
import { IBlockIpState } from './type'

interface IBlockIpTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	blockIpListData: IBlockIpState[]
	deletePermission?: PermissionInterface
	pagination: PaginationInterface
	onDeleteBlockIp: (ip: string) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const BlockIpTable: FC<IBlockIpTableProps> = ({
	loading,
	timeZoneUtcOffset,
	pagination,
	blockIpListData,
	deletePermission,
	onDeleteBlockIp,
	onTableChange,
}) => {
	const { t } = useTranslation()

	const isMounted = useIsMounted()

	if (!isMounted()) {
		return null
	}

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => (
				<Space>
					<Popconfirm
						disabled={!deletePermission?.canUse}
						title={t('Label_SureToDelete')}
						onConfirm={() => onDeleteBlockIp(values.ip)}
					>
						<Typography.Link disabled={!deletePermission?.canUse}>
							{t('Label_Delete')}
						</Typography.Link>
					</Popconfirm>
				</Space>
			),
		},
		{
			title: 'Ip',
			key: 'ip',
			dataIndex: 'ip',
			width: 120,
		},
		{
			title: 'Location',
			key: 'location',
			dataIndex: 'location',
			width: 120,
		},
		{
			title: 'Memo',
			key: 'memo',
			dataIndex: 'memo',
			width: 120,
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 140,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime
					? moment(createTime)
							.utcOffset(timeZoneUtcOffset)
							.format('YYYY-MM-DD  HH:mm:ss')
					: '',
		},
		{
			title: t('Label_Operator'),
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={blockIpListData}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default BlockIpTable

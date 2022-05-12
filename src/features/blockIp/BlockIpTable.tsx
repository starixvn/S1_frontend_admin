import React, { FC } from 'react'
import moment from 'moment'
import {
	Popconfirm,
	Space,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import { useIsMounted } from 'usehooks-ts'
import { PaginationInterface } from 'common/hooks'
import { IBlockIpState } from './type'

interface IBlockIpTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	blockIpListData: IBlockIpState[]
	pagination: PaginationInterface
	onDeleteBlockIp: (ip: string) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const BlockIpTable: FC<IBlockIpTableProps> = ({
	loading,
	timeZoneUtcOffset,
	pagination,
	blockIpListData,
	onDeleteBlockIp,
	onTableChange,
}) => {
	const { t } = useTranslation()

	const isMounted = useIsMounted()

	if (!isMounted()) {
		return null
	}

	const columns: any[] = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => (
				<Space>
					<Popconfirm
						title={t('Label_SureToDelete')}
						onConfirm={() => onDeleteBlockIp(values.ip)}
					>
						<Typography.Link>{t('Label_Delete')}</Typography.Link>
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
							.format('YYYY-MM-DD  hh:mm:ss')
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
				bordered
				rowKey={() => uuidV4()}
				size='small'
				scroll={{ x: 240 }}
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

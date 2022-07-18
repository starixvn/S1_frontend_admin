import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment'
import { PaginationInterface } from 'common/hooks'
import { ColumnsType } from 'antd/es/table'
import { IDepositPointReportListData } from './type'

interface IDepositPointReportTableProps {
	loading: boolean
	depositPointReportListData: IDepositPointReportListData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
}

const DepositPointReportTable: FC<IDepositPointReportTableProps> = ({
	loading,
	timeZoneUtcOffset,
	depositPointReportListData,
	pagination,
	onTableChange,
}) => {
	const { t } = useTranslation()

	const columns: ColumnsType<IDepositPointReportListData> = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaId',
			dataIndex: 'sabaId',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevelName',
			dataIndex: 'vipLevelName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DepositId'),
			key: 'transId',
			dataIndex: 'transId',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DepositAmount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 60,
			align: 'center' as 'center',
			render: (amount: number) =>
				amount > 0 ? numberFormatter.format(amount) : '-',
		},
		{
			title: t('Label_PointEarned'),
			key: 'pointEarned',
			dataIndex: 'pointEarned',
			width: 60,
			align: 'center' as 'center',
			sorter: (rowA, rowB) => rowA.pointEarned - rowB.pointEarned,
			render: (pointEarned: number) =>
				pointEarned > 0 ? numberFormatter.format(pointEarned) : '-',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime
					? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: 250,
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={depositPointReportListData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}
export { DepositPointReportTable }

import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment'
import { PaginationInterface } from 'common/hooks'
import { ColumnsType } from 'antd/es/table'
import { find } from 'lodash'
import { IAdjustmentListData } from './type'
import { adjustTypeList } from './constants'

interface IAdjustmentPointReportTableProps {
	loading: boolean
	adjustmentListData: IAdjustmentListData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
}

const AdjustmentPointReportTable: FC<IAdjustmentPointReportTableProps> = ({
	loading,
	timeZoneUtcOffset,
	adjustmentListData,
	pagination,
	onTableChange,
}) => {
	const { t } = useTranslation()

	const columns: ColumnsType<IAdjustmentListData> = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
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
			title: t('Label_AdjustType'),
			key: 'adjustType',
			dataIndex: 'adjustType',
			width: 80,
			align: 'center' as 'center',
			render: (adjustType: number) => {
				const currentType = find(adjustTypeList, obj => obj.type === adjustType)
				return currentType ? t(currentType.displayKey) : ''
			},
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
			title: t('Label_CreateTime'),
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
				dataSource={adjustmentListData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}
export { AdjustmentPointReportTable }

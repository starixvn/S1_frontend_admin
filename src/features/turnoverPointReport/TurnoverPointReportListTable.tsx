import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { trimEnd } from 'lodash'
import { numberFormatter } from 'common/utils/format'
import dayjs from 'dayjs'
import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig } from 'antd'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { ITurnoverPointListData } from 'features/turnoverPointReport/type'
import { ColumnsType } from 'antd/es/table'

interface ITurnoverPointReportTableProps {
	timeZoneUtcOffset: number
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	turnoverPointReportListData: ITurnoverPointListData[]
}

const TurnoverPointReportListTable: FC<ITurnoverPointReportTableProps> = ({
	timeZoneUtcOffset,
	loading,
	pagination,
	onTableChange,
	turnoverPointReportListData,
}) => {
	const { t } = useTranslation()
	const columns: ColumnsType<ITurnoverPointListData> = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 100,
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
			render: (sabaId: string) => sabaId ?? 'N/A',
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevelName',
			dataIndex: 'vipLevelName',
			width: 100,
			align: 'center' as 'center',
			render: (vipLevelName: string) =>
				trimEnd(vipLevelName.toUpperCase(), 'CLUB'),
		},
		{
			title: t('Label_Category'),
			key: 'tpCategoryName',
			dataIndex: 'tpCategoryName',
			width: 100,
			align: 'center' as 'center',
			render: tpCategoryName => tpCategoryName ?? 'N/A',
		},
		{
			title: t('Label_PointEarned'),
			key: 'pointEarned',
			dataIndex: 'pointEarned',
			width: 80,
			align: 'center' as 'center',
			sorter: (rowA, rowB) => rowA.pointEarned - rowB.pointEarned,
			render: (pointEarned: number) =>
				pointEarned > 0 ? numberFormatter.format(pointEarned) : '-',
		},
		{
			title: t('Label_RefId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 140,
			align: 'center' as 'center',
			render: (createTime: string) =>
				dayjs(createTime)
					.utcOffset(timeZoneUtcOffset)
					.format('YYYY-MM-DD  HH:mm:ss'),
		},
		{
			title: t('Label_SettledDate'),
			key: 'settleDate',
			dataIndex: 'settleDate',
			width: 100,
			align: 'center' as 'center',
			render: (settleDate: string) => settleDate ?? '',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={turnoverPointReportListData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { TurnoverPointReportListTable }

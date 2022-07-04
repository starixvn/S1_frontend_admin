import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig } from 'antd'
import { PaginationInterface } from 'common/hooks'
import moment from 'moment'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { IGetMemberRewardPointLogData } from '../type'

interface IMemberListLogTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	memberLogData: IGetMemberRewardPointLogData[]
	timeZoneUtcOffset: number
}

const MemberListLogTable: FC<IMemberListLogTableProps> = ({
	loading,
	pagination,
	onTableChange,
	memberLogData,
	timeZoneUtcOffset,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Time'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime
					? moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
		{
			title: t('Label_ReferId'),
			key: 'refTransId',
			dataIndex: 'refTransId',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Type'),
			key: 'typeName',
			dataIndex: 'typeName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PointUpdate'),
			key: 'changePoint',
			dataIndex: 'changePoint',
			width: 120,
			align: 'center' as 'center',
			render: (changePoint: number) => numberFormatter.format(changePoint),
		},
		{
			title: t('Label_PointBalance'),
			key: 'afterPoint',
			dataIndex: 'afterPoint',
			width: 80,
			align: 'center' as 'center',
			render: (afterPoint: number) => numberFormatter.format(afterPoint),
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 120,
			align: 'center' as 'center',
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={memberLogData ?? []}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}
export { MemberListLogTable }

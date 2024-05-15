import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { IGetRewardPointLogData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { isEmpty } from 'lodash'

interface IRewardPointLogTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	rewardPointLog: IGetRewardPointLogData[]
}

const RewardPointLogTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
	rewardPointLog,
}: IRewardPointLogTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_RefId'),
			key: 'refTransId',
			dataIndex: 'refTransId',
			width: 100,
			align: 'center' as 'center',
			render: (refId: string) => (!isEmpty(refId) ? refId : '-'),
		},
		{
			title: t('Label_Type'),
			key: 'typeName',
			dataIndex: 'typeName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ChangePoint'),
			key: 'changePoint',
			dataIndex: 'changePoint',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_After') + t('Label_Point'),
			key: 'afterPoint',
			dataIndex: 'afterPoint',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Time'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
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
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: 200,
		},
	]
	return (
		<Table
			loading={loading}
			pagination={pagination as TablePaginationConfig}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={rewardPointLog ?? []}
			onChange={onTableChange}
			columns={columns}
		/>
	)
}

export { RewardPointLogTable }

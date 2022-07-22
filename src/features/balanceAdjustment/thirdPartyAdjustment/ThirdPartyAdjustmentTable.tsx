import { FC } from 'react'
import { Table, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { find } from 'lodash'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { adjustmentTypeList, TP_LOG_STATUSES } from './constants'
import { ITpLogData } from './type'

interface IThirdPartyAdjustmentTableProps {
	tpLog: ITpLogData[]
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const ThirdPartyAdjustmentTable: FC<IThirdPartyAdjustmentTableProps> = ({
	tpLog,
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_3RDParty'),
			key: 'tpName',
			dataIndex: 'tpName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AdjustmentType'),
			key: 'direction',
			dataIndex: 'direction',
			width: 80,
			align: 'center' as 'center',
			render: (direction: number) => {
				const displayKey = find(adjustmentTypeList, {
					id: direction,
				})?.displayKey
				return displayKey ? t(displayKey) : 'N/A'
			},
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 80,
			align: 'center' as 'center',
			render: (amount: number) => numberFormatter.format(amount),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (status: number) => {
				const statuses = {
					[TP_LOG_STATUSES.Success]: t('System.Label_Success'),
					[TP_LOG_STATUSES.Fail]: t('System.Label_Failed'),
					[TP_LOG_STATUSES.Pending]: t('Label_Pending'),
					[TP_LOG_STATUSES.PendingD]: t('Label_Pending'),
				}

				return statuses[status]
			},
		},
		{
			title: t('Label_AdjustmentReason'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			width: 140,
			align: 'center' as 'center',
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
			key: 'Operator',
			dataIndex: 'Operator',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Remarks'),
			key: 'remarks',
			dataIndex: 'remarks',
			width: 80,
			align: 'center' as 'center',
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
	]

	return (
		<LayoutContent.Card>
			<Table
				size='small'
				loading={loading}
				columns={columns}
				dataSource={tpLog ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default ThirdPartyAdjustmentTable

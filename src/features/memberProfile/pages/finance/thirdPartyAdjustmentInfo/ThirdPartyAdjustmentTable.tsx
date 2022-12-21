import moment from 'moment'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetTpAdjustmentLogData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { thirdPartyAdjustTypeList } from 'features/memberProfile/constants'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography

interface ThirdPartyAdjustmentTableProps {
	tpAdjustmentLogList: IGetTpAdjustmentLogData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	statusList: IEnumTypeData[]
}
const ThirdPartyAdjustmentTable = ({
	tpAdjustmentLogList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	statusList,
}: ThirdPartyAdjustmentTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_CreatedDate'),
			key: 'CreatedDate',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_TrxnID'),
			key: 'TrxnID',
			dataIndex: 'transId',
			width: 100,
			align: 'center' as 'center',
			render: (transId: string) => transId ?? '-',
		},
		{
			title: t('Label_Status'),
			key: 'Status',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) =>
				statusList.map(({ value, name }) => value === status && name),
		},
		{
			title: t('Label_3RDParty'),
			key: '3RDParty',
			dataIndex: 'tpName',
			width: 100,
			align: 'center' as 'center',
			render: (tpName: number) => tpName ?? '-',
		},
		{
			title: t('Label_AdjustmentType'),
			key: 'AdjustmentType',
			dataIndex: 'direction',
			width: 100,
			align: 'center' as 'center',
			render: (direction: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{thirdPartyAdjustTypeList.map(
						({ value, displayName }) => value === direction && t(displayName)
					)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Amount'),
			key: 'Amount',
			dataIndex: 'amount',
			width: 100,
			align: 'center' as 'center',
			render: (amount: number) => (
				<Text
					type={isPositiveNum(amount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numberFormatter.format(amount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_Reason'),
			key: 'Reason',
			dataIndex: 'categoryName',
			width: 100,
			align: 'center' as 'center',
			render: (categoryName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{categoryName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_DepositId'),
			key: 'DepositId',
			dataIndex: 'depositId',
			width: 100,
			align: 'center' as 'center',
			render: (depositId: number) => depositId ?? '-',
		},
		{
			title: t('Label_Remark'),
			key: 'Remark',
			dataIndex: 'memo',
			width: 100,
			align: 'center' as 'center',
			render: (memo: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{memo ?? '-'}
				</Typography.Text>
			),
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={tpAdjustmentLogList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default ThirdPartyAdjustmentTable

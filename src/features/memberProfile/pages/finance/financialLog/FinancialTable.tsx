import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import moment from 'moment'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IFinancialLogData } from 'features/memberProfile/type'
import { financialTypeOptions } from 'features/memberProfile/constants'

interface FinancialTableProps {
	financialLogs: IFinancialLogData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
}
const FinancialTable = ({
	financialLogs,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
}: FinancialTableProps) => {
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
			title: t('Label_Type'),
			dataIndex: 'financialType',
			key: 'financialType',
			align: 'center' as 'center',
			render: (financialType: number) =>
				financialTypeOptions.map(
					item => item.value === financialType && item.name
				),
		},
		{
			title: t('Label_BeforeAmount'),
			dataIndex: 'beforeAmount',
			key: 'beforeAmount',
			align: 'center' as 'center',
		},
		{
			title: t('Label_ChangeAmount'),
			dataIndex: 'changeAmount',
			key: 'changeAmount',
			align: 'center' as 'center',
		},
		{
			title: t('Label_AfterAmount'),
			dataIndex: 'afterAmount',
			key: 'afterAmount',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Memo'),
			dataIndex: 'memo',
			key: 'memo',
			align: 'center' as 'center',
			render: (memo: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{memo ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_RefTransId'),
			dataIndex: 'refTransId',
			key: 'refTransId',
			align: 'center' as 'center',
			render: (refTransId: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{refTransId ?? '-'}
				</Typography.Text>
			),
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={financialLogs ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default FinancialTable

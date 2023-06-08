import moment from 'moment'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IFinancialLogData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { isPositiveNum } from 'common/utils'
import type { PaginationProps } from 'antd'

const { Text } = Typography
interface FinancialTableProps {
	financialLogs: IFinancialLogData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	typeList: IEnumTypeData[]
}
const FinancialTable = ({
	financialLogs,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	typeList,
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
				typeList.map(({ value, name }) => value === financialType && name),
		},
		{
			title: t('Label_BeforeAmount'),
			dataIndex: 'beforeAmount',
			key: 'beforeAmount',
			align: 'center' as 'center',
			render: (beforeAmount: number) => (
				<Text
					type={isPositiveNum(beforeAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(beforeAmount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_ChangeAmount'),
			key: 'changeAmount',
			align: 'center' as 'center',
			render: (records: { changeAmount: number; direction: number }) => {
				const { changeAmount, direction } = records
				// 後端回傳direction參數:1代表'+' 2代表'-'
				const sign = direction === 1 ? '+' : '-'
				return (
					<Text
						type={direction === 1 ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{sign}
						{numFormatToDigits(changeAmount)}
					</Text>
				)
			},
		},
		{
			title: t('Label_AfterAmount'),
			dataIndex: 'afterAmount',
			key: 'afterAmount',
			align: 'center' as 'center',
			render: (afterAmount: number) => (
				<Text
					type={isPositiveNum(afterAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(afterAmount || 0)}
				</Text>
			),
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

	const showTotal: PaginationProps['showTotal'] = total =>
		`Total ${total} items`

	return (
		<Table
			loading={loading}
			dataSource={financialLogs ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={
				{
					pagination,
					showTotal,
					position: ['topRight'],
				} as TablePaginationConfig
			}
			onChange={onTableChange}
		/>
	)
}

export default FinancialTable

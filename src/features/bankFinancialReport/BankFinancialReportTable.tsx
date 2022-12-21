import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter } from 'common/utils/format'
import { ITableColumnsInfo } from 'features/bankFinancialReport/type'
import { TableConverter } from 'features/bankFinancialReport/utils'
import { Table, TablePaginationConfig, Typography } from 'antd'
import { PAGINATION } from 'common/hooks'
import { AlignType } from 'rc-table/lib/interface'
import { isPositiveNum } from 'common/utils'

interface IBankFinancialReportTableProps {
	loading: boolean
	tableColumnInfo: ITableColumnsInfo[]
	tableData: object[]
}
const BankFinancialReportTable = ({
	loading,
	tableColumnInfo,
	tableData,
}: IBankFinancialReportTableProps) => {
	const { t } = useTranslation()
	const baseColumns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'displayName',
			align: 'left' as AlignType,
			width: 350,
			fixed: 'left',
			render: (displayName: string) => (
				<Typography.Text style={{ padding: '5px' }}>
					{displayName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_OpenBalance'),
			key: 'openBalance',
			dataIndex: 'openBalance',
			width: 150,
			align: 'right' as AlignType,
			render: (openBalance: number) =>
				isPositiveNum(openBalance) ? (
					numberFormatter.format(openBalance)
				) : (
					<Typography.Text type='danger'>
						{numberFormatter.format(openBalance)}
					</Typography.Text>
				),
		},
		{
			title: t('Label_ClosingBalance'),
			key: 'closingBalance',
			dataIndex: 'closingBalance',
			align: 'right' as AlignType,
			width: 150,
			render: (closingBalance: number) =>
				isPositiveNum(closingBalance) ? (
					numberFormatter.format(closingBalance)
				) : (
					<Typography.Text type='danger'>
						{numberFormatter.format(closingBalance)}
					</Typography.Text>
				),
		},
		{
			title: t('Label_NetBalance'),
			key: 'netBalance',
			dataIndex: 'netBalance',
			width: 150,
			align: 'right' as AlignType,
			render: (netBalance: number) =>
				isPositiveNum(netBalance) ? (
					numberFormatter.format(netBalance)
				) : (
					<Typography.Text type='danger'>
						{numberFormatter.format(netBalance)}
					</Typography.Text>
				),
		},
		{
			title: t('Label_Fee'),
			key: 'fees',
			dataIndex: 'fees',
			width: 150,
			align: 'right' as AlignType,
			render: (fees: number) =>
				isPositiveNum(fees) ? (
					numberFormatter.format(fees)
				) : (
					<Typography.Text type='danger'>
						{numberFormatter.format(fees)}
					</Typography.Text>
				),
		},
	]

	const mergedColumn = TableConverter.tableColumnConverter(
		baseColumns,
		tableColumnInfo
	)

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				scroll={{ y: 800, x: 240 }}
				columns={mergedColumn}
				dataSource={tableData}
				expandable={{ expandRowByClick: true }}
				size='small'
				pagination={
					{
						position: PAGINATION.position,
						pageSize: PAGINATION.defaultPageSize,
					} as TablePaginationConfig
				}
				bordered
			/>
		</LayoutContent.Card>
	)
}

export { BankFinancialReportTable }

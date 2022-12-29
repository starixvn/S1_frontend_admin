import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { TablePaginationConfig, Typography } from 'antd'
import { PAGINATION } from 'common/hooks'
import { Table } from 'components'

interface IWithdrawalPaymentReportTableProps {
	loading: boolean
	tableData: object[]
}

const WithdrawalPaymentReportTable = ({
	loading,
	tableData,
}: IWithdrawalPaymentReportTableProps) => {
	const { t } = useTranslation()
	const baseColumns: any = [
		{
			title: '',
			key: 'displayName',
			dataIndex: 'displayName',
			align: 'center' as 'center',
			width: '20%',
			fixed: 'left',
			render: (displayName: string) => (
				<Typography.Text style={{ padding: '5px' }}>
					{displayName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_TotalWithdrawalCount'),
			key: 'totalWithdrawalCount',
			dataIndex: 'totalWithdrawalCount',
			align: 'center' as 'center',
			width: '20%',
			render: (totalWithdrawalCount: number) => totalWithdrawalCount ?? 'N/A',
		},
		{
			title: t('Label_TotalWithdrawalAmount'),
			key: 'totalWithdrawalAmount',
			dataIndex: 'totalWithdrawalAmount',
			width: '20%',
			align: 'center' as 'center',
			render: (totalWithdrawalAmount: number) => totalWithdrawalAmount ?? 'N/A',
		},
		{
			title: t('Label_AverageWithdrawalTime'),
			key: 'averageWithdrawalAmount',
			dataIndex: 'averageWithdrawalAmount',
			align: 'center' as 'center',
			width: '20%',
			render: (averageWithdrawalAmount: number) =>
				averageWithdrawalAmount ?? 'N/A',
		},
		{
			title: t('Label_AverageProcessingTime'),
			key: 'averageProcessingTime',
			dataIndex: 'averageProcessingTime',
			width: '20%',
			align: 'center' as 'center',
			// 這裡平均時間非時間格式 直接印出
			render: (averageProcessingTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{averageProcessingTime ?? '-'}
				</Typography.Text>
			),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={baseColumns}
				dataSource={tableData}
				expandable={{ expandRowByClick: true }}
				pagination={
					{
						position: PAGINATION.position,
						pageSize: PAGINATION.defaultPageSize,
					} as TablePaginationConfig
				}
			/>
		</LayoutContent.Card>
	)
}

export default WithdrawalPaymentReportTable

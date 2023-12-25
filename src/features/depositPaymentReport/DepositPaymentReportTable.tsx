import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { TablePaginationConfig, Typography } from 'antd'
import { numberFormatter } from 'common/utils/format'
import { PAGINATION } from 'common/hooks'
import { Table } from 'components'

interface IDepositPaymentReportTableProps {
	loading: boolean
	tableData: object[]
}

const DepositPaymentReportTable = ({
	loading,
	tableData,
}: IDepositPaymentReportTableProps) => {
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
			title: t('Label_SiteName'),
			key: 'siteName',
			dataIndex: 'siteName',
			align: 'center' as 'center',
			width: '20%',
			render: (siteName: string) => siteName ?? '-',
		},

		{
			title: t('Label_TotalDepositCount'),
			key: 'totalDepositCount',
			dataIndex: 'totalDepositCount',
			align: 'center' as 'center',
			width: '15%',
			render: (totalDepositCount: number) => totalDepositCount ?? 'N/A',
		},
		{
			title: t('Label_TotalDepositAmount'),
			key: 'totalDepositAmount',
			dataIndex: 'totalDepositAmount',
			width: '15%',
			align: 'center' as 'center',
			render: (totalDepositAmount: number) =>
				numberFormatter.format(totalDepositAmount) ?? 'N/A',
		},
		{
			title: t('Label_AverageDepositTime'),
			key: 'averageDepositAmount',
			dataIndex: 'averageDepositAmount',
			align: 'center' as 'center',
			width: '15%',
			render: (averageDepositAmount: number) =>
				numberFormatter.format(averageDepositAmount) ?? 'N/A',
		},
		{
			title: t('Label_FirstDepositCount'),
			key: 'firstDepositCount',
			dataIndex: 'firstDepositCount',
			width: '15%',
			align: 'center' as 'center',
			render: (firstDepositCount: number) => firstDepositCount ?? 'N/A',
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

export default DepositPaymentReportTable

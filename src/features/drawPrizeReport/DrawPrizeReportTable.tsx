import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { IDrawPrizeReport } from 'features/drawPrizeReport/type'
import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'

interface IDrawPrizeReportTableProps {
	loading: boolean
	drawPrizeReportTableData: IDrawPrizeReport[]
	pagination: PaginationInterface
	onDetailClicked: (record: IDrawPrizeReport) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const DrawPrizeReportTable = ({
	loading,
	pagination,
	drawPrizeReportTableData,
	onDetailClicked,
	onTableChange,
}: IDrawPrizeReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_EventDate'),
			key: 'eventDate',
			dataIndex: 'eventDate',
			width: 100,
			align: 'center' as 'center',
			render: (eventDate: string) => eventDate ?? '-',
		},
		{
			title: t('Label_EventName'),
			key: 'eventName',
			dataIndex: 'eventName',
			width: 100,
			align: 'center' as 'center',
			render: (eventName: string) => eventName ?? '-',
		},
		{
			title: t('Label_PrizeName'),
			key: 'prizeName',
			dataIndex: 'prizeName',
			width: 100,
			align: 'center' as 'center',
			render: (prizeName: string) => prizeName ?? '-',
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 120,
			align: 'center' as 'center',
			render: (amount: number) => numberFormatter.format(amount),
		},
		{
			title: t('Label_UsedQuantity'),
			key: 'usedQuantity',
			dataIndex: 'usedQuantity',
			width: 80,
			align: 'center' as 'center',
			render: (usedQuantity: number) => numberFormatter.format(usedQuantity),
		},
		{
			title: t('Label_ListOfWinner'),
			key: 'listOfWinner',
			width: 80,
			align: 'center' as 'center',
			render: (record: IDrawPrizeReport) => (
				<Typography.Link onClick={() => onDetailClicked(record)}>
					{t('Label_Detail')}
				</Typography.Link>
			),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				dataSource={drawPrizeReportTableData}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { DrawPrizeReportTable }

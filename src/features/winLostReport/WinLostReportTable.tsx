import { Space, Table, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PAGINATION } from 'common/hooks'
import { tableColumnConverter } from 'features/winLostReport/utils'
import {
	useVisibilityColumnsButtonHook,
	VisibilityColumnsButton,
} from 'components'

interface IWinLostReportTableProps {
	loading: boolean
	tableList: object[]
	onExpand: (expanded: boolean, record: object) => void
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: any
	) => void
}

const WinLostReportTable = ({
	loading,
	tableList,
	onExpand,
	onTableChange,
}: IWinLostReportTableProps) => {
	const { onChangeVisibilityColumns, onGetVisibilityColumns } =
		useVisibilityColumnsButtonHook()

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				scroll={{ y: 800, x: undefined }}
				columns={onGetVisibilityColumns(tableColumnConverter(tableList))}
				dataSource={tableList}
				size='small'
				pagination={
					{
						position: PAGINATION.position,
						pageSize: PAGINATION.defaultPageSize,
					} as TablePaginationConfig
				}
				onChange={onTableChange}
				bordered
				// eslint-disable-next-line react/no-unstable-nested-components
				title={() => (
					<Space align='end' direction='vertical' style={{ width: '100%' }}>
						<VisibilityColumnsButton
							baseColumns={tableColumnConverter(tableList)}
							onTableVisibilityColumnsChange={onChangeVisibilityColumns}
						/>
					</Space>
				)}
				expandable={{
					onExpand: (expanded, record) => onExpand(expanded, record),
				}}
			/>
		</LayoutContent.Card>
	)
}

export default WinLostReportTable

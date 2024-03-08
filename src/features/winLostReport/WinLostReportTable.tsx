import React from 'react'
import { Space, Table, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { tableColumnConverter } from 'features/winLostReport/utils'
import {
	useVisibilityColumnsButtonHook,
	VisibilityColumnsButton,
} from 'components'

interface IWinLostReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	tableList: object[]
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: any
	) => void
}

const WinLostReportTable = ({
	loading,
	pagination,
	tableList,
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
				pagination={pagination as TablePaginationConfig}
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
			/>
		</LayoutContent.Card>
	)
}

export default WinLostReportTable

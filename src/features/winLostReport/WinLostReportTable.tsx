import React from 'react'
import { Space, Table, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { tableColumnConverter } from 'features/winLostReport/utils'
import {
	useVisibilityColumnsButtonHook,
	VisibilityColumnsButton,
} from 'components'
import { filter } from 'lodash'

interface IWinLostReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	tableList: object[]
	expandList: Array<string | number>
	setExpandList: React.Dispatch<React.SetStateAction<any>>
	onExpand: (expanded: boolean, record: object) => void
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
	expandList,
	setExpandList,
	onExpand,
	onTableChange,
}: IWinLostReportTableProps) => {
	const { onChangeVisibilityColumns, onGetVisibilityColumns } =
		useVisibilityColumnsButtonHook()

	const columns = tableColumnConverter(tableList)
	const hiddenKeys = new Set(['baPlayerWinLoss', 'commission', 'baCommission'])
	const initialColumns = filter(columns, ({ key }) => !hiddenKeys.has(key))

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				scroll={{ y: 800, x: undefined }}
				columns={onGetVisibilityColumns(columns)}
				dataSource={tableList}
				size='small'
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				bordered
				// eslint-disable-next-line react/no-unstable-nested-components
				title={() => (
					<Space align='end' direction='vertical' style={{ width: '100%' }}>
						<VisibilityColumnsButton
							baseColumns={columns}
							onTableVisibilityColumnsChange={onChangeVisibilityColumns}
							initialColumns={initialColumns}
						/>
					</Space>
				)}
				expandable={{
					onExpand: (expanded, record) => onExpand(expanded, record),
					defaultExpandedRowKeys: [],
					expandedRowKeys: expandList,
					onExpandedRowsChange: expandedKeys => {
						setExpandList(expandedKeys)
					},
				}}
			/>
		</LayoutContent.Card>
	)
}

export default WinLostReportTable

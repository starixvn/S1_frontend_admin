import { FC } from 'react'
import { Table, TablePaginationConfig, TableProps } from 'antd'
import { PAGINATION } from 'common/hooks'

const BaseTable: FC<TableProps<any>> = ({ children, ...props }) => {
	return (
		<Table
			bordered
			rowClassName='editable-row'
			size='small'
			scroll={{ x: 240 }}
			pagination={
				{
					position: PAGINATION.position,
					pageSize: PAGINATION.defaultPageSize,
				} as TablePaginationConfig
			}
			{...props}
		/>
	)
}

export { BaseTable as Table }

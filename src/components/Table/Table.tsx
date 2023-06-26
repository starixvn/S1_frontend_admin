import { FC } from 'react'
import { Table, TablePaginationConfig, TableProps } from 'antd'
import { PAGINATION } from 'common/hooks'

const BaseTable: FC<TableProps<any>> = ({ children, pagination, ...props }) => {
	return (
		<Table
			bordered
			rowClassName='editable-row'
			size='small'
			scroll={{ x: 240 }}
			pagination={
				{
					position: PAGINATION.position,
					defaultPageSize: PAGINATION.defaultPageSize,
					...pagination,
				} as TablePaginationConfig
			}
			{...props}
		/>
	)
}

export { BaseTable as Table }

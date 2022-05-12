import { FC } from 'react'
import { Table, TableProps } from 'antd'
import { v4 as uuidV4 } from 'uuid'

const BaseTable: FC<TableProps<{}>> = ({ children, ...props }) => {
	return (
		<Table
			bordered
			rowKey={() => uuidV4()}
			size='small'
			scroll={{ x: 240 }}
			{...props}
		/>
	)
}

export { BaseTable as Table }

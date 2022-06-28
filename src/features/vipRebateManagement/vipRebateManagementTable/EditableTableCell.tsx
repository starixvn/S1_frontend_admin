import { Form, Input } from 'antd'
import { FC } from 'react'
import { IRebateTableData } from '../type'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean
	dataIndex: string
	title: any
	inputType: 'number' | 'text'
	record: IRebateTableData
	index: number
}

const EditableTableCell: FC<EditableCellProps> = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <Input type='number' /> : <Input />

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item name={dataIndex} style={{ margin: 0 }}>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	)
}

export { EditableTableCell }

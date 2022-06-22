import { Form, Input } from 'antd'

interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
	editing: boolean
	dataIndex: string
	title: any
	inputType: 'number' | 'text' | null
	record: T
	index: number
	children: React.ReactNode
}

const EditableCellRows: <T>(props: EditableCellProps<T>) => any = ({
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
				<Form.Item
					rules={[
						{
							required: true,
						},
					]}
					name={dataIndex}
					style={{ margin: 0, minWidth: 60 }}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	)
}

export { EditableCellRows }

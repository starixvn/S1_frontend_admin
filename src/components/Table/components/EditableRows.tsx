import { Form, Input, InputNumber } from 'antd'

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
	const inputNode =
		inputType === 'number' ? (
			<InputNumber style={{ width: '100%' }} controls={false} type='number' />
		) : (
			<Input />
		)

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					rules={
						inputType === 'number'
							? [
									{
										required: true,
										message: '',
									},
									{
										type: 'number',
										min: 0,
										message: '',
									},
							  ]
							: [
									{
										required: true,
										message: '',
									},
							  ]
					}
					name={dataIndex}
					style={{ margin: 0, minWidth: 60 }}
				>
					{inputNode}
				</Form.Item>
			) : (
				<div style={{ padding: '5px 0' }}>{children}</div>
			)}
		</td>
	)
}

export { EditableCellRows }

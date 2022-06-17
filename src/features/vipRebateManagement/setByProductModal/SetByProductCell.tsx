import { Form, Input, Button, InputRef, FormInstance } from 'antd'
import { useEffect, useRef, FC, useState } from 'react'
import { GameRebateEditData, IGameRebateTableData } from '../type'

interface EditableCellProps {
	dataIndex: keyof IGameRebateTableData
	record: IGameRebateTableData
	form: FormInstance<any>
	editable: boolean
	editList: GameRebateEditData[] | undefined
	handleEndEdit: (value: IGameRebateTableData) => void
}

const SetByProductCell: FC<EditableCellProps> = ({
	children,
	dataIndex,
	record,
	form,
	editable,
	editList,
	handleEndEdit,
	...restProps
}) => {
	const inputRef = useRef<InputRef>(null)
	const [editing, setEditing] = useState(false)
	const toggleEdit = () => {
		form.resetFields()
		setEditing(!editing)
		form.setFieldsValue({
			gameTypeName: record.gameTypeName,
			gameType: record.gameType,
			[dataIndex]: record[dataIndex],
		})
	}
	const endEditing = () => {
		const value: IGameRebateTableData = form.getFieldsValue(true)
		handleEndEdit(value)
		toggleEdit()
	}
	useEffect(() => {
		if (editing) {
			inputRef.current!.focus()
		}
	}, [editing])

	let childNode = children

	if (editable) {
		childNode = editing ? (
			<Form.Item style={{ margin: 0 }} name={dataIndex}>
				<Input
					type='number'
					ref={inputRef}
					onPressEnter={endEditing}
					onBlur={endEditing}
				/>
			</Form.Item>
		) : (
			<Button type='text' onClick={toggleEdit}>
				{children}
			</Button>
		)
	}

	return <td {...restProps}>{childNode}</td>
}

export { SetByProductCell }

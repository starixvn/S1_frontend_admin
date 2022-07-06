import { Form, Input, InputRef } from 'antd'
import { useFormContext } from 'common/context'
import React, { FC, useEffect, useRef, useState } from 'react'

interface EditableCellProps {
	title: React.ReactNode
	editable: boolean
	dataIndex: any
	record: any
	inputType: 'text' | 'number' | null
	handleSave: (record: any) => void
}

const EditableCell: FC<EditableCellProps> = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	inputType,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false)
	const inputRef = useRef<InputRef>(null)
	const form = useFormContext()

	useEffect(() => {
		if (editing) {
			inputRef.current!.focus()
		}
	}, [editing])

	const toggleEdit = () => {
		setEditing(!editing)
		form?.setFieldsValue({ [dataIndex]: record[dataIndex] })
	}

	const save = async () => {
		form
			?.validateFields()
			.then(values => {
				handleSave({ ...record, ...values })
			})
			.finally(() => {
				toggleEdit()
			})
	}

	let childNode = children

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{ margin: 0, width: 60 }}
				name={dataIndex}
				rules={[
					{
						required: true,
						message: `${title} is required.`,
					},
				]}
			>
				<Input
					ref={inputRef}
					onPressEnter={save}
					onBlur={save}
					type={inputType === 'number' ? 'number' : 'text'}
				/>
			</Form.Item>
		) : (
			// NODE: aria-hidden="true" for fixed "click-events-have-key-events" rules
			<div onClick={toggleEdit} aria-hidden='true'>
				{children}
			</div>
		)
	}

	return <td {...restProps}>{childNode}</td>
}

export { EditableCell }

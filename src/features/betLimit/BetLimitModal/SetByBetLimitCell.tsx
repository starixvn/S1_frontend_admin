import { useTranslation } from 'react-i18next'
import { ITpCategoryListData } from 'features/betLimit/type'
import React, { useEffect, useRef, FC, useState } from 'react'
import { Form, Input, InputRef, FormInstance, Space } from 'antd'

interface EditableCellProps {
	dataIndex: keyof ITpCategoryListData
	record: ITpCategoryListData
	form: FormInstance<any>
	editable: boolean
	handleEndEdit: (
		key: string,
		min: number,
		max: number,
		maxPerMatch: number
	) => void
}

const SetByBetLimitCell: FC<EditableCellProps> = ({
	children,
	dataIndex,
	record,
	form,
	editable,
	handleEndEdit,
	...restProps
}) => {
	const { t } = useTranslation()
	const inputRef = useRef<InputRef>(null)
	const [editing, setEditing] = useState(false)
	const toggleEdit = () => {
		if (record.isGroup) return
		setEditing(!editing)
		// 第一次編輯回拿不到 form 裡的值 故預設值拿 record 裡的值
		const {
			min = record.limitInput.min,
			max = record.limitInput.max,
			maxPerMatch = record.limitInput.maxPerMatch,
		} = form.getFieldsValue()

		form.setFieldsValue({
			min,
			max,
			maxPerMatch,
		})
	}
	const endEditing = () => {
		const { min, max, maxPerMatch } = form.getFieldsValue()
		const { key } = record
		handleEndEdit(key, min, max, maxPerMatch)
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
			<Space>
				<Form.Item
					name='min'
					label={t('Label_Min')}
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_Min'),
							}),
						},
					]}
				>
					{/* 沒有使用 onBlur 是因為不是單一 Input 框會有預期外的錯誤 */}
					<Input type='number' ref={inputRef} onPressEnter={endEditing} />
				</Form.Item>
				<Form.Item
					name='max'
					label={t('Label_Max')}
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_Max'),
							}),
						},
					]}
				>
					<Input type='number' onPressEnter={endEditing} />
				</Form.Item>
				<Form.Item
					name='maxPerMatch'
					label={t('Label_MaxPerMatch')}
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_MaxPerMatch'),
							}),
						},
					]}
				>
					<Input type='number' onPressEnter={endEditing} />
				</Form.Item>
			</Space>
		) : (
			// NODE: aria-hidden="true" for fixed "click-events-have-key-events" rules
			<div onClick={toggleEdit} aria-hidden='true'>
				{children}
			</div>
		)
	}

	return <td {...restProps}>{childNode}</td>
}

export { SetByBetLimitCell }

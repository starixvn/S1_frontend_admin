import { useTranslation } from 'react-i18next'
import { IEditForm, ITpCategoryListData } from 'features/betLimit/type'
import React, { useEffect, useRef, FC, useState } from 'react'
import { Form, Input, InputRef, FormInstance, Space } from 'antd'

interface EditableCellProps {
	dataIndex: keyof ITpCategoryListData
	record: ITpCategoryListData
	form: FormInstance<IEditForm>
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
	const minInputRef = useRef<InputRef>(null)
	const [editing, setEditing] = useState(false)
	const toggleEdit = async () => {
		if (record.isGroup) return
		setEditing(!editing)
		// 第一次編輯回拿不到 form 裡的值 故預設值拿 record 裡的值
		const {
			min = record.limitInput.min,
			max = record.limitInput.max,
			maxPerMatch = record.limitInput.maxPerMatch,
		} = await form.validateFields()

		form.setFieldsValue({
			min,
			max,
			maxPerMatch,
		})
	}
	const endEditing = async () => {
		const { min, max, maxPerMatch } = await form.validateFields()
		const { key } = record
		handleEndEdit(key, min!, max!, maxPerMatch!)
		toggleEdit()
	}
	useEffect(() => {
		if (editing) {
			minInputRef.current!.focus()
		}
	}, [editing])

	let childNode = children

	if (editable) {
		childNode = editing ? (
			<Space>
				{/* Label_MaxPerMatch 是串關累計最大金額 條件是 MIn <= Max <= MaxPerMatch */}
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
						{
							validator: () => {
								const { min, max, maxPerMatch } = form.getFieldsValue()

								return min! <= max! && min! <= maxPerMatch!
									? Promise.resolve()
									: Promise.reject(new Error(t('Label_LimitedMin')))
							},
						},
					]}
					style={{ lineHeight: 3 }}
				>
					{/* 沒有使用 onBlur 是因為不是單一 Input 框會有預期外的錯誤 */}
					<Input
						type='number'
						max={2}
						ref={minInputRef}
						onPressEnter={endEditing}
					/>
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
						{
							validator: () => {
								const { min, max, maxPerMatch } = form.getFieldsValue()

								return max! >= min! && max! <= maxPerMatch!
									? Promise.resolve()
									: Promise.reject(new Error(t('Label_LimitedMax')))
							},
						},
					]}
					style={{ lineHeight: 3 }}
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
						{
							validator: () => {
								const { min, max, maxPerMatch } = form.getFieldsValue()

								return maxPerMatch! >= min! && maxPerMatch! >= max!
									? Promise.resolve()
									: Promise.reject(new Error(t('Label_LimitedMaxPerMatch')))
							},
						},
					]}
					style={{ lineHeight: 3 }}
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

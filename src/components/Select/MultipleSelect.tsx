import { Select, SelectProps } from 'antd'
import { FC } from 'react'

const MultipleSelect: FC<SelectProps> = ({ children, ...props }) => {
	return (
		<Select
			allowClear
			mode='multiple'
			maxTagCount='responsive'
			maxTagPlaceholder={omittedValues =>
				`+${omittedValues.length} Items Selected`
			}
			{...props}
		>
			{children}
		</Select>
	)
}

export { MultipleSelect }

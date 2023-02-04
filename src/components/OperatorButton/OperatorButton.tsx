import { ReactNode } from 'react'
import { Button, ButtonProps } from 'antd'
import {
	ButtonColor,
	ButtonColorEnum,
} from 'components/OperatorButton/colorTypes'

interface IOperatorButtonProps extends ButtonProps {
	children: ReactNode
	color: ButtonColor
}
const OperatorButton = ({
	children,
	color,
	style,
	...restProps
}: IOperatorButtonProps) => {
	return (
		<Button
			block
			type='text'
			style={{
				...style,
				backgroundColor: ButtonColorEnum[color],
				color: 'white',
			}}
			{...restProps}
		>
			{children}
		</Button>
	)
}

export { OperatorButton }

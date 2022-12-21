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
			shape='round'
			type='primary'
			ghost
			style={{
				...style,
				borderColor: ButtonColorEnum[color],
				color: ButtonColorEnum[color],
			}}
			{...restProps}
		>
			{children}
		</Button>
	)
}

export { OperatorButton }

import { RightOutlined } from '@ant-design/icons'
import { ButtonProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import StyledButton from './StyledButton'

const GoNextRouteButton = (props: ButtonProps) => {
	const navigate = useNavigate()

	return (
		<StyledButton
			icon={<RightOutlined />}
			type='default'
			shape='circle'
			{...props}
			onClick={() => navigate(1)}
		/>
	)
}

GoNextRouteButton.AFFIX_BUTTON_TYPE = 'GO_NEXT_ROUTE_BUTTON' // AFFIX_BUTTON_TYPE_ENUM.GO_NEXT_ROUTE_BUTTON

export default GoNextRouteButton

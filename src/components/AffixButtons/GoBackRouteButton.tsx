import { LeftOutlined } from '@ant-design/icons'
import { ButtonProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import StyledButton from './StyledButton'

const GoBackRouteButton = (props: ButtonProps) => {
	const navigate = useNavigate()

	return (
		<StyledButton
			icon={<LeftOutlined />}
			type='default'
			shape='circle'
			{...props}
			onClick={() => navigate(-1)}
		/>
	)
}

GoBackRouteButton.AFFIX_BUTTON_TYPE = 'GO_BACK_ROUTE_BUTTON'

export default GoBackRouteButton

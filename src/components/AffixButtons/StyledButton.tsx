import { Button } from 'antd'
import styled from 'styled-components'

export const BUTTON_WIDTH = 52
export const BUTTON_HEIGHT = 52

const StyledButton = styled(Button)`
	width: ${BUTTON_WIDTH}px !important;
	height: ${BUTTON_HEIGHT}px;
	box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	margin: 8px 0px;
	z-index: 2;
`

export default StyledButton

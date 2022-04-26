import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { resetScrollBar } from 'common/utils'
import { useEffect, useState } from 'react'

import StyledButton from './StyledButton'

const BackToTopButton = ({
	visibilityHeight = 280,
}: {
	visibilityHeight?: number
}) => {
	const [visible, setVisible] = useState(false)

	const content = document.getElementById('layout-content')

	const handleClick = () => {
		if (content) {
			resetScrollBar(content)
		}
	}

	const handleScroll = (event: any) => {
		const isVisible = event?.target?.scrollTop > visibilityHeight

		setVisible(isVisible)
	}

	const bindScrollEvent = () => {
		content?.addEventListener('scroll', handleScroll)
	}

	const removeScrollEvent = () => {
		content?.removeEventListener('scroll', handleScroll)
	}

	useEffect(() => {
		bindScrollEvent()

		return () => {
			removeScrollEvent()
		}
	}, [])

	if (!visible) return null

	return (
		<StyledButton
			icon={<VerticalAlignTopOutlined />}
			type='default'
			shape='circle'
			onClick={handleClick}
		/>
	)
}

BackToTopButton.AFFIX_BUTTON_TYPE = 'BACK_TO_TOP_BUTTON'

export default BackToTopButton

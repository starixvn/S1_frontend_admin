import { Button, Badge } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ITourBeginButton {
	handleClick: () => void
}

const TourBeginButton = ({ handleClick }: ITourBeginButton) => {
	const { t } = useTranslation()
	const [text] = useState('new')

	return (
		<Badge count={text}>
			<Button
				type='primary'
				style={{
					marginBottom: '20px',
					background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 75%)',
					border: 'none',
				}}
				onClick={handleClick}
			>
				{t('Label_Begin_Tour')}
			</Button>
		</Badge>
	)
}

export default TourBeginButton

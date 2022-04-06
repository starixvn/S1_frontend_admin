import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UIStateMain } from './Main'

export const UI_STATUS_TYPE = {
	unauthorized: 'unauthorized',
}

interface UIStatePageProps {
	status: 403 | 404
}
const UIStatePage = ({ status }: UIStatePageProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const prevPage = () => {
		navigate(-1)
	}

	const renderText = () => {
		let text = null

		switch (status) {
			case 404:
				text = t('System.Label_PageNoFound')
				break

			case 403:
				text = t('System.Label_Unauthorized')
				break

			default:
				break
		}

		return text
	}

	return (
		<UIStateMain>
			<div>
				<div style={{ textAlign: 'center' }}>
					{status} | {renderText()}
				</div>
				<br />
				<Button onClick={prevPage} type='primary' icon={<ArrowLeftOutlined />}>
					click here to back
				</Button>
			</div>
		</UIStateMain>
	)
}

export default UIStatePage

import { FC } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { LayoutContentTitle } from './LayoutContentTitle'

const { Content } = Layout

export const StyledCard = styled(Content)`
	background: white;
	margin-bottom: 32px;
	padding: 20px;
	border-radius: 4px;
`

interface LayoutContentInterface extends FC {
	Title: typeof LayoutContentTitle
	Card: typeof StyledCard
}

const LayoutContent: LayoutContentInterface = () => {
	return (
		<Content
			style={{
				margin: 0,
				padding: 0,
				minHeight: 340,
			}}
		>
			<Outlet />
		</Content>
	)
}

LayoutContent.Title = LayoutContentTitle
LayoutContent.Card = StyledCard

export { LayoutContent }

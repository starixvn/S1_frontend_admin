import { FC, useRef } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { useResetScrollBar } from 'common/hooks'
import { LayoutContentTitle } from './LayoutContentTitle'

const { Content } = Layout

export const StyledCard = styled(Content)`
	background: white;
	margin-bottom: 32px;
	padding: 12px 32px;
	border-radius: 4px;
	overflow: auto;
}

`

interface LayoutContentInterface extends FC {
	Title: typeof LayoutContentTitle
	Card: typeof StyledCard
}

const LayoutContent: LayoutContentInterface = () => {
	const ref = useRef<HTMLElement>(null)

	useResetScrollBar(ref.current)

	return (
		<Content
			id='layout-content'
			ref={ref}
			style={{
				padding: '0 24px 24px',
				margin: 0,
				height: '90vh',
				overflow: 'auto',
			}}
		>
			<Outlet />
		</Content>
	)
}

LayoutContent.Title = LayoutContentTitle
LayoutContent.Card = StyledCard

export { LayoutContent }

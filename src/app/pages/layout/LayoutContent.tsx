import { FC, useRef } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { useResetScrollBar } from 'common/hooks'
import { LayoutContentTitle } from './LayoutContentTitle'
import { StyledCard } from './LayoutCard'

const { Content } = Layout

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
				margin: 0,
				height: 'calc(100vh - 64px)',
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

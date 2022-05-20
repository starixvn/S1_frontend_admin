import { FC, useRef } from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { useResetScrollBar } from 'common/hooks'
import { LayoutContentTitle } from './LayoutContentTitle'
import LayoutCard from './LayoutCard'

const { Content } = Layout

export const LayoutContentMain = styled.main`
	padding: 0 24px;
`

interface LayoutContentInterface extends FC {
	Main: typeof LayoutContentMain
	Title: typeof LayoutContentTitle
	Card: typeof LayoutCard
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

LayoutContent.Main = LayoutContentMain
LayoutContent.Title = LayoutContentTitle
LayoutContent.Card = LayoutCard

export { LayoutContent }

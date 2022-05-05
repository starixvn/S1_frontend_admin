import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { AuthProvider } from 'common/auth'
import { I18nextProvider } from 'react-i18next'
import styled from 'styled-components'
import { Spin } from 'antd'
import i18n from 'common/i18n/config'
import GlobalStyle from './styles/GlobalStyle'
import routes from './routes'

const LoadingSpinDiv = styled.div`
	display: flex;
	height: 100vh;
	width: 100w;
	justify-content: center;
	align-items: center;
`
const Wrapper = styled.div`
	min-height: 100vh;
`

function App() {
	const element = useRoutes(routes)

	return (
		<Suspense
			fallback={
				<LoadingSpinDiv>
					<Spin />
				</LoadingSpinDiv>
			}
		>
			<GlobalStyle />

			<AuthProvider>
				<I18nextProvider i18n={i18n}>
					<Wrapper>{element}</Wrapper>
				</I18nextProvider>
			</AuthProvider>
		</Suspense>
	)
}

export default App

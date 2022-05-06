import { useRoutes } from 'react-router-dom'
import { AuthProvider } from 'common/auth'
import { I18nextProvider } from 'react-i18next'
import styled from 'styled-components'
import i18n from 'common/i18n/config'
import GlobalStyle from './styles/GlobalStyle'
import routes from './routes'

const Wrapper = styled.div`
	min-height: 100vh;
`

function App() {
	const element = useRoutes(routes)

	return (
		<>
			<GlobalStyle />

			<AuthProvider>
				<I18nextProvider i18n={i18n}>
					<Wrapper>{element}</Wrapper>
				</I18nextProvider>
			</AuthProvider>
		</>
	)
}

export default App

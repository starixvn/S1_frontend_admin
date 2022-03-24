import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { AuthProvider } from "common/config-provider";
import { I18nextProvider } from "react-i18next";
import styled from "styled-components";
import i18n from "common/i18n/config";
import routes from "./routes";
import GlobalStyle from "./styles/GlobalStyle";

const Wrapper = styled.div`
	min-height: 100vh;
`;

function App() {
	let element = useRoutes(routes);

	return (
		<Suspense fallback="loading...">
			<GlobalStyle />

			<AuthProvider>
				<I18nextProvider i18n={i18n}>
					<Wrapper>{element}</Wrapper>
				</I18nextProvider>
			</AuthProvider>
		</Suspense>
	);
}

export default App;

import { Navigate } from 'react-router-dom'
import { isChrome, isSafari } from 'react-device-detect'
import styled from 'styled-components'
import ReactCanvasNest from 'react-canvas-nest'
import { useAuth } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import paths from 'app/constants/paths'
import imgLoginBg from 'assets/images/common/login-bg.png'
import LoginForm from './LoginForm'

const Wrapper = styled.div`
	min-height: 100vh;
	display: flex;
	overflow: hidden;
	justify-content: center;
	align-items: center;
	background: url(${imgLoginBg}) round;
`

const Login = () => {
	const { t } = useTranslation()
	const { auth, onSignIn, onCheckSignIn } = useAuth()

	const [loading, setLoading] = useState<boolean | undefined>()

	const handleLogin = async ({
		userName,
		userPassword,
	}: {
		userName: string
		userPassword: string
	}) => {
		setLoading(true)
		await onSignIn(userName, userPassword)
		setLoading(false)
	}

	useEffect(() => {
		onCheckSignIn()
	}, [])

	if (auth.isLogin) {
		// 2024.10.29 因為修改 AuthRequire 判斷無權限時正確倒轉到403，因此修改判斷後導轉進根目錄
		// const { path: dashboardPath } = getMapMenu(1)
		return <Navigate to={paths.layout.root} />
	}

	const floatColor = '24,144,255'

	return (
		<Wrapper>
			{(isChrome || isSafari) && (
				<ReactCanvasNest
					config={{
						pointColor: floatColor,
						lineColor: floatColor,
						pointOpacity: 0.6,
					}}
					style={{ zIndex: 1 }}
				/>
			)}

			<LoginForm
				title={t('Login.Label_WelcomeBack')}
				loading={loading}
				onLogin={handleLogin}
			/>
		</Wrapper>
	)
}

export { Login }

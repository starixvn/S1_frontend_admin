import { Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getMapMenu } from 'app/constants/menuMapping'
import imgLoginBg from 'assets/images/common/login-bg.png'
import LoginForm from './LoginForm'

const Wrapper = styled.div`
	min-height: 100vh;
	display: flex;
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
		const { path: dashboardPath } = getMapMenu(1)

		return <Navigate to={`${dashboardPath}`} />
	}

	return (
		<Wrapper>
			<LoginForm
				title={t('Login.Label_WelcomeBack')}
				loading={loading}
				onLogin={handleLogin}
			/>
		</Wrapper>
	)
}

export { Login }

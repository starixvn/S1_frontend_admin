import { Button, Card, Form, Input } from 'antd'
import { Navigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useAuth } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { gray } from 'app/styles'
import { geekblue } from '@ant-design/colors'
import { getMapMenu } from 'app/constants/menuMapping'
import imgLoginBg from 'assets/images/common/login-bg.png'

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
	const [userName, setUserName] = useState<string>('')
	const [userPassword, setUserPassword] = useState<string>('')

	const handleLogin = async () => {
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
			<Card
				title={t('Login.Label_WelcomeBack')}
				style={{ width: '400px', border: 'none', margin: 8 }}
				headStyle={{ background: geekblue.primary, color: gray[0] }}
			>
				<Form
					layout='vertical'
					className='login-form'
					initialValues={{ remember: true }}
					onFinish={handleLogin}
				>
					<Form.Item
						label={t('Login.Label_UserName')}
						name='username'
						rules={[{ required: true, message: 'Please input your Username!' }]}
					>
						<Input
							value={userName}
							onChange={event => setUserName(event.target.value)}
							prefix={<UserOutlined className='site-form-item-icon' />}
							placeholder='Username'
						/>
					</Form.Item>

					<Form.Item
						label={t('Login.Label_Password')}
						name='password'
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password
							value={userPassword}
							onChange={event => setUserPassword(event.target.value)}
							prefix={<LockOutlined className='site-form-item-icon' />}
							type='password'
							placeholder='Password'
						/>
					</Form.Item>

					<Form.Item>
						<Button
							loading={loading}
							block
							type='primary'
							htmlType='submit'
							className='login-form-button'
						>
							{t('Login.Label_SignIn')}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Wrapper>
	)
}

export { Login }

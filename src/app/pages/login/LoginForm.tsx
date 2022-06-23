import { FC } from 'react'
import { Button, Card, Form, Input } from 'antd'
import { geekblue } from '@ant-design/colors'
import { gray } from 'app/styles'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

interface ILoginProps {
	title: string
	loading?: boolean
	onLogin: ({
		userName,
		userPassword,
	}: {
		userName: string
		userPassword: string
	}) => void
}

const LoginForm: FC<ILoginProps> = ({ title, loading, onLogin }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm()

	return (
		<Card
			title={title}
			style={{ width: '400px', border: 'none', margin: 12, zIndex: 2 }}
			headStyle={{ background: geekblue.primary, color: gray[0] }}
		>
			<Form
				form={form}
				layout='vertical'
				className='login-form'
				initialValues={{ remember: true }}
				onFinish={onLogin}
			>
				<Form.Item
					label={t('Login.Label_UserName')}
					name='userName'
					rules={[{ required: true }]}
				>
					<Input
						prefix={<UserOutlined className='site-form-item-icon' />}
						placeholder='Username'
					/>
				</Form.Item>

				<Form.Item
					label={t('Login.Label_Password')}
					name='userPassword'
					rules={[{ required: true }]}
				>
					<Input.Password
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
	)
}

export default LoginForm

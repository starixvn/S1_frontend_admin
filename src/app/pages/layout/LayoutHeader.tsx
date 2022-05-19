import { Button, Col, Dropdown, Layout, Menu, Row } from 'antd'
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	FileProtectOutlined,
	PoweroffOutlined,
	DownOutlined,
} from '@ant-design/icons'
import { useAuth, useModal } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { ChangePasswordModal } from 'app/pages/changePassword'
import { useLocation } from 'react-router-dom'

import { LayoutHeaderUserSite } from './LayoutHeaderUserSite'

const { Header } = Layout

interface LayoutHeaderProps {
	collapsed: boolean
	onToggleCollapsed: () => void
}

const LayoutHeader = ({ collapsed, onToggleCollapsed }: LayoutHeaderProps) => {
	const { t } = useTranslation()
	const { auth, onSignOut, onInternalSignOut } = useAuth()

	const location = useLocation()

	const isNewPathMode =
		!location.pathname.match('internal') && !location.pathname.match('Internal')

	const changePasswordModal = useModal()

	const handleSignOut = () => {
		Promise.allSettled([onInternalSignOut(), onSignOut()])
	}

	const menu = (
		<Menu>
			<Menu.Item
				onClick={changePasswordModal.onOpen}
				key={1}
				icon={<FileProtectOutlined />}
			>
				{t('ChangePassword.Label_ChangePassword')}
			</Menu.Item>

			<Menu.Divider key={2} />

			<Menu.Item
				key={3}
				onClick={handleSignOut}
				icon={<PoweroffOutlined />}
				danger
			>
				{t('Label_SignOut')}
			</Menu.Item>
		</Menu>
	)

	return (
		<>
			<ChangePasswordModal {...changePasswordModal} />

			<Header className='layout-header'>
				<Row wrap={false} align='middle'>
					<Col
						flex='80px'
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Button type='text' onClick={onToggleCollapsed}>
							{collapsed ? (
								<MenuUnfoldOutlined style={{ fontSize: '20px' }} />
							) : (
								<MenuFoldOutlined style={{ fontSize: '20px' }} />
							)}
						</Button>
					</Col>

					<Col flex='auto' />

					{isNewPathMode && <LayoutHeaderUserSite />}

					<Col flex='120px'>
						<Dropdown
							trigger={['click']}
							overlay={menu}
							placement='bottomRight'
						>
							<Button type='text' style={{ marginBottom: 16 }}>
								<UserOutlined style={{ fontSize: '16px' }} />
								{auth.user}
								<DownOutlined style={{ fontSize: '10px' }} />
							</Button>
						</Dropdown>
					</Col>
				</Row>
			</Header>
		</>
	)
}

export { LayoutHeader }

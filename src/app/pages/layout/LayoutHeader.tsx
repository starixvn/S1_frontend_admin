import { useState } from 'react'
import { Button, Col, Dropdown, Layout, Menu, Row, Space } from 'antd'
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	FileProtectOutlined,
	PoweroffOutlined,
	DownOutlined,
} from '@ant-design/icons'
import { useMediaQuery } from 'usehooks-ts'
import { useAuth, useModal } from 'hooks'
import { useTranslation } from 'react-i18next'
import { ChangePasswordModal } from 'app/pages/changePassword'

const { Header } = Layout

interface LayoutHeaderProps {
	collapsed: boolean
	onToggleCollapsed: () => void
}

// TODO: test only, using fetch data later
const SITE_LIST: string[] = []

const LayoutHeader = ({ collapsed, onToggleCollapsed }: LayoutHeaderProps) => {
	const { t } = useTranslation()
	const { auth, onSignOut } = useAuth()
	const mediaMdMatches = useMediaQuery('(min-width: 768px)')

	const changePasswordModal = useModal()

	const [site, setSite] = useState<string>()

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

			<Menu.Item key={3} onClick={onSignOut} icon={<PoweroffOutlined />} danger>
				{t('Label_SignOut')}
			</Menu.Item>
		</Menu>
	)

	const siteMenu = (
		<Menu>
			{SITE_LIST.map(_site => (
				<Menu.Item key={_site}>{_site}</Menu.Item>
			))}
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

					{mediaMdMatches ? (
						<Col flex='260px'>
							<Space>
								{SITE_LIST.map(_site => (
									<Button
										onClick={() => setSite(_site)}
										key={_site}
										type={_site === site ? 'primary' : 'text'}
									>
										{_site}
									</Button>
								))}
							</Space>
						</Col>
					) : (
						<Col flex='96px'>
							<Dropdown trigger={['click']} overlay={siteMenu}>
								<Button type='primary'>goal123</Button>
							</Dropdown>
						</Col>
					)}

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

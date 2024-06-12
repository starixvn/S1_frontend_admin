import { Button, Col, Dropdown, Layout, Menu, Row } from 'antd'
import type { MenuProps } from 'antd'

import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	FileProtectOutlined,
	PoweroffOutlined,
	DownOutlined,
	ApiOutlined,
} from '@ant-design/icons'
import { useAuth, useModal } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { ChangePasswordModal } from 'app/pages/changePassword'
import { useLocation, useNavigate } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'

import { LayoutHeaderUserSite } from './LayoutHeaderUserSite'
import LayoutHeaderLanguageSelect from './LayoutHeaderLanguageSelect'
import LayoutHeaderThemeToggle from './LayoutHeaderThemeToggle'

const { Header } = Layout

interface LayoutHeaderProps {
	collapsed: boolean
	onToggleCollapsed: () => void
}

const LayoutHeader = ({ collapsed, onToggleCollapsed }: LayoutHeaderProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { onSignOut, onInternalSignOut, userData } = useAuth()

	const location = useLocation()

	const isNewPathMode =
		!location.pathname.match('internal') && !location.pathname.match('Internal')

	const changePasswordModal = useModal()

	const handleSignOut = () => {
		Promise.allSettled([onInternalSignOut(), onSignOut()])
	}

	const items = [
		{
			key: 'item-1',
			label: t('ChangePassword.Label_ChangePassword'),
			icon: <FileProtectOutlined />,
			onClick: changePasswordModal.onOpen,
		},
		userData?.isSuper
			? {
					key: 'item-2',
					label: t('Label_AssignBrand'),
					icon: <ApiOutlined />,
					onClick: () =>
						navigate(`/${NEW_SITE_PREFIX_URL}/${paths.assignBrand.root}`),
			  }
			: undefined,
		{ type: 'divider', key: 'item-3' },
		{
			key: 'item-4',
			label: t('Label_SignOut'),
			icon: <PoweroffOutlined />,
			danger: true,
			onClick: handleSignOut,
		},
	] as MenuProps['items']

	const menu = <Menu items={items} />

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
					<Col flex='48px'>
						<LayoutHeaderThemeToggle />
					</Col>
					{isNewPathMode && <LayoutHeaderUserSite />}
					<Col>
						<LayoutHeaderLanguageSelect />
					</Col>
					<Col flex='140px'>
						<Dropdown
							trigger={['click']}
							overlay={menu}
							placement='bottomRight'
						>
							<Button type='text' style={{ width: '120px', marginBottom: 16 }}>
								<UserOutlined style={{ fontSize: '16px' }} />
								{userData?.userName ?? ''}
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

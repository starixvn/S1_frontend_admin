import { Button, Col, Dropdown, Menu, Row } from 'antd'
import { useMediaQuery } from 'usehooks-ts'
import { useAppSelector } from 'app/store'
import { Link } from 'react-router-dom'
import paths from 'app/constants/paths'
import { useAuth } from 'common/hooks'

const LayoutHeaderUserSite = () => {
	const maxWidthMediaMatches = useMediaQuery('(max-width: 768px)')
	const { userSite, userSiteList } = useAppSelector(state => state.allEnum)
	const { allSiteMode } = useAuth()

	const siteMenu = (
		<Menu>
			{userSiteList.map(({ siteId, siteName }) => (
				<Menu.Item key={siteId}>
					<Link to={`${paths.layout.root}?siteId=${siteId}`}>{siteName}</Link>
				</Menu.Item>
			))}
		</Menu>
	)

	const isDropdown = userSiteList.length > 4 || maxWidthMediaMatches

	// * site selector
	const siteSelector = isDropdown ? (
		<Col flex='96px'>
			<Dropdown trigger={['click']} overlay={siteMenu}>
				<Button block type='primary'>
					{userSite?.siteName ?? 'site'}
				</Button>
			</Dropdown>
		</Col>
	) : (
		<Col flex='400px'>
			<Row justify='end' gutter={8}>
				{userSiteList.map(({ siteId, siteName }) => (
					<Col flex='96px' key={siteName}>
						<Link to={`${paths.layout.root}?siteId=${siteId}`}>
							<Button
								block
								key={siteName}
								type={siteName === userSite?.siteName ? 'primary' : 'text'}
							>
								{siteName ?? 'site'}
							</Button>
						</Link>
					</Col>
				))}
			</Row>
		</Col>
	)

	const allSiteButton = (
		<Col flex='400px'>
			<Row justify='end' gutter={8}>
				<Col flex='96px'>
					<Button block type='primary'>
						All
					</Button>
				</Col>
			</Row>
		</Col>
	)

	return allSiteMode ? allSiteButton : siteSelector
}

export { LayoutHeaderUserSite }

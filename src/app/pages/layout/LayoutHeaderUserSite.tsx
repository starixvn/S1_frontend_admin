import { Button, Col, Dropdown, Menu, Row } from 'antd'
import { useMediaQuery } from 'usehooks-ts'
import { useAppSelector } from 'app/store'
import { Link } from 'react-router-dom'
import paths from 'app/constants/paths'
import { useAuth } from 'common/hooks'
import { UserSite } from 'common/enum/type'

const LayoutHeaderUserSite = () => {
	const maxWidthMediaMatches = useMediaQuery('(max-width: 768px)')
	const { userSite, userSiteList } = useAppSelector(state => state.allEnum)
	const { allSiteMode } = useAuth()

	// 定義一個函數來更新 siteName
	function updateSiteName(site?: UserSite) {
		switch (site?.siteName) {
			case 'Nova88':
				return 'N88'
			case 'Goal123':
				return 'N8G'
			case 'Bwing':
				return 'N8B'
			case 'Ivorysport':
				return 'IVO'
			default:
				return site?.siteName
		}
	}

	// 使用map創建一個新的陣列，其中包含更新過的siteName
	const newSiteList = userSiteList.map(site => ({
		...site,
		siteName: updateSiteName(site),
	}))

	const siteMenu = (
		<Menu>
			{newSiteList.map(({ siteId, siteName }) => {
				return (
					<Menu.Item key={siteId}>
						<Link to={`${paths.layout.root}?siteId=${siteId}`}>{siteName}</Link>
					</Menu.Item>
				)
			})}
		</Menu>
	)

	const isDropdown = userSiteList.length > 4 || maxWidthMediaMatches

	// * site selector
	const siteSelector = isDropdown ? (
		<Col flex='96px'>
			<Dropdown trigger={['click']} overlay={siteMenu}>
				<Button block type='primary'>
					{updateSiteName(userSite) ?? 'site'}
				</Button>
			</Dropdown>
		</Col>
	) : (
		<Col flex='400px'>
			<Row justify='end' gutter={8}>
				{newSiteList.map(({ siteId, siteName }) => (
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

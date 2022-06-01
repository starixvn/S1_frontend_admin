import { Button, Col, Dropdown, Menu, Row } from 'antd'
import { useMediaQuery } from 'usehooks-ts'

import { useAppSelector } from 'app/store'
import { UserSite } from 'common/enum/type'
import { useChangeBrandMutation } from 'common/service/homeApi/api'

const useUserSiteAction = () => {
	const [changeBrand] = useChangeBrandMutation()
	const { userSite, userSiteList } = useAppSelector(state => state.allEnum)

	const handleSelectUserSite = async (newUserSite: UserSite) => {
		await changeBrand({ siteId: newUserSite.siteId })

		window.location.href = `/`
	}

	return { userSite, userSiteList, handleSelectUserSite }
}

const LayoutHeaderUserSite = () => {
	const maxWidthMediaMatches = useMediaQuery('(max-width: 768px)')

	const { userSite, userSiteList, handleSelectUserSite } = useUserSiteAction()

	const siteMenu = (
		<Menu>
			{userSiteList.map(_userSite => (
				<Menu.Item
					key={_userSite.siteId}
					onClick={() => handleSelectUserSite(_userSite)}
				>
					{_userSite.siteName}
				</Menu.Item>
			))}
		</Menu>
	)

	const isDropdown = userSiteList.length > 4 || maxWidthMediaMatches

	return isDropdown ? (
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
				{userSiteList.map(_userSite => (
					<Col flex='96px' key={_userSite.siteName}>
						<Button
							block
							key={_userSite.siteName}
							onClick={() => handleSelectUserSite(_userSite)}
							type={
								_userSite.siteName === userSite?.siteName ? 'primary' : 'text'
							}
						>
							{_userSite.siteName ?? 'site'}
						</Button>
					</Col>
				))}
			</Row>
		</Col>
	)
}

export { LayoutHeaderUserSite }

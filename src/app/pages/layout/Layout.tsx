import _ from 'lodash'
import { useAuth } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import {
	fetchAllEnumAsync,
	onChangeUserSite,
	selectEnumStatus,
} from 'common/enum'
import { useSearchParams } from 'react-router-dom'
import { useState, FC, useEffect } from 'react'
import { Layout } from 'antd'
import { LayoutSideBar } from './LayoutSideBar'
import { LayoutHeader } from './LayoutHeader'
import { LayoutContent } from './LayoutContent'

const useMenuCollapsed = () => {
	const [collapsed, setCollapsed] = useState<boolean>(true)

	const onToggleCollapsed = () => {
		setCollapsed(prev => !prev)
	}

	const onCloseCollapsed = () => {
		setCollapsed(true)
	}

	return { collapsed, onToggleCollapsed, onCloseCollapsed }
}

const useUserSiteEffect = () => {
	const dispatch = useAppDispatch()
	const [searchParams] = useSearchParams()

	const site = searchParams.get('site')

	const userSiteList = useAppSelector(state => state.allEnum.userSiteList)

	const enumStatus = useAppSelector(selectEnumStatus)

	useEffect(() => {
		if (enumStatus === 'succeeded') {
			const newUserSite =
				_.find(userSiteList, { siteId: Number(site) }) || userSiteList[0]

			dispatch(onChangeUserSite(newUserSite))
		}
	}, [enumStatus])

	useEffect(() => {
		dispatch(fetchAllEnumAsync())
	}, [])
}

const BaseLayout: FC = () => {
	const auth = useAuth()

	const { collapsed, onToggleCollapsed, onCloseCollapsed } = useMenuCollapsed()

	useUserSiteEffect()

	useEffect(() => {
		const init = async () => {
			auth.onFetchInternalAllowRoles()
			auth.onFetchUserMenuList('en')
		}

		init()
	}, [])

	return (
		<Layout hasSider style={{ height: '100vh' }}>
			<LayoutSideBar
				collapsed={collapsed}
				onToggleCollapsed={onToggleCollapsed}
				onCloseCollapsed={onCloseCollapsed}
			/>

			<Layout>
				<LayoutHeader
					collapsed={collapsed}
					onToggleCollapsed={onToggleCollapsed}
				/>

				<LayoutContent />
			</Layout>
		</Layout>
	)
}

export { BaseLayout as Layout }

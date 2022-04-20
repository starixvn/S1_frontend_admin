import _ from 'lodash'
import { useAuth, useResetScrollBar } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import { fetchAllEnumAsync, selectUserSite } from 'common/enum'
import { useSearchParams } from 'react-router-dom'
import { useState, FC, useEffect } from 'react'
import { Layout as AntdLayout, BackTop } from 'antd'
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
	const loading = useAppSelector(state => state.allEnum.loading)

	useEffect(() => {
		if (loading === false) {
			const newUserSite =
				_.find(userSiteList, { siteId: Number(site) }) || userSiteList[0]

			dispatch(selectUserSite(newUserSite))
		}
	}, [loading])

	useEffect(() => {
		dispatch(fetchAllEnumAsync())
	}, [])
}

const Layout: FC = () => {
	const auth = useAuth()

	const { collapsed, onToggleCollapsed, onCloseCollapsed } = useMenuCollapsed()

	useResetScrollBar()

	useUserSiteEffect()

	useEffect(() => {
		const init = async () => {
			auth.onFetchInternalAllowRoles()
			auth.onFetchUserMenuList('en')
		}

		init()
	}, [])

	return (
		<AntdLayout hasSider style={{ minHeight: '100vh' }}>
			<BackTop />

			<LayoutSideBar
				collapsed={collapsed}
				onToggleCollapsed={onToggleCollapsed}
				onCloseCollapsed={onCloseCollapsed}
			/>

			<AntdLayout>
				<LayoutHeader
					collapsed={collapsed}
					onToggleCollapsed={onToggleCollapsed}
				/>

				<AntdLayout style={{ padding: '0 24px 24px' }}>
					<LayoutContent />
				</AntdLayout>
			</AntdLayout>
		</AntdLayout>
	)
}

export { Layout }

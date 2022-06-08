import { find } from 'lodash'
import { useAuth } from 'common/hooks'
import { useCheckBrandQuery } from 'common/service/homeApi/api'
import { useAppDispatch, useAppSelector } from 'app/store'
import {
	fetchAllEnumAsync,
	onChangeUserSite,
	selectEnumStatus,
	selectUserSite,
} from 'common/enum'
import { useState, FC, useEffect, Suspense } from 'react'
import { RequestStatusType } from 'type'
import { Layout, Spin } from 'antd'
import { LayoutSideBar } from './LayoutSideBar'
import { LayoutHeader } from './LayoutHeader'
import { LayoutContent } from './LayoutContent'
import LayoutSuspense from './LayoutSuspense'

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
	const { data: { data: siteId } = {} } = useCheckBrandQuery()

	const userSiteList = useAppSelector(state => state.allEnum.userSiteList)

	const enumStatus = useAppSelector(selectEnumStatus)

	useEffect(() => {
		if (enumStatus === 'succeeded') {
			const newUserSite = find(userSiteList, { siteId })

			dispatch(onChangeUserSite(newUserSite))
		}
	}, [enumStatus])
}

const BaseLayout: FC = () => {
	const dispatch = useAppDispatch()

	const [requestStatus, setRequestStatus] = useState<RequestStatusType>('idle')
	const auth = useAuth()
	const enumStatus = useAppSelector(selectEnumStatus)
	const userSite = useAppSelector(selectUserSite)
	const { collapsed, onToggleCollapsed, onCloseCollapsed } = useMenuCollapsed()

	useUserSiteEffect()

	useEffect(() => {
		if (userSite?.siteId) {
			auth.onFetchUserMenuList({ lang: 'en', siteId: userSite.siteId })
			auth.onGetUserData(userSite.siteId)
		}
	}, [userSite?.siteId])

	useEffect(() => {
		const init = async () => {
			setRequestStatus('pending')

			await Promise.all([
				auth.onFetchUserMenuList({ lang: 'en', siteId: 1 }),
				dispatch(fetchAllEnumAsync()),
			])

			setRequestStatus('idle')
		}

		init()
	}, [])

	const loading = enumStatus === 'pending' || requestStatus === 'pending'

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

				<Suspense
					fallback={
						<LayoutSuspense>
							<Spin />
						</LayoutSuspense>
					}
				>
					<Spin spinning={loading}>
						<LayoutContent />
					</Spin>
				</Suspense>
			</Layout>
		</Layout>
	)
}

export { BaseLayout as Layout }

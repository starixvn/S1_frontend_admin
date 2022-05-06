import _ from 'lodash'
import { useAuth, useQueryParams } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import {
	fetchAllEnumAsync,
	onChangeUserSite,
	selectEnumStatus,
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

	const [queryParams] = useQueryParams()

	const userSiteList = useAppSelector(state => state.allEnum.userSiteList)

	const enumStatus = useAppSelector(selectEnumStatus)

	useEffect(() => {
		if (enumStatus === 'succeeded') {
			const newUserSite =
				_.find(userSiteList, { siteId: Number(queryParams.siteId) }) ||
				userSiteList[0]

			dispatch(onChangeUserSite(newUserSite))
		}
	}, [enumStatus])
}

const BaseLayout: FC = () => {
	const dispatch = useAppDispatch()
	const [requestStatus, setRequestStatus] = useState<RequestStatusType>('idle')
	const auth = useAuth()
	const enumStatus = useAppSelector(selectEnumStatus)
	const { collapsed, onToggleCollapsed, onCloseCollapsed } = useMenuCollapsed()

	useUserSiteEffect()

	useEffect(() => {
		const init = async () => {
			setRequestStatus('pending')

			await Promise.all([
				auth.onFetchInternalAllowRoles(),
				auth.onFetchUserMenuList('en'),
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

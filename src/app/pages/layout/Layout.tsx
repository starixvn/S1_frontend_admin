import { useAuth } from 'common/hooks'
import { Layout, Spin } from 'antd'
import { useCheckBrandQuery } from 'common/service/homeApi/api'
import { useAppDispatch, useAppSelector } from 'app/store'
import { fetchAllEnumAsync, selectEnumStatus } from 'common/enum'
import { useState, FC, useEffect, Suspense } from 'react'
import { RequestStatusType } from 'type'
import { useMenuCollapsed, useUserSiteEffect } from './hooks'
import { LayoutSideBar } from './LayoutSideBar'
import { LayoutHeader } from './LayoutHeader'
import { LayoutContent } from './LayoutContent'
import LayoutSuspense from './LayoutSuspense'

const BaseLayout: FC = () => {
	const dispatch = useAppDispatch()
	const enumStatus = useAppSelector(selectEnumStatus)
	const auth = useAuth()
	const [requestStatus, setRequestStatus] = useState<RequestStatusType>('idle')
	const { data: { data: siteId } = {} } = useCheckBrandQuery()
	const { collapsed, onToggleCollapsed, onCloseCollapsed } = useMenuCollapsed()

	//  選擇品牌
	useUserSiteEffect()

	// 初始必要資訊
	useEffect(() => {
		const init = async () => {
			if (siteId) {
				setRequestStatus('pending')
				auth.onFetchUserMenuList({ lang: 'en', siteId })
				auth.onGetUserData(siteId)
				await dispatch(fetchAllEnumAsync())
				setRequestStatus('idle')
			}
		}

		init()
	}, [siteId])

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

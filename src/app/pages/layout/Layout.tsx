import { find } from 'lodash'
import { useAuth, useQueryParams } from 'common/hooks'
import {
	useCheckBrandQuery,
	useChangeBrandMutation,
} from 'common/service/homeApi/api'
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
	}, [enumStatus, siteId])
}

const BaseLayout: FC = () => {
	const dispatch = useAppDispatch()
	const [queryParams] = useQueryParams()
	const [changeBrand] = useChangeBrandMutation()

	const [requestStatus, setRequestStatus] = useState<RequestStatusType>('idle')
	const auth = useAuth()
	const enumStatus = useAppSelector(selectEnumStatus)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { collapsed, onToggleCollapsed, onCloseCollapsed } = useMenuCollapsed()

	useUserSiteEffect()

	useEffect(() => {
		if (siteId) {
			auth.onFetchUserMenuList({ lang: 'en', siteId })
			auth.onGetUserData(siteId)
		}
	}, [siteId])

	useEffect(() => {
		const init = async () => {
			setRequestStatus('pending')
			if (Number(queryParams?.siteId)) {
				await changeBrand({ siteId: Number(queryParams?.siteId) })
			}
			await Promise.all([dispatch(fetchAllEnumAsync())])

			setRequestStatus('idle')
		}

		init()
	}, [queryParams?.siteId])

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

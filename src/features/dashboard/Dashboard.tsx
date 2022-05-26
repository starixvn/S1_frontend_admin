import { FC, useEffect } from 'react'
import { Form } from 'antd'
import { useAppDispatch, useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectUserSite } from 'common/enum'
import { DashboardFilter } from './DashboardFilter'
import { DashboardTable } from './DashboardTable'
import {
	onChangeDashBoardStatus,
	selectDashboardData,
	selectDashboardStatus,
} from './slice'
import { fetchDashBoardGetDataAsync } from './thunk'

const Dashboard: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const [form] = Form.useForm()
	const dispatch = useAppDispatch()

	const userSite = useAppSelector(selectUserSite)
	const dashboardStatus = useAppSelector(selectDashboardStatus)
	const dashboardData = useAppSelector(selectDashboardData)

	const handleSearch = (formValues: any) => {
		const { currencyId, baseCurrencyId } = formValues

		dispatch(
			fetchDashBoardGetDataAsync({
				siteId: userSite?.siteId,
				currencyId,
				baseCurrencyId,
			})
		)
	}

	const loading = dashboardStatus === 'pending'

	useEffect(() => {
		return () => {
			dispatch(onChangeDashBoardStatus('idle'))
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<DashboardFilter form={form} loading={loading} onSearch={handleSearch} />

			{dashboardStatus !== 'idle' && (
				<DashboardTable loading={loading} dashboardData={dashboardData ?? []} />
			)}
		</LayoutContent.Main>
	)
}

export { Dashboard }

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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

const Dashboard = () => {
	const [form] = Form.useForm()
	const { t } = useTranslation()

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
		<main>
			<LayoutContent.Title title={t('Label_Dashboard')} />

			<DashboardFilter form={form} loading={loading} onSearch={handleSearch} />

			{dashboardStatus !== 'idle' && (
				<DashboardTable loading={loading} dashboardData={dashboardData ?? []} />
			)}
		</main>
	)
}

export { Dashboard }

import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { DashboardFilter } from './DashboardFilter'
import { DashboardTable } from './DashboardTable'

const Dashboard = () => {
	const { t } = useTranslation()

	const { loading: dashboardLoading, data: dashboardData } = useAppSelector(
		state => state.dashboard
	)

	return (
		<main>
			<LayoutContent.Title title={t('Label_Dashboard')} />

			<DashboardFilter />

			{dashboardLoading !== undefined && (
				<DashboardTable
					loading={dashboardLoading}
					dashboardData={dashboardData ?? []}
				/>
			)}
		</main>
	)
}

export { Dashboard }

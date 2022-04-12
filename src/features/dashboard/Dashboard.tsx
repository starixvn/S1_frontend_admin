import { useEffect, useState } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { selectCurrencyListBySite } from 'common/enum'
import { fetchDashBoardGetDataAsync } from './thunk'
import { selectDashboardData, selectDashboardLoading } from './slice'

import { DashboardFilter } from './DashboardFilter'
import { DashboardTable } from './DashboardTable'

const Dashboard = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const userSite = useAppSelector(state => state.allEnum.userSite)
	const allEnumLoading = useAppSelector(state => state.allEnum.loading)
	const dashboardLoading = useAppSelector(selectDashboardLoading)
	const dashboardData = useAppSelector(selectDashboardData)
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const [currency, setCurrency] = useState<Currency>()
	const [baseCurrency, setBaseCurrency] = useState<Currency>()

	const handleCurrencyChange = (currencyId: number) => {
		setCurrency(_.find(currencyListBySite, { currencyId }))
	}

	const handleBaseCurrencyChange = (currencyId: number) => {
		setBaseCurrency(_.find(currencyListBySite, { currencyId }))
	}

	const handleSearch = () => () => {
		dispatch(
			fetchDashBoardGetDataAsync({
				siteId: userSite?.siteId,
				currencyId: currency?.currencyId,
				baseCurrencyId: baseCurrency?.currencyId,
			})
		)
	}

	useEffect(() => {
		if (allEnumLoading === false) {
			setCurrency(currencyListBySite[0])
			setBaseCurrency(currencyListBySite[0])
		}
	}, [userSite?.siteId])

	const loading = allEnumLoading || dashboardLoading

	return (
		<main>
			<LayoutContent.Title title={t('Label_Dashboard')} />

			<DashboardFilter
				loading={!!loading}
				currency={currency}
				baseCurrency={baseCurrency}
				handleCurrencyChange={handleCurrencyChange}
				handleBaseCurrencyChange={handleBaseCurrencyChange}
				handleSearch={handleSearch}
			/>

			{dashboardLoading !== undefined && (
				<DashboardTable
					loading={!!loading}
					dashboardData={dashboardData ?? []}
				/>
			)}
		</main>
	)
}

export { Dashboard }

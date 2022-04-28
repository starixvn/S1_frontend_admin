import BoApi from 'common/service/Api'
import { DashBoardData, FetchDashBoardGetDataInterface } from './type'

export const fetchDashBoardGetData = async ({
	siteId,
	currencyId,
	baseCurrencyId,
}: FetchDashBoardGetDataInterface) => {
	const response = await BoApi.post('/DashBoard/GetData', {
		siteId,
		currencyId,
		baseCurrencyId,
	})

	if (response.data.errorCode !== 0) {
		throw new Error(response.data.message)
	}

	return (response?.data?.data as DashBoardData) ?? {}
}

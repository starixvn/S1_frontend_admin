import BoApi from 'common/service/Api'
import { UserSite, Currency } from './type'

export const fetchAdminUserSiteList = async (): Promise<Array<UserSite>> => {
	const response = await BoApi.post('/Permission/GetUserSiteList')

	return response?.data?.data ?? []
}

export const fetchAllCurrencyList = async (): Promise<Array<Currency>> => {
	const response = await BoApi.post('/GetAllData/GetCurrency')

	return response?.data?.data ?? []
}

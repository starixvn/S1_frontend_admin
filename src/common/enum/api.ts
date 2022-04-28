import BoApi from 'common/service/Api'
import {
	UserSite,
	Currency,
	AdjustmentInfoLogMenuItem,
	ActionType,
} from './type'

export const fetchAdminUserSiteList = async (): Promise<Array<UserSite>> => {
	const response = await BoApi.post('/Permission/GetUserSiteList')

	return response?.data?.data ?? []
}

export const fetchAllCurrencyList = async (): Promise<Array<Currency>> => {
	const response = await BoApi.post('/GetAllData/GetCurrency')

	return response?.data?.data ?? []
}

export const fetchAdjustmentInfoLogMenu = async (): Promise<
	AdjustmentInfoLogMenuItem[]
> => {
	const response = await BoApi.post('GetAllData/GetAdjustmentInfoLogMenu')

	return response?.data?.data ?? []
}

export const fetchActionTypeList = async (): Promise<ActionType[]> => {
	const response = await BoApi.post('GetAllData/GetActionTypeList')

	return response?.data?.data ?? []
}

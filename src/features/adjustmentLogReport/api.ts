import BoApi from 'common/service/Api'
import { FetchLogReportListInterface } from './type'

export const fetchLogReportList = async (body: FetchLogReportListInterface) => {
	const response = await BoApi.post('SettingLogReport/GetList', body)

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return response?.data?.data ?? []
}

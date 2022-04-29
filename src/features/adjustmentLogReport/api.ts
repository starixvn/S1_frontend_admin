import BoApi from 'common/service/Api'
import { FetchLogReportListProps, FetchLogReportListResponse } from './type'

export const fetchLogReportList = async (
	body: FetchLogReportListProps
): Promise<FetchLogReportListResponse> => {
	const response = await BoApi.post('SettingLogReport/GetList', body)

	if (response?.data?.errorCode !== 0) {
		throw new Error(response?.data?.message)
	}

	return {
		data: response?.data?.data ?? [],
		rowCount: response?.data?.rowCount,
	}
}

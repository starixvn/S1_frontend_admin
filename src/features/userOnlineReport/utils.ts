import {
	IUserOnlineReportData,
	INewUserOnlineReportData,
} from 'features/userOnlineReport/type'
import { cloneDeep } from 'lodash'

// S2C
// input為api response data
// {
// 	localTime: string
// 	siteId: number
// 	siteName: string
// 	deviceType: number
// 	deviceName: string
// 	maxCount: number
// }
// output為轉換response至table可用的結構
// {
// 	localTime: string
// 	desktop: number
// 	h5: number
// 	app: number
// }
export const userOnlineReportListConverter = (
	userOnlineReportList: IUserOnlineReportData[]
) => {
	const result: INewUserOnlineReportData[] = []

	const newUserOnlineReportList = cloneDeep(userOnlineReportList)

	newUserOnlineReportList
		.map(({ localTime, deviceName, maxCount }) => {
			return { localTime, children: { [deviceName]: maxCount } }
		})
		.forEach(oldObj => {
			const { localTime, children: deviceData } = oldObj
			const isFound = result.findIndex(newObj => newObj.localTime === localTime)
			if (isFound === -1) {
				result.push({
					localTime,
					[Object.keys(deviceData)[0].toLowerCase()]:
						Object.values(deviceData)[0],
				})
			} else {
				result[isFound] = {
					...result[isFound],
					[Object.keys(deviceData)[0].toLowerCase()]:
						Object.values(deviceData)[0],
				}
			}
		})
	return result
}

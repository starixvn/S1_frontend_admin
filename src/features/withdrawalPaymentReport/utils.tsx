import { IGetWithdrawalReportData } from 'features/withdrawalPaymentReport/type'
import { v4 as uuidV4 } from 'uuid'
import { assign, cloneDeep } from 'lodash'

export class TableConverter {
	private static flatDetail(target: IGetWithdrawalReportData) {
		const { children = [], key } = target ?? {}
		assign(target, { key: uuidV4(), displayName: key })
		if (children.length > 0) {
			children.forEach(child => TableConverter.flatDetail(child))
		}
		return target
	}

	// S2C
	static withdrawalReportConverter(withdrawalPaymentReport: any): {
		dataSource: object[]
	} {
		const result: object[] = []

		// 沒資料直接退出
		if (withdrawalPaymentReport?.length === 0)
			return {
				dataSource: [],
			}
		// dataSource 格式化
		withdrawalPaymentReport.forEach((data: IGetWithdrawalReportData) => {
			const cloneData = cloneDeep(data)
			TableConverter.flatDetail(cloneData)
			result.push(cloneData)
		})

		return {
			dataSource: result,
		}
	}
}

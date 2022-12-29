import { IGetDepositReportData } from 'features/depositPaymentReport/type'
import { assign, cloneDeep } from 'lodash'
import { v4 as uuidV4 } from 'uuid'

export class TableConverter {
	private static flatDetail(target: IGetDepositReportData) {
		const { children = [], key } = target ?? {}
		assign(target, { key: uuidV4(), displayName: key })
		if (children.length > 0) {
			children.forEach(child => TableConverter.flatDetail(child))
		}
		return target
	}

	// S2C
	static depositReportReportConverter(depositPaymentReport: any): {
		dataSource: object[]
	} {
		const result: object[] = []

		// 沒資料直接退出
		if (depositPaymentReport?.length === 0)
			return {
				dataSource: [],
			}
		// dataSource 格式化
		depositPaymentReport.forEach((data: IGetDepositReportData) => {
			const cloneData = cloneDeep(data)
			TableConverter.flatDetail(cloneData)
			result.push(cloneData)
		})

		return {
			dataSource: result,
		}
	}
}

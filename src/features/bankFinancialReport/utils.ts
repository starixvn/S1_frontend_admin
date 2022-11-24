import {
	IGetBankFinancialReportData,
	ITableColumnsInfo,
} from 'features/bankFinancialReport/type'
import { assign, cloneDeep } from 'lodash'
import { numberFormatter } from 'common/utils/format'
import { v4 as uuidV4 } from 'uuid'

export class TableConverter {
	// render table column
	static tableColumnConverter(target: any[], columnInfo: ITableColumnsInfo[]) {
		columnInfo.forEach(({ dataIndex: title }, idx) => {
			const insertItem = {
				title,
				key: title,
				dataIndex: title,
				align: 'center' as 'center',
				width: 100,
				render: (data: number) => numberFormatter.format(data ?? 0),
			}
			// 從第四筆依序插入
			target.splice(4 + idx, 0, insertItem)
		})
		return target
	}

	// 用來遞迴攤平 details
	private static flatDetail(target: IGetBankFinancialReportData) {
		const { details = {}, children = [], key } = target ?? {}
		assign(target, { key: uuidV4(), displayName: key, ...details })
		delete target.details
		if (children.length > 0) {
			children.forEach(child => TableConverter.flatDetail(child))
		}
		return target
	}

	// S2C
	static financialReportConverter(
		bankFinancialReport: IGetBankFinancialReportData[]
	): { dataSource: object[]; columnInfo: ITableColumnsInfo[] } {
		const result: object[] = []
		const columnInfo: ITableColumnsInfo[] = []
		// 沒資料直接退出
		if (bankFinancialReport?.length === 0)
			return {
				dataSource: [],
				columnInfo: [],
			}
		// column 欄位初始化
		const reportDetail = bankFinancialReport[0].details ?? {}
		Object.keys(reportDetail).forEach(key =>
			columnInfo.push({
				dataIndex: key,
			})
		)

		// dataSource 格式化
		bankFinancialReport.forEach(data => {
			const cloneData = cloneDeep(data)
			TableConverter.flatDetail(cloneData)
			result.push(cloneData)
		})

		return {
			dataSource: result,
			columnInfo,
		}
	}
}

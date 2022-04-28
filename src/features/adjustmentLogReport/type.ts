export interface FetchLogReportListInterface {
	pageNumber: number
	pageSize: number
	siteIds: number[]
	currencyIds: number[]
	menus: number[]
	actionTypes: number[]
	startDate: string
	endDate: string
	userName: string
	transId: string
}

export interface FetchLogReportListProps {
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

export interface LogReportInterface {
	createTime: string
	id: number
	currencyId: number
	isoCode: string
	siteId: number
	siteName: string
	menu: number
	menuFunction: string
	actionType: number
	actionTypeName: string
	refTransId: string
	beforeDetailInfo: string
	afterDetailInfo: string
	operator: string
}

export interface FetchLogReportListResponse {
	data: LogReportInterface[]
	rowCount: number
}

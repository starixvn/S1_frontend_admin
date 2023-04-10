import { Moment } from 'moment'

export interface IGetLeaderboardReportArgs {
	siteId: number
	currencyId: number
	startDate: string
	endDate: string
	categoryId: number
}

export interface IGetLeaderboardReportExport
	extends IGetLeaderboardReportArgs {}

export interface ILeaderboardReportData {
	ranking: string
	siteId: number
	custId: number
	userName: string
	currencyId: number
	isoCode: string
	turnOver: number
	points: number
}

export interface ILeaderBoardCategoryEnumData {
	name: string
	value: number
}

export interface IFilterForm {
	monthRange: Moment
	siteId: number
	currencyId: number
	categoryId: number
}

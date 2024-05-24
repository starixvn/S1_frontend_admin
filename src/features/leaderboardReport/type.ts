import { Dayjs } from 'dayjs'

export interface IGetLeaderboardReportArgs {
	siteIds: number[]
	currencyId: number
	startDate: string
	endDate: string
	categoryId: number
}

export interface IGetLeaderboardReportExport
	extends IGetLeaderboardReportArgs {}

export interface ILeaderboardReportData {
	detail: never[]
	ranking: string
	siteId?: number
	siteIds?: number[]
	siteName: string
	custId: number
	userName: string
	currencyId: number
	isoCode: string
	turnOver: number
	points: number
	reward: number
}

export interface ILeaderBoardCategoryEnumData {
	name: string
	value: number
}

export interface IFilterForm {
	monthRange: Dayjs
	siteId: number
	currencyId: number
	categoryId: number
}

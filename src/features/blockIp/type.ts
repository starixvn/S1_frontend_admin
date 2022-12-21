import { Moment } from 'moment'

export interface IForm {
	dateRange: [Moment, Moment]
	ip: string
}

export interface IBlockIPListArgs {
	ip: string
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
}

export interface IDeleteBlockIpArgs {
	siteId: number | undefined
	before: {
		ip: string
	}
}

export interface IBlockIpState {
	ip: string
	memo: string
	operator: string
	createTime: string
	location: string
}

export interface IBlockIpResponse {
	data: IBlockIpState[]
	rowCount: number
}

export interface IAddBlockIpArgs {
	siteId?: number
	after: {
		ip: string
		memo: string
	}
}

export interface IBlockIPListArgs {
	ip: string
	startDate: string
	endDate: string
	pageNumber: number
	pageSize: number
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

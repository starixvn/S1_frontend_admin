import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface BrandState {
	siteId: number
	siteName: string
}

export interface AssignBrandState {
	brand: BrandState[]
	loginTime: string
	updateTime: string
	userId: number
	userName: string
}

export type AssignBrandResponse = IAxiosResponse<AssignBrandState[]>

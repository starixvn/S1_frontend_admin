import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface ITeamInfo {
	countryId: number
	countryName: string
	sort: number
}

export interface IGetCupEventPredictionData {
	selectOptions: ITeamInfo[]
	top24Team: ITeamInfo[]
	roundOf16: ITeamInfo[]
	quarterFinals: ITeamInfo[]
	semiFinals: ITeamInfo[]
	['3rdPlace']: ITeamInfo[]
	final: ITeamInfo[]
}

export type IGetCupEventPredictionResponse =
	IAxiosResponse<IGetCupEventPredictionData>

export interface ISortedCupEventTeamData {
	index: number
	sort: number
	top24Team: ITeamInfo | undefined
	roundOf16: ITeamInfo | undefined
	quarterFinals: ITeamInfo | undefined
	semiFinals: ITeamInfo | undefined
	['3rdPlace']: ITeamInfo | undefined
	final: ITeamInfo | undefined
}

export type ISortedCupEventTeamResponse = IAxiosResponse<{
	selectOptions: ITeamInfo[]
	sortedCupEventTeamData: ISortedCupEventTeamData[]
}>

export interface ISetCupEventPredictionInfo {
	countryId: number
	sort: number
}

export interface ISetCupEventPredictionSetting {
	top24Team: ISetCupEventPredictionInfo[]
	roundOf16: ISetCupEventPredictionInfo[]
	quarterFinals: ISetCupEventPredictionInfo[]
	semiFinals: ISetCupEventPredictionInfo[]
	'3rdPlace': ISetCupEventPredictionInfo[]
	final: ISetCupEventPredictionInfo[]
}

export interface ISetCupEventPredictionSettingArgs {
	data: ISetCupEventPredictionSetting
}

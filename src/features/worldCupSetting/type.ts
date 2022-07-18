import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface ITeamInfo {
	countryId: number
	countryName: string
	sort: number
}

export interface IGetWorldCupPredictionData {
	selectOptions: ITeamInfo[]
	top32Team: ITeamInfo[]
	roundOf16: ITeamInfo[]
	quarterFinals: ITeamInfo[]
	semiFinals: ITeamInfo[]
	['3rdPlace']: ITeamInfo[]
	final: ITeamInfo[]
}

export type IGetWorldCupPredictionResponse =
	IAxiosResponse<IGetWorldCupPredictionData>

export interface ISortedWorldCupTeamData {
	index: number
	sort: number
	top32Team: ITeamInfo | undefined
	roundOf16: ITeamInfo | undefined
	quarterFinals: ITeamInfo | undefined
	semiFinals: ITeamInfo | undefined
	['3rdPlace']: ITeamInfo | undefined
	final: ITeamInfo | undefined
}

export type ISortedWorldCupTeamResponse = IAxiosResponse<{
	selectOptions: ITeamInfo[]
	sortedWorldCupTeamData: ISortedWorldCupTeamData[]
}>

export interface ISetWorldCupPredictionInfo {
	countryId: number
	sort: number
}

export interface ISetWorldCupPredictionSetting {
	top32Team: ISetWorldCupPredictionInfo[]
	roundOf16: ISetWorldCupPredictionInfo[]
	quarterFinals: ISetWorldCupPredictionInfo[]
	semiFinals: ISetWorldCupPredictionInfo[]
	'3rdPlace': ISetWorldCupPredictionInfo[]
	final: ISetWorldCupPredictionInfo[]
}

export interface ISetWorldCupPredictionSettingArgs {
	data: ISetWorldCupPredictionSetting
}

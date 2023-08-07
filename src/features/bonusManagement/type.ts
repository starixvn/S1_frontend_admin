import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export interface IGetBonusListArgs {
	promotionTypes: number[]
	status: number
	startDate: string
	currencyIds: number[]
	endDate: string
	device: number
	bonusCode: string | null
	isSpecial: boolean
	pageNumber: number
	pageSize: number
}

export type ICashBackSettingData = {
	percentage: number
	lossAmount: number
	cashBackTpInfos: Array<{ tpId: number; categoryId: number }>
}

export type ITierAmountListData = {
	bonus: number
	maxBonus?: number
	requiredAmount: number
	winOver: number
	rollOver: number
}

export type ISpecificData = {
	bonusCode: string
	currencyId: number
	siteId: number
	usage: number
	rollOver: number
	winOver: number
	bonus: number
	bonusType: number
	maxBonus: number
	details: string
	status: number
	requiredAmount: number
	lockedType: number
	minPayout: number
	vN_AffCodes: string
	totalUsageLimit: number
	cashBackSetting: ICashBackSettingData
	tierAmountList: ITierAmountListData[]
}

export interface ISpecificDataFrontend extends ISpecificData {
	isoCode?: string
	details: any
}

export type IDisplayConditionDescription = { vipLevel: number[] }
export interface IPromotionDisplayConditionData {
	id: number
	bonusCode: string
	siteId: number
	conditionType: number
	description: IDisplayConditionDescription
	updateTime: string
	createTime: string
}
export interface IGetBonusListData {
	bonusCode: string
	description: string
	promotionType: number
	categoryId: number
	periodFrom: string
	periodTo: string
	displayFrom: string
	displayTo: string
	unixPeriodFrom: number
	unixPeriodTo: number
	sort: number
	status: number
	expiryDays: number
	lastUpdateTime: string
	lastUpdateUser: string
	specific: ISpecificData[]
	siteId: number
	siteName: string
	walletType: number
	tpId: number
	redeemHours: number
	periodType: number
	periodDay: number
	specialCode: string
	isSpecial: boolean
	onlyRegistered: boolean
	promotionDeviceType: number
	promotionAction: number
	autoExtend: number
	promotionDisplayCondition: IPromotionDisplayConditionData[]
	currencyList: string[]
	currencys: string[]
}

export type IGetBonusListResponse = IAxiosResponse<IGetBonusListData[]>

export interface IGetByBonusCodeArgs {
	siteId?: number
	bonusCode: string
}

export interface IGetByBonusCodeData extends IGetBonusListData {
	sameDeviceIDRestrict: boolean
	sameDeviceIDAvailableCount: number
	sameIPRestrict: boolean
	sameIPRestrictAvailableCount: number
	sameRealNameRestrict: boolean
	sameRealNameRestrictAvailableCount: number
	blockTagList: number[]
	hideForUnlogin: boolean
}

export type IGetByBonusCodeResponse = IAxiosResponse<IGetByBonusCodeData>

export interface IUpdateStatusArgs {
	siteId?: number
	bonusCode: string
	status: number
}

export interface ISetArgs {
	isAdd: boolean
	promotionInfo: {
		bonusCode: string
		description: string
		promotionType: number
		categoryId: number
		periodFromTime: string
		periodToTime: string
		displayFromTime: string | null
		displayToTime: string | null
		expiryDays: number
		sort: number
		status: number
		siteId?: number
		walletType: number
		tpId: number
		periodType: number
		periodDay?: number
		specialCode: string
		isSpecial: boolean
		onlyRegistered: boolean
		promotionDeviceType: number
		promotionAction: number
		autoExtend: number
		specific: ISpecificData[]
		sameDeviceIDRestrict: boolean
		sameDeviceIDAvailableCount: number
		sameIPRestrict: boolean
		sameIPRestrictAvailableCount: number
		sameRealNameRestrict: boolean
		sameRealNameRestrictAvailableCount: number
		blockTagList: number[]
		hideForUnlogin: boolean
	}
	displayConditionAboutVipLevel: IDisplayCondition
}

export type IDisplayCondition = {
	isForVipLevel: boolean
	selectedVipLevel: Array<number | string>
}

export interface IDuplicateArgs {
	siteId?: number
	bonusCode: string
	newBonusCode: string
	newSpecialCode: string
	isSpecial: boolean
}

export interface IGetPromotionTypeData {
	type: number
	promotionTypeName: string
}

export type IGetPromotionTypeResponse = IAxiosResponse<IGetPromotionTypeData[]>

export enum UpdateMethodsEnum {
	create = 'createBonus',
}

export interface IExportScratchCardListArgs {
	specialCode: string
	status: number
}

export interface IGetScratchCardListArgs extends IExportScratchCardListArgs {
	pageNumber: number
	pageSize: number
}

export interface IGetScratchCardListData {
	specialCode: string
	scratchCardCode: string
	custId: number
	userName: string
	createTime: string
	updateTime: string
	lastUpdateUser: string
}

export type IGetScratchCardListResponse = IAxiosResponse<
	IGetScratchCardListData[]
>

export interface IGenScratchCardCodeArgs {
	specialCode: string
	num: number
}

export interface IGetCashBackGameListArgs {
	tpId: number
	categoryId: number
}

export interface IGetCashBackGameListData {
	gameName: string
	key: number
}

export type IGetCashBackGameListResponse = IAxiosResponse<
	IGetCashBackGameListData[]
>

export interface IGetPromotionCategoryArgs {
	walletType: number
}

export interface IGetPromotionCategoryData {
	id: number
	name: string
	tpId: number
}

export type IGetPromotionCategoryResponse = IAxiosResponse<
	IGetPromotionCategoryData[]
>

export interface IGetBonusUsingListArgs {
	siteId?: number
	bonusCode: string
}

export type IBonusUsingListData = {
	custId: number
	currency: string
	userName: string
	status: number
}

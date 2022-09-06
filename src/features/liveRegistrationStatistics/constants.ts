/*
# @name 取得註冊會員與狀態清單
# Request
# int siteId 站台Id
# int currencyId 幣別Id, 0:All
# int depositStatus 存款狀態, 0:All, 1:未存款過, 2:已存款過
# int status 客服註記狀態, 0:All, 1:Pending, 2:Done, 3: Invalid
# string userName 用戶名稱
# Datetime startDate 根據DateType所要查詢的起始時間
# Datetime endDate 根據DateType所要查詢的結束時間
# string affiliatesCode 用戶推薦碼
# int agentCodeType 1:CreditSite, 2:Others
# int callOutStatus 0: All,
#                   1: Panding1stCall -> 未打過
#                   2: Panding2stCall -> 打過一通
#                   3: Panding3stCall -> 打過兩通
#                   4: Panding4stCall -> 打過三通
#                   5: Panding5stCall -> 打過四通
#                   6: Panding6stCall -> 打過五通以上
# int dormantUser 最後活躍日(登入) 3: 3 Days Inactive -> 3天內
#                                 5: 5 Days Inactive -> 5天內
#                                 21: 1 Week Inactive -> 1周內
#                                 22: 2 Week Inactive -> 2周內
#                                 31: 1 Months Inactive -> 1個月內
#                                 32: 2 Months Inactive -> 2個月內
#                                 33: 3 Months Inactive -> 3個月內
# int dateType 1:Register Date, 2:Last Active Date
# int sort 1:正序, 2:反序
# int PageSize 1頁幾筆
# int PageNumber 第幾頁,從1開始
*/

export enum DateTypeEnum {
	RegisterDate = 1,
	LastActiveDate,
}

export enum StatusEnum {
	All = 0,
	Pending,
	Done,
	Invalid,
}

export enum DepositStatusEnum {
	All = 0,
	NonDeposit,
	Deposited,
}

export enum AgentCodeEnum {
	All = 0,
	CreditSite,
	Others,
}

export enum CallOutStatusEnum {
	All = 0,
	Panding1stCall, // * 未打過
	Panding2stCall, // * 打過一通
	Panding3stCall, // * 打過兩通
	Panding4stCall, // * 打過三通
	Panding5stCall, // * 打過四通
	Panding6stCall, // * 打過五通以上
}

// *  最後活躍日(登入)
export enum DormantMemberEnum {
	ThreeDaysInactive = 3, // * 3天內
	FiveDaysInactive = 5, // * 5天內
	OneWeekInactive = 21, // * 1周內
	TwoWeekInactive = 22, // * 2周內
	OneMonthsInactive = 31, // * 一個月內
	TwoMonthInactive = 32, // * 兩個月內
	ThreeMonthInactive = 33, // * 三個月內
}

export const DATE_TYPE_OPTIONS = [
	{
		displayKey: 'Label_LastActiveDate',
		value: DateTypeEnum.LastActiveDate,
	},
	{
		displayKey: 'Label_RegisterDate',
		value: DateTypeEnum.RegisterDate,
	},
]

export const STATUS_OPTIONS = [
	{
		displayKey: 'Label_All',
		value: StatusEnum.All,
	},
	{
		displayKey: 'Label_Pending',
		value: StatusEnum.Pending,
	},
	{
		displayKey: 'Label_Done',
		value: StatusEnum.Done,
	},
	{
		displayKey: 'Label_Invalid',
		value: StatusEnum.Invalid,
	},
]

export const DEPOSIT_STATUS_OPTIONS = [
	{
		displayKey: 'Label_All',
		value: DepositStatusEnum.All,
	},
	{
		displayKey: 'Label_NonDeposit',
		value: DepositStatusEnum.NonDeposit,
	},
	{
		displayKey: 'Label_Deposited',
		value: DepositStatusEnum.Deposited,
	},
]

export const AGENT_CODE_OPTIONS = [
	{
		displayKey: 'Label_All',
		value: AgentCodeEnum.All,
	},
	{
		displayKey: 'Label_CreditSite',
		value: AgentCodeEnum.CreditSite,
	},
	{
		displayKey: 'Label_Others',
		value: AgentCodeEnum.Others,
	},
]

export const CALL_OUT_STATUS_OPTIONS = [
	{
		displayKey: 'Label_All',
		value: CallOutStatusEnum.All,
	},
	{
		displayKey: 'Label_Panding1stCall',
		value: CallOutStatusEnum.Panding1stCall,
	},
	{
		displayKey: 'Label_Panding2stCall',
		value: CallOutStatusEnum.Panding2stCall,
	},
	{
		displayKey: 'Label_Panding3stCall',
		value: CallOutStatusEnum.Panding3stCall,
	},
	{
		displayKey: 'Label_Panding4stCall',
		value: CallOutStatusEnum.Panding4stCall,
	},
	{
		displayKey: 'Label_Panding5stCall',
		value: CallOutStatusEnum.Panding5stCall,
	},
	{
		displayKey: 'Label_Panding6stCall',
		value: CallOutStatusEnum.Panding6stCall,
	},
]

export const DORMANT_MEMBER_OPTIONS = [
	{
		displayKey: 'Label_3DaysInactive',
		value: DormantMemberEnum.ThreeDaysInactive,
	},
	{
		displayKey: 'Label_5DaysInactive',
		value: DormantMemberEnum.FiveDaysInactive,
	},
	{
		displayKey: 'Label_1WeekInactive',
		value: DormantMemberEnum.OneWeekInactive,
	},
	{
		displayKey: 'Label_2WeekInactive',
		value: DormantMemberEnum.TwoWeekInactive,
	},
	{
		displayKey: 'Label_1MonthInactive',
		value: DormantMemberEnum.OneMonthsInactive,
	},
	{
		displayKey: 'Label_2MonthInactive',
		value: DormantMemberEnum.TwoMonthInactive,
	},
	{
		displayKey: 'Label_3MonthInactive',
		value: DormantMemberEnum.ThreeMonthInactive,
	},
]

export enum StatusEnum {
	Inactive,
	Active,
}

export const BANNER_STATUS_OPTIONS: Array<{
	value: number
	displayName: string
}> = [
	{ value: StatusEnum.Active, displayName: 'Label_Active' },
	{ value: StatusEnum.Inactive, displayName: 'Label_Inactive' },
]

export enum ActionModeEnum {
	NoAction = 1,
	GoToGame,
	GoToBonus,
	OpenWindow,
	RedirectPage,
	RedirectPagesOfThisSite,
}

export enum UrlRouterEnum {
	Sports = 1,
	Casino,
	Referral,
	LeaderBoard,
	AngPow,
	Lottery,
}

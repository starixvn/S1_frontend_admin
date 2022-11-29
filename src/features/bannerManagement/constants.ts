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

// 因對應api返回小駝峰字串,固這邊enum皆為小駝峰
export enum UrlRouterEnum {
	sports = 1,
	'live-casino',
	referral,
	leaderBoard,
	angPow,
	lottery,
}

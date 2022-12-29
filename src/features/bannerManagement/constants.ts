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
	GoToLobby,
}

// 因對應api返回小駝峰字串,故這邊enum皆為小駝峰
export enum UrlRouterEnum {
	eSport = 1,
	'live-casino',
	liveCasino = 2,
	referral,
	leaderBoard,
	angPow,
	lottery,
	slots,
	casino = 7,
	game,
	games = 8,
	fishing,
	promotion,
	vip,
	deposit,
	rewards,
}

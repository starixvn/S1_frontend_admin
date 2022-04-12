export interface DashBoardDataTodayData {
	reportName: string
	noPlayer: number
	noAdjustmentPlayers: number
	noAdjustmentAmount: number
	totalDeposit: number
	totalWithdrawal: number
	totalBonus: number
	vaildTurnover: number
	ggr: number
	margin: number
	netRevenue: number
	netCash: number
}

export interface DashBoardData {
	onlinePlayers?: number
	todayNewRegPlayers?: number
	totalRegPlayers?: number
	pendingDeposit?: number
	pendingWithdrawal?: number
	todayData?: DashBoardDataTodayData[]
}

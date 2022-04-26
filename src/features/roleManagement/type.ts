export interface RoleManagementInterface {
	role: number
	roleName: string
	remark: string
	userId: number
	currencyList: string
	userList: string
	icurrencyList: number[]
	iuserList: string[]
}

export interface AddRolePermissionInterface {
	name: string
	mark: string
	currencyList: number[]
	permission: any[]
}

export interface RolePermissionInterface {
	currencyList: number[]
	mark?: string
	name?: string
	permission: any[]
	selectCurrencyList?: number[]
}

export interface UpdateRolePermissionInterface {
	name: string
	mark: string
	currencyList: number[]
	role?: number
	permission: any[]
}

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
	siteId?: number
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
	siteId?: number
}

export interface FormPermissionInterface {
	displayKey: number
	permissionIdList: number[]
}

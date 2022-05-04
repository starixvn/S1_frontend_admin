export interface UserAdminState {
	userId: number
	userName: string
	currencyList: string
	siteName: string
	roleName: null | string
	icurrencyList: number[]
}

export interface AdminUserPermissionInterface {
	moduleId: null
	disPlayKey: number
	name: string
	settings: {
		permissionId: number
		name: string
		canUse: boolean
		enable: boolean
	}[]

	functionDatas:
		| null
		| {
				disPlayKey: number
				name: string
				settings: {
					permissionId: number
					name: string
					canUse: boolean
					enable: boolean
				}[]
		  }[]
	subLayerDatas: null | AdminUserPermissionInterface[]
}

export interface AdminUserInterface {
	siteId: number
	userName: string
	password: any
	role: null | number
	permission: AdminUserPermissionInterface[]
	currencyList: number[]
	selectCurrencyList: number[]
}

export interface UpdateAdminUserArgs {
	userId: number
	siteId?: number
	userName: string
	password: string
	role: number
	currencyList: number[]
	permission: {
		displayKey: number
		permissionIdList: number[]
	}[]
}

export interface AddAdminUserArgs {
	siteId?: number
	userName: string
	password: string
	role: number
	currencyList: number[]
	permission: {
		displayKey: number
		permissionIdList: number[]
	}[]
}

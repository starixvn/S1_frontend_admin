export type RequestStatusType = 'idle' | 'pending' | 'succeeded' | 'failed'

export interface LocationState {
	state: {
		from: {
			pathname: string
			search: string
		}
	}
}

export interface PermissionInterface {
	permissionId: number
	name: string
	canUse: boolean
	enable: boolean
}

export interface MenuFunctionDatas {
	functionId: number
	name: string
	permission: PermissionInterface[]
}

export interface MenuInterface {
	moduleId?: number
	functionId: number | null
	name: string
	permission: PermissionInterface[]
	functionDatas?: MenuFunctionDatas[]
	subLayerDatas?: MenuInterface[]
}

export interface RolePermissionInterface {
	currencyList: number[]
	mark?: string
	name?: string
	permission: any[]
	selectCurrencyList?: number[]
}

export interface FormPermissionInterface {
	displayKey: number
	permissionIdList: number[]
}

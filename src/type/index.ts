export type RequestStatusType = 'idle' | 'pending' | 'succeeded' | 'failed'

export interface LocationState {
	state: {
		from: {
			pathname: string
		}
	}
}

interface MenuPermission {
	permissionId: number
	name: string
	canUse: boolean
}

export interface MenuFunctionDatas {
	functionId: number
	name: string
	permission: MenuPermission[]
}

export interface MenuInterface {
	moduleId?: number
	functionId: number | null
	name: string
	permission: MenuPermission[]
	functionDatas?: MenuFunctionDatas[]
	subLayerDatas?: MenuInterface[]
}

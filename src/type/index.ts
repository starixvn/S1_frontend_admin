export type RequestStatusType = 'idle' | 'pending' | 'succeeded' | 'failed'

export interface LocationState {
	state: {
		from: {
			pathname: string
			search: string
		}
	}
}

export interface UserDataState {
	userId: number
	userName: string
	userpwd: null
	isSuper: boolean
	status: boolean
	createTime: string
	role: null
	currencyList: string
	siteId: number
	loginTime: string
}
export interface ActionPermissions {
	viewPermission: PermissionInterface
	exportExcelPermission: PermissionInterface
	editPermission: PermissionInterface
	deletePermission: PermissionInterface
	addPermission: PermissionInterface
	rejectPermission: PermissionInterface
	rickPermission: PermissionInterface
	paymentPermission: PermissionInterface
	executePermission: PermissionInterface
	addBatchPermission: PermissionInterface
	transferPermission: PermissionInterface
	setActivePermission: PermissionInterface
	appeovedPermission: PermissionInterface
	changePasswordPermission: PermissionInterface
	editInfoPermission: PermissionInterface
	resetPasswordPermission: PermissionInterface
	blockBankAccPermission: PermissionInterface
	betLimitPermission: PermissionInterface
	csdLogPermission: PermissionInterface
	isKycPermission: PermissionInterface
	lockAccountPermission: PermissionInterface
	resetCryptoInfoPermission: PermissionInterface
	gameExclusionPermission: PermissionInterface
	financeLogPermission: PermissionInterface
	isRickPermission: PermissionInterface
	closeAccountPermission: PermissionInterface
	verifiedRewardPermission: PermissionInterface
	gameLogPermission: PermissionInterface
	phoneVerifiedPermission: PermissionInterface
	kickOutPermission: PermissionInterface
	enablePromotionPermission: PermissionInterface
	marketingLogPermission: PermissionInterface
	emailVerifiedPermission: PermissionInterface
	blockIPPermission: PermissionInterface
	lockRebatePayoutPermission: PermissionInterface
	settingPermission: PermissionInterface
	adminUserLogPermission: PermissionInterface
	addPointBatchPermission: PermissionInterface
	add3RDPermission: PermissionInterface
}

export interface PermissionInterface {
	permissionId: number
	name: string
	canUse: boolean
	enable?: boolean
}

export interface MenuFunctionData {
	functionId: number
	name: string
	permission: PermissionInterface[]
}

export interface MenuInterface {
	moduleId?: number
	functionId: number | null
	name: string
	permission: PermissionInterface[]
	functionDatas?: MenuFunctionData[]
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

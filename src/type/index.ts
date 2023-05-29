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
	marketingLogPermission: PermissionInterface
	emailVerifiedPermission: PermissionInterface
	blockIPPermission: PermissionInterface
	lockRebatePayoutPermission: PermissionInterface
	settingPermission: PermissionInterface
	adminUserLogPermission: PermissionInterface
	addPointBatchPermission: PermissionInterface
	readDetailPermission: PermissionInterface
	customerInfoPermission: PermissionInterface
	editFullNamePermission: PermissionInterface
	editEMailPermission: PermissionInterface
	editPhoneNumberPermission: PermissionInterface
	changeVIPLevelPermission: PermissionInterface
	editBirthdayPermission: PermissionInterface
	editAddressPermission: PermissionInterface
	lineUnbindingPermission: PermissionInterface
	editTagPermission: PermissionInterface
	cancelPromotionPermission: PermissionInterface
	resetEWalletPermission: PermissionInterface
	phoneVerifiedRewardPermission: PermissionInterface
	emailVerifiedRewardPermission: PermissionInterface
	noteEditPermission: PermissionInterface
	noteDeletePermission: PermissionInterface
	personalMessageEditPermission: PermissionInterface
	smsInfoDeletePermission: PermissionInterface
	add3RDPermission: PermissionInterface
	resetBankInfoPermission: PermissionInterface
	onHoldPermission: PermissionInterface
	pendingPermission: PermissionInterface
	approvedPermission: PermissionInterface
	draftPermission: PermissionInterface
	manualApprovedPermission: PermissionInterface
	manualRejectPermission: PermissionInterface
	verifiedPermission: PermissionInterface
	processPermission: PermissionInterface
	toKycPermission: PermissionInterface
	sendMessagePermission: PermissionInterface
	addEditPermission: PermissionInterface
	setFeePermission: PermissionInterface
	uploadReceiptPermission: PermissionInterface
	deleteReceiptPermission: PermissionInterface
	checkReceiptPermission: PermissionInterface
	setAmountPermission: PermissionInterface
	editAutoWithdrawalRulePermission: PermissionInterface
	forceProceed: PermissionInterface
	exclusiveVipPermission: PermissionInterface
	setLiveStreamingGamePermission: PermissionInterface
	registerMemberPermission: PermissionInterface
	resetOtpLimitPermission: PermissionInterface
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

// * 升序及降序
export enum OrderEnum {
	descend = 0,
	ascend = 1,
}

export enum DepositTypeEnum {
	OnlineBanking = 1,
	MobilePay,
	LocalBanking,
	CryptoPay,
	LoadCard,
	QRPay,
	BankAutoChannel,
	CryptoWallet,
}

export interface ICustInfoDetailTpWallet {
	tpId: number
	tpName: string
	tpUserName: string
	balance: number
	walletType: number
}

export interface ICustInfoDetailPromotion {
	_claimDate: string
	_updateTime: string
	bonusId: number
	bonusCode: string
	description: string
	promotionType: number
	categoryId: number
	categoryName: null | string
	expiryDays: number
	periodTo: number
	currencyId: number
	rollOver: number
	fullFillType: number
	bonus: number
	bonusType: number
	maxBonus: number
	lockedAmount: number
	bonusAmount: number
	expiryTime: string
	bonusInfoStatus: number
	sort: number
	custRollOver: {
		rollOver: number
		winOver: number
		turnOver: number
	}
	claimDate: string
	updateTime: string
	atPage: number
	cancelBonusAmount: number
	expiredCancel: boolean
}

export interface ICustLineProfile {
	custId: number
	userId: string
	createTime: null | string
}

export interface ICustBonusSum {
	firstDeposit: number
	reDeposit: number
	freeBet: number
	cashBack: number
	retentionBonus: number
	manualBonus: number
	cancelBonusAmount: number
	rewardPoint: number
	totalBonus: number
}

export interface ICustRewardSum {
	custRewardType: {
		typeId: number
		typeName: string
		rewardAmountSum: number
	}[]
	custRewardTotalSum: number
}

export interface ICustRebateSum {
	custRebateCategory: [
		{
			categoryId: number
			categoryName: string
			rebateAmountSum: number
		},
		{
			categoryId: number
			categoryName: string
			rebateAmountSum: number
		}
	]
	custRebateTotalSum: number
}

export interface ICustInfoDetailData {
	siteName: string
	siteId: number
	custId: number
	userName: string
	currencyId: number
	userLevel: number
	pointLevel: number
	vipLevel: number
	agent: string
	userLang: string
	actStatus: number
	isTest: boolean
	isKyc: boolean
	isRisk: boolean
	phoneVerified: boolean
	emailVerified: boolean
	verificationType: number
	custPhoneReward: null | number
	custEmailReward: null | number
	verificationReward: null | string
	iovation: string
	status: number
	lastLoginTime: string
	regTime: string
	email: string
	profile: string
	balance: number
	depositSum: number
	withdrawlSum: number
	effectiveBetSum: number
	hasPhotoId: boolean
	accountName: string
	countryCode: string
	areaCode: string
	phoneNo: string
	birth_d: string
	birth_m: string
	birth_y: string
	sabaID: null | string
	winnings: number
	losses: number
	withdrawalLimit: number
	turnOver: number
	tpWallet: ICustInfoDetailTpWallet[]
	promotions: ICustInfoDetailPromotion[]
	affiliateId: null | string
	reloadTime: null | string
	lastTagUpdateTime: null | string
	lastStatusUpdateTime: string
	ip: null | string
	levelName: string
	affiliateCode: null | string
	totalAdjustment: number
	totalBonusClaimed: number
	lastWithdrawlTime: string
	lastDepositTime: string
	lastBettingTime: string
	firstDepositTime: string
	tagList: string
	iTagList: number[]
	enablePromotion: number
	bonus: number
	enableRebatePayout: number
	custLineProfile: null | ICustLineProfile
	addressCountry: null | string
	addressState: null | string
	addressPostCode: null | string
	addressCity: null | string
	addressLineFirst: null | string
	addressLineSecond: null | string
	enableRebate: number
	deviceScore: null | number
	shieldId: null | string
	custBonusSum: ICustBonusSum
	custRebateSum: ICustRebateSum
	custRewardSum: ICustRewardSum
}

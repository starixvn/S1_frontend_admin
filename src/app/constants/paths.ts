// * memberProfile 和 memberAdministrationList 共用同一個 functionId
const memberAdminFunctionId = 22

const paths = {
	layout: {
		root: '/',
	},
	dashboard: {
		root: 'dashboard',
		functionId: 1,
	},
	login: {
		root: 'login',
	},
	memberProfile: {
		root: 'memberProfile',
		functionId: memberAdminFunctionId,
	},
	assignBrand: {
		root: 'AssignBrand',
	},
	customerSupport: {
		root: 'customerSupport',
		sub: {
			memberAdministrationList: {
				root: 'customerSupport/memberAdministrationList',
				functionId: memberAdminFunctionId,
			},
			operatorService: {
				root: 'customerSupport/operatorService',
				sub: {
					liveRegistrationStatistics: {
						root: 'customerSupport/operatorService/liveRegistrationStatistics',
						functionId: 23,
					},
					otpVerificationReport: {
						root: 'customerSupport/operatorService/otpVerificationReport',
						functionId: 131,
					},
				},
			},
		},
	},
	csd: {
		root: 'csd',
		sub: {
			memberListing: {
				root: 'csd/memberListing',
			},
			changeVipLevel: {
				root: 'csd/changeVipLevel',
			},
			tagManagement: {
				root: 'csd/tagManagement',
			},
			registrationReport: {
				root: 'csd/registrationReport',
			},
			tpFailRecordReport: {
				root: 'csd/tpFailRecordReport',
			},
			personalMsgBatch: {
				root: 'csd/personalMsgBatch',
			},
			teleMarketing: {
				root: 'csd/teleMarketing',
			},
			withdrawalSetting: {
				root: 'csd/withdrawalSetting',
			},
			memberGameExclusion: {
				root: 'csd/memberGameExclusion',
			},
			userBetLimit: {
				root: 'csd/userBetLimit',
			},
		},
	},
	content: {
		root: 'content',
		sub: {
			announcement: {
				root: 'announcement',
			},
			newsManage: {
				root: 'csd/newsManage',
			},
			bannerManage: {
				root: 'csd/bannerManage',
			},
			gameCasinoManagement: {
				root: 'csd/gameCasinoManagement',
			},
			hotEventManagement: {
				root: 'csd/root',
			},
			videoManagement: {
				root: 'csd/videoManagement',
			},
			domainManage: {
				root: 'csd/domainManage',
			},
			gameProviderMaintenance: {
				root: 'csd/gameProviderMaintenance',
			},
			leaderBoardPointManagement: {
				root: 'csd/leaderBoardPointManagement',
			},
			appDownloadUrlManagement: {
				root: 'csd/appDownloadUrlManagement',
			},
			slotGamesManagement: {
				root: 'csd/slotGamesManagement',
			},
			gameDisplayManagement: {
				root: 'csd/gameDisplayManagement',
			},
		},
	},
	finance: {
		root: 'finance',
		sub: {
			depositListing: {
				root: 'finance/depositListing',
			},
			withdrawalKycControl: {
				root: 'finance/withdrawalKycControl',
				functionId: 37,
			},
			withdrawalListing: {
				root: 'finance/withdrawalListing',
			},
			withdrawalReconcile: {
				root: 'finance/withdrawalReconcile',
			},
			withdrawableAdjustment: {
				root: 'finance/withdrawableAdjustment',
			},
			withdrawableAdjustmentBatch: {
				root: 'finance/withdrawableAdjustmentBatch',
			},
			adjustmentListing: {
				root: 'finance/adjustmentListing',
			},
			gameWalletAdjustment: {
				root: 'finance/gameWalletAdjustment',
			},
			depositTime: {
				root: 'finance/depositTime',
			},
			withdrawalTime: {
				root: 'finance/withdrawalTime',
			},
			adjustment: {
				root: 'finance/adjustment',
				sub: {
					balanceAdjustment: {
						root: 'finance/adjustment/balanceAdjustment',
						functionId: 31,
					},
				},
			},
			bankInfoList: {
				root: 'finance/bankInfoList',
			},
			bankTransferAccount: {
				root: 'finance/bankTransferAccount',
			},
			paymentGateway: {
				root: 'finance/paymentManagement',
				functionId: 39,
			},
			depositLimit: {
				root: 'finance/depositLimit',
			},
			withdrawalLimit: {
				root: 'finance/withdrawalLimit',
			},
			cryptoWithdrawalLimit: {
				root: 'finance/cryptoWithdrawalLimit',
			},
			adjustmentLimit: {
				root: 'finance/adjustmentLimit',
			},
			reconciliationAccount: {
				root: 'finance/reconciliationAccount',
			},
			reconciliationReason: {
				root: 'finance/reconciliationReason',
			},
			lineChannelManagement: {
				root: 'finance/lineChannelManagement',
			},
			accounting: {
				root: 'finance/accounting',
				sub: {
					depositAccounting: {
						root: 'finance/accounting/depositAccounting',
						functionId: 99,
					},
				},
			},
			setting: {
				root: 'finance/setting',
				sub: {
					eWalletSetting: {
						root: 'finance/setting/eWalletSetting',
						functionId: 122,
					},
					bankAccManagement: {
						root: 'finance/setting/bankAccManagement',
						functionId: 38,
					},
					withdrawalLimitation: {
						root: 'finance/setting/withdrawalLimitation',
						functionId: 41,
					},
					depositLimitation: {
						root: 'finance/setting/depositLimitation',
						functionId: 40,
					},
					adjustmentLimitation: {
						root: 'finance/setting/adjustmentLimitation',
						functionId: 43,
					},
				},
			},
			depositWithdrawalSector: {
				root: 'finance/depositWithdrawalSector',
				sub: {
					depositSubmission: {
						root: 'finance/depositWithdrawalSector/depositSubmission',
						functionId: 29,
					},
					withdrawalSubmission: {
						root: 'finance/depositWithdrawalSector/withdrawalSubmission',
						functionId: 125,
					},
					withdrawalAdjustment: {
						root: 'finance/depositWithdrawalSector/withdrawalAdjustment',
						functionId: 30,
					},
					depositOperator: {
						root: 'finance/depositWithdrawalSector/depositOperator',
						functionId: 27,
					},
				},
			},
			issueBonusManagement: {
				root: 'finance/issueBonusManagement',
				functionId: 33,
			},
			report: {
				root: 'finance/report',
				sub: {
					depositTimeReport: {
						root: 'finance/report/DepositTimeReport',
						functionId: 34,
					},
					paymentAdjustment: {
						root: 'finance/report/paymentAdjustment',
						functionId: 36,
					},
				},
			},
		},
	},
	marketing: {
		root: 'marketing',
		sub: {
			drawPrizeReport: {
				root: 'marketing/drawPrizeReport',
			},
			vipLevelReview: {
				root: 'marketing/vipLevelReview',
			},
			bonusImport: {
				root: 'marketing/bonusImport',
			},
			bonusManagement: {
				root: 'marketing/bonusManagement',
				functionId: 45,
			},
			appliedBonus: {
				root: 'marketing/appliedBonus',
			},
			pendingBonus: {
				root: 'marketing/pendingBonus',
			},
			rebateInfoReport: {
				root: 'marketing/rebateInfoReport',
			},
			rebateReport: {
				root: 'marketing/rebateReport',
			},
			vipRebateManagement: {
				root: 'marketing/vipRebateManagement',
				functionId: 49,
			},
			referralManagement: {
				root: 'marketing/referralManagement',
				functionId: 48,
			},
			editReferralManagement: {
				root: 'marketing/referralManagement/edit',
				functionId: 48,
			},
			referralReport: {
				root: 'marketing/referralReport',
				functionId: 77,
			},
			referralCustReport: {
				root: 'marketing/referralReport/log',
				functionId: 77,
			},
			verificationRewardManagement: {
				root: 'marketing/verificationRewardManagement',
				functionId: 47,
			},
			pointLevelManagement: {
				root: 'marketing/pointLevelManagement',
				functionId: 52,
			},
		},
	},
	game: {
		root: 'game',
		sub: {
			betFailureRecord: {
				root: 'game/betFailureRecord',
			},
		},
	},
	report: {
		root: 'report',
		sub: {
			mainFinancialReport: {
				root: 'report/mainFinancialReport',
			},
			depositReport: {
				root: 'report/depositReport',
			},
			statisticalReport: {
				root: 'report/statisticalReport',
			},
			customerStatisticalReport: {
				root: 'report/customerStatisticalReport',
			},
			userOnlineReport: {
				root: 'report/userOnlineReport',
			},
			transferInfoReport: {
				root: 'report/transferInfoReport',
			},
			bankFinancialReport: {
				root: 'report/bankFinancialReport',
			},
			betList: {
				root: 'report/betList',
				functionId: 100,
			},
			worldCupTeamReport: {
				root: 'report/worldCupTeamReport',
				functionId: 116,
			},
			worldCupMemberReport: {
				root: 'report/worldCupMemberReport',
				functionId: 115,
			},
			rewardBonusExport: {
				root: 'report/rewardBonusExport',
				functionId: 124,
			},
			bonusReport: {
				root: 'report/bonusReport',
				functionId: 73,
			},
			vipRebateReport: {
				root: 'report/vipRebateReport',
				functionId: 75,
			},
			drawPrizeReport: {
				root: 'report/drawPrizeReport',
				functionId: 78,
			},
			gameStatisticalReport: {
				root: 'report/gameStatisticalReport',
				functionId: 132,
			},
		},
	},
	member: {
		root: 'member',
		sub: {
			blockEWallet: {
				root: 'member/blockewallet',
				functionId: 118,
			},
		},
	},
	risk: {
		root: 'risk',
		sub: {
			blockBankAccount: {
				root: 'Risk/BlockBankAccount',
				functionId: 70,
			},
			blockIp: {
				root: 'Risk/BlockIp',
				functionId: 71,
			},
		},
	},
	bankTransfer: {
		root: 'bankTransfer',
		sub: {
			transferAccountManagement: {
				root: 'bankTransfer/transferAccountManagement',
				functionId: 86,
			},
			transferInfoManagement: {
				root: 'bankTransfer/transferInfoManagement',
				functionId: 85,
			},
			reasonManagement: {
				root: 'bankTransfer/reasonManagement',
				functionId: 87,
			},
			bankFinancialReport: {
				root: 'bankTransfer/bankFinancialReport',
				functionId: 89,
			},
		},
	},
	productManagement: {
		root: 'productManagement',
		sub: {
			slotGameCategory: {
				root: 'productManagement/slotGameCategory',
				functionId: 126,
			},
		},
	},
	rewardProgram: {
		root: 'rewardProgram',
		sub: {
			pointSetting: {
				root: 'rewardProgram/pointSetting',
				sub: {
					depositPoint: {
						root: 'rewardProgram/pointSetting/depositPoint',
						functionId: 109,
					},
					inactivePointExpiry: {
						root: 'rewardProgram/pointSetting/inactivePointExpiry',
						functionId: 110,
					},
					turnoverPoint: {
						root: 'rewardProgram/pointSetting/turnoverPoint',
						functionId: 108,
					},
					turnoverPointSetting: {
						root: 'rewardProgram/pointSetting/turnoverPoint/detail',
						functionId: 108,
					},
				},
			},
			giftManagement: {
				root: 'rewardProgram/giftManagement',
				sub: {
					giftListing: {
						root: 'rewardProgram/giftManagement/giftListing',
						functionId: 106,
					},
					addGiftListing: {
						root: 'rewardProgram/giftManagement/addGiftListing',
						functionId: 106,
					},
					editGiftListing: {
						root: 'rewardProgram/giftManagement/GiftListing/Edit',
						functionId: 106,
					},
					redemptionLimit: {
						root: 'rewardProgram/giftManagement/redemptionLimit',
						functionId: 113,
					},
				},
			},
			memberList: {
				root: 'rewardProgram/memberList',
				functionId: 104,
				sub: {
					memberListLog: {
						root: 'rewardProgram/memberList/log',
						functionId: 104,
					},
				},
			},
			redemptionListing: {
				root: 'rewardProgram/redemptionListing',
				functionId: 103,
			},
			redemptionDetail: {
				root: 'rewardProgram/redemptionDetail',
				functionId: 103,
			},
			report: {
				root: 'rewardProgram/report',
				sub: {
					adjustmentPointReport: {
						root: 'rewardProgram/report/adjustmentPointReport',
						functionId: 119,
					},
					depositPointReport: {
						root: 'rewardProgram/report/depositPointReport',
						functionId: 120,
					},
					turnoverPointReport: {
						root: 'rewardProgram/report/turnoverPointReport',
						functionId: 121,
					},
				},
			},
		},
	},
	administration: {
		root: 'Administration',
		sub: {
			roleManagement: {
				root: 'Administration/RoleManagement',
				functionId: 90,
			},
			addRoleManagement: {
				root: 'Administration/RoleManagement/AddNew',
				functionId: 90,
			},
			editRoleManagement: {
				root: 'Administration/RoleManagement/Edit',
				functionId: 90,
			},
			userSetting: {
				root: 'Administration/userSetting',
				functionId: 91,
			},
			addUserSetting: {
				root: 'Administration/UserSetting/AddUserSetting',
				functionId: 91,
			},
			editUserSetting: {
				root: 'Administration/UserSetting/EditUserSetting',
				functionId: 91,
			},
			adjustmentLogReport: {
				root: 'Administration/AdjustmentLogReport',
				functionId: 93,
			},
			specialPasswordManagement: {
				root: 'administration/specialPasswordManagement',
				functionId: 92,
			},
		},
	},
	systemSetting: {
		root: 'systemSetting',
		sub: {
			exchangeUsdRate: {
				root: 'systemSetting/exchangeUsdRate',
				functionId: 129,
			},
			bettingMonitorSetting: {
				root: 'systemSetting/bettingMonitorSetting',
				functionId: 135,
			},
		},
	},

	cms: {
		root: 'cms',
		sub: {
			worldCupSetting: {
				root: 'cms/worldCupSetting',
				functionId: 114,
			},
			siteMaintenance: {
				root: 'cms/siteMaintenance',
				functionId: 117,
			},
			urlManagement: {
				root: 'cms/urlManagement',
				sub: {
					snsManagement: {
						root: 'cms/urlManagement/snsManagement',
						functionId: 123,
					},
					lineDepositChannel: {
						root: 'cms/urlManagement/lineDepositChannel',
						functionId: 67,
					},
					appQrCode: {
						root: 'cms/urlManagement/appQrCode',
						functionId: 65,
					},
					providerAppDownload: {
						root: 'cms/urlManagement/providerAppDownload',
						functionId: 66,
					},
				},
			},
			hotEventManagement: {
				root: 'cms/hotEventManagement',
				functionId: 56,
			},
			bannerManage: {
				root: 'cms/bannerManage',
				functionId: 55,
			},
		},
	},
}

export default paths

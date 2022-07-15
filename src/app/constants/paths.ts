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
	assignBrand: {
		root: 'AssignBrand',
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
			},
			bankInfoList: {
				root: 'finance/bankInfoList',
			},
			bankTransferAccount: {
				root: 'finance/bankTransferAccount',
			},
			paymentGateway: {
				root: 'finance/paymentGateway',
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
			vipRebateReport: {
				root: 'marketing/vipRebateReport',
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
			verificationReward: {
				root: 'marketing/verificationReward',
			},
			verificationRewardManagement: {
				root: 'marketing/verificationRewardManagement',
			},
			pointLevelManagement: {
				root: 'marketing/pointLevelManagement',
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
		},
	},
}

export default paths

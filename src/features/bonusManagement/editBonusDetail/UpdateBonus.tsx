import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { useAuth, useModal } from 'common/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import {
	IGetByBonusCodeResponse,
	IGetPromotionCategoryResponse,
	IGetPromotionTypeResponse,
	UpdateMethodsEnum,
} from 'features/bonusManagement/type'
import { Col, Form, message, Row } from 'antd'
import { BonusDetailMainForm } from 'features/bonusManagement/editBonusDetail/BonusDetailMainForm'
import {
	useGetPromotionCategoryQuery,
	useGetPromotionListQuery,
	useLazyGetBonusUsingListQuery,
	useLazyGetByBonusCodeQuery,
	useSetBonusMutation,
	useSetBonusUsingListMutation,
} from 'features/bonusManagement/api'
import {
	IVipLevelsResponse,
	useGetVipLevelQuery,
} from 'common/service/allDataApi'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { BonusDetailTab } from 'features/bonusManagement/editBonusDetail/BonusDetailTab'
import { useGetLanguageListQuery } from 'common/service/permissionApi/api'
import { head, isEmpty, trim } from 'lodash'
import { BannerInfoEditTab } from 'features/bonusManagement/editBonusDetail/BannerInfoEditTab'
import { EditDetailModal } from 'features/bonusManagement/editBonusDetail/EditDetailModal'
import { Currency } from 'common/enum/type'
import moment from 'moment'
import {
	displayConditionRequestConverter,
	displayConditionResponseConverter,
	specificDataConverter,
	specificRequestDataConverter,
} from 'features/bonusManagement/utils'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'
import { SetGroupModal } from 'features/bonusManagement/editBonusDetail/SetGroupModal'
import { dateRangeToUtcFormatter, isJSON } from 'common/utils'
import {
	BonusTypeEnum,
	StatusEnum,
	WalletTypeEnum,
} from 'features/bonusManagement/constants'
import { useGetAllTagQuery } from 'features/memberAdministrationList/api'
import { RcFile } from 'antd/es/upload'
import { MemberListModal } from 'features/bonusManagement/editBonusDetail/MemberListModal'

const UpdateBonus: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { bonusCode } = useParams()
	const navigate = useNavigate()
	// 供 getCategory 使用的參數
	const currentWalletType = Form.useWatch('walletType', form)
	// Title 文字顯示
	const bonusMethod =
		bonusCode === UpdateMethodsEnum.create ? t('Label_CreateBonus') : bonusCode
	// 用來控制是 Edit or Create
	const isEdit = bonusCode !== UpdateMethodsEnum.create

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [currentCurrency, setCurrentCurrency] = useState<Currency>(
		head(currencyListBySite) as Currency
	)
	// 切換頁籤時  控制是否顯示底下 banner 設置欄位 , 若主tab 為 active 才顯示
	const [currentTabActive, setCurrentTabActive] = useState<boolean>(false)

	// 傳給 modal 使用的 tabsKey
	const [infoTabsKey, setInfoTabsKey] = useState<string>('')
	const editDetailModal = useModal()
	// BonusType 為 Tier Redeposit 時需要用到的彈窗
	const setGroupBonusModal = useModal()
	const usingListModal = useModal()

	const {
		data: { data: bonusTypeList = [] } = {} as IGetPromotionTypeResponse,
		isFetching: isGetPromotionListDataLoading,
	} = useGetPromotionListQuery(null)

	const {
		data: { data: vipLevelList = [] } = {} as IVipLevelsResponse,
		isLoading: isGetVipLevelListLoading,
	} = useGetVipLevelQuery({ siteIdForFilter: siteId })

	const {
		data: { data: categoryListData = [] } = {} as IGetPromotionCategoryResponse,
		isFetching: isGetCategoryListLoading,
	} = useGetPromotionCategoryQuery({ walletType: currentWalletType })

	const {
		data: { data: langCodes = [] } = {},
		isFetching: isGetLanguageListFetching,
	} = useGetLanguageListQuery({
		siteId,
		currencyId: currentCurrency.currencyId,
	})

	const [
		getByBonusCode,
		{
			data: { data: bonusDetailData } = {} as IGetByBonusCodeResponse,
			isFetching: isGetBonusDetailLoading,
		},
	] = useLazyGetByBonusCodeQuery()

	const { data: { data: tagList = [] } = {} } = useGetAllTagQuery()

	const [setBonus, { isLoading: isSetBonusLoading }] = useSetBonusMutation()

	const [
		getBonusUsingList,
		{ data: bonusUsingList = [], isFetching: isGetBonusUsingListLoading },
	] = useLazyGetBonusUsingListQuery()

	const [setBonusUsingList, { isLoading: isSetBonusUsingListLoading }] =
		useSetBonusUsingListMutation()

	const handleGetBonusDetail = async () => {
		if (!bonusCode) return
		try {
			await getByBonusCode({ siteId, bonusCode }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSaved = async () => {
		try {
			await form.validateFields()
			const formData = form.getFieldsValue(true)

			const {
				bonusCode: formBonusCode,
				autoExtend,
				bonusType: promotionType,
				categoryId,
				activeDate,
				displayDate,
				description,
				expiryDays,
				isSpecial,
				mainFormActive: status,
				onlyRegistered,
				periodType,
				promotionDeviceType,
				selectedVipLevel,
				sort,
				specialCode,
				specific: rawSpecific,
				walletType,
				details: rawDetails,
				tpId,
				promotionAction,
				isDisplayDate,
				sameDeviceIDRestrict = false,
				sameDeviceIDAvailableCount,
				sameIPRestrict = false,
				sameIPRestrictAvailableCount,
				sameRealNameRestrict = false,
				sameRealNameRestrictAvailableCount,
				blockTagList,
				hideForUnlogin,
				isPopUp = false,
			} = formData

			// 時區一律設定成 +0
			const [periodFromTime, periodToTime] = dateRangeToUtcFormatter(
				[activeDate[0], activeDate[1]],
				0
			)
			const [displayFromTime, displayToTime] = dateRangeToUtcFormatter(
				[displayDate[0], displayDate[1]],
				0
			)

			const handleGetTpId = () => {
				if (promotionType === BonusTypeEnum.Rebate) return null
				if (categoryId === 0) return 0
				return tpId
			}

			let foundEmptyTier = false
			// 如果bonusType為MissionBonus,提交前要判斷是否有添加級距
			if (promotionType === BonusTypeEnum.MissionBonus) {
				foundEmptyTier = Object.keys(rawSpecific).some(currency => {
					const { tierAmountList } = rawSpecific[currency]
					return Array.isArray(tierAmountList) && tierAmountList.length === 0
				})
			}

			// 在送單時才驗證時間，displayDate 結束不可超過 periodDate結束時間
			if (displayToTime > periodToTime) {
				message.error(t('Label_BonusManagementDisplayTimeErrorMsg'))
			} else if (
				foundEmptyTier &&
				promotionType === BonusTypeEnum.MissionBonus
			) {
				message.error(t('Label_Required', { key: t('Label_SetAmountGroup') }))
			} else {
				try {
					await setBonus({
						isAdd: !isEdit,
						promotionInfo: {
							siteId,
							bonusCode: formBonusCode,
							description,
							autoExtend: Number(autoExtend),
							promotionType,
							expiryDays,
							isSpecial,
							status: status ? StatusEnum.Active : StatusEnum.InActive,
							onlyRegistered,
							periodType,
							promotionDeviceType,
							sort,
							specialCode: isSpecial ? specialCode : null,
							categoryId:
								promotionType === BonusTypeEnum.Rebate ? 0 : categoryId,
							walletType:
								promotionType === BonusTypeEnum.Rebate ? null : walletType,
							tpId: handleGetTpId(),
							periodFromTime,
							periodToTime,
							// * 當未勾選 isDisplayDate 則 displayFromTime、displayToTime 皆送 null 給後端
							displayFromTime: isDisplayDate ? displayFromTime : null,
							displayToTime: isDisplayDate ? displayToTime : null,
							promotionAction,
							specific: specificRequestDataConverter({
								specific: rawSpecific,
								details: rawDetails,
								bonusCode: formBonusCode,
								walletType: Number(walletType),
								categoryId: Number(categoryId),
								tpId: Number(tpId),
								promotionType,
							}),
							blockTagList,
							sameDeviceIDRestrict,
							sameDeviceIDAvailableCount: sameDeviceIDAvailableCount ?? 0,
							sameIPRestrict,
							sameIPRestrictAvailableCount: sameIPRestrictAvailableCount ?? 0,
							sameRealNameRestrict,
							sameRealNameRestrictAvailableCount:
								sameRealNameRestrictAvailableCount ?? 0,
							hideForUnlogin,
							isPopUp,
						},
						displayConditionAboutVipLevel:
							displayConditionRequestConverter(selectedVipLevel),
					}).unwrap()
					message.success(t('System.Label_Success'))
					navigate(-1)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
			}
		} catch (error) {
			// 驗證層
			const { errorFields } = error
			const { name, errors } = errorFields[0]
			// name > 1 代表是巢狀結構 , 為 detail 欄位 , 才需跳出錯誤訊息
			if ((name.length as number) > 1) {
				// name[1] 為巢狀結構中的 Object Key
				if (isEmpty(trim(errors[0]))) {
					// winOver 和 rollOver 的message 沒有秀在 form 上面 , 僅展示紅匡 , 透過 message.error 推播
					message.error(
						t('Label_FieldsOneTime', {
							FieldA: t('Label_WinOver'),
							FieldB: t('Label_Rollover'),
						})
					)
				} else {
					const displayName = isJSON(name[1])
						? `Lang : ${JSON.parse(name[1] as string)?.langCode?.toUpperCase()}`
						: name[1]

					const errorMessage = `${displayName}'s ${errors[0]}`
					message.error(errorMessage)
				}
			}
		}
	}

	// usingList
	const handleClickMemberList = async () => {
		if (!siteId || !bonusCode) return
		try {
			await getBonusUsingList({ siteId, bonusCode }).unwrap()
			usingListModal.onOpen()
		} catch (error) {
			message.error(error?.message || t('System.Label_NotExpectedServerError'))
		}
	}

	const handleUploadUsingList = async (file: RcFile) => {
		if (!siteId || !bonusCode) return
		const formData = new FormData()
		formData.append('excelUpload', file)
		formData.append('SiteId', String(siteId))
		formData.append('BonusCode', bonusCode)
		try {
			await setBonusUsingList(formData).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(error?.message || t('System.Label_NotExpectedServerError'))
		}
	}

	useEffect(() => {
		if (!isEdit) return
		handleGetBonusDetail()
	}, [bonusCode])

	useEffect(() => {
		// 如果是編輯狀態在 query 後賦予初始值
		if (!isGetBonusDetailLoading && bonusDetailData) {
			// mainForm init
			const {
				bonusCode: currentBonusCode,
				promotionType,
				description,
				periodFrom,
				periodTo,
				isSpecial,
				specialCode,
				autoExtend,
				periodType,
				promotionDeviceType,
				sort,
				categoryId,
				walletType,
				expiryDays,
				onlyRegistered,
				promotionDisplayCondition,
				specific,
				status,
				displayFrom,
				displayTo,
				tpId,
				promotionAction,
				blockTagList,
				sameDeviceIDRestrict,
				sameDeviceIDAvailableCount,
				sameIPRestrict,
				sameIPRestrictAvailableCount,
				sameRealNameRestrict,
				sameRealNameRestrictAvailableCount,
				hideForUnlogin,
				isPopUp,
			} = bonusDetailData

			const parsedSpecific = specificDataConverter(specific, currencyListBySite)

			if (displayFrom && displayTo) {
				form.setFieldsValue({
					displayDate: [
						moment(displayFrom).utcOffset(0),
						moment(displayTo).utcOffset(0),
					],
				})
			} else {
				// * 當 displayFrom、displayTo 皆為 falsy， 則關掉預設為 true 的 isDisplayDate
				form?.setFieldsValue({
					isDisplayDate: false,
				})
			}

			form.setFieldsValue({
				mainFormActive: status === StatusEnum.Active,
				bonusCode: currentBonusCode,
				bonusType: promotionType,
				description,
				activeDate: [
					moment(periodFrom).utcOffset(0),
					moment(periodTo).utcOffset(0),
				],
				promotionAction,
				isSpecial,
				onlyRegistered,
				specialCode,
				autoExtend: Boolean(autoExtend),
				periodType,
				promotionDeviceType,
				sort,
				categoryId,
				walletType,
				expiryDays,
				tpId,
				blockTagList,
				sameDeviceIDRestrict,
				sameDeviceIDAvailableCount,
				sameIPRestrict,
				sameIPRestrictAvailableCount,
				sameRealNameRestrict,
				sameRealNameRestrictAvailableCount,
				selectedVipLevel: displayConditionResponseConverter(
					promotionDisplayCondition
				),
				hideForUnlogin,
				isPopUp,
			})
			parsedSpecific?.forEach(specificData => {
				// subForm init
				const {
					isoCode,
					currencyId,
					bonus,
					minPayout,
					maxBonus,
					rollOver,
					winOver,
					requiredAmount,
					bonusType,
					details,
					totalUsageLimit,
					usage,
					status: subFormStatus,
					// 後端的命名方式會導致 ts 報錯 , 故此處 ignore 該規則
					// eslint-disable-next-line @typescript-eslint/naming-convention
					vN_AffCodes,
					tierAmountList,
					cashBackSetting,
					turnoverTpGameTypeList,
				} = specificData
				// cashBack setting only cash back need this
				const { lossAmount, cashBackTpInfos } = cashBackSetting
				if (isoCode) {
					form.setFieldsValue({
						specific: {
							[isoCode]: {
								currencyId,
								active: subFormStatus === StatusEnum.Active,
								bonus,
								minPayout,
								maxBonus,
								rollOver,
								winOver,
								// only cashBack need this , bonus means percentage , 如果有 lossAmount 就直接拿 lossAmount
								// 只有 cashBack 用得到  其他均設為 0
								minLoss:
									promotionType === BonusTypeEnum.CashBack
										? lossAmount ?? Math.floor(minPayout / (bonus / 100))
										: 0,
								requiredAmount,
								bonusType,
								totalUsageLimit,
								usage,
								vN_AffCodes,
								tierAmountList,
								turnoverTpGameTypeList,
							},
						},
					})
					// Seamless 時 key = tpId , Transfer 時 key = categoryId
					if (cashBackTpInfos?.length > 0) {
						if (walletType === WalletTypeEnum.Seamless) {
							form.setFieldsValue({
								specific: {
									[isoCode]: {
										products: cashBackTpInfos?.map(info => info.tpId),
									},
								},
							})
						}
						if (walletType === WalletTypeEnum.Transfer) {
							form.setFieldsValue({
								specific: {
									[isoCode]: {
										products: cashBackTpInfos?.map(info => info.categoryId),
									},
								},
							})
						}
					}

					// banner form init
					if (!details) return
					Object.keys(details).forEach(key => {
						const {
							bannerUrl,
							description: bannerDescription,
							detail,
							title,
							promotionLink,
						} = details[key]
						const tabsKey = JSON.stringify({ currencyId, langCode: key })
						form.setFieldsValue({
							details: {
								[tabsKey]: {
									bannerUrl,
									detail,
									title,
									description: bannerDescription,
									promotionLink,
								},
							},
						})
					})
				}
			})
		}
	}, [isGetBonusDetailLoading])

	const loading =
		isGetPromotionListDataLoading ||
		isGetVipLevelListLoading ||
		isGetCategoryListLoading ||
		isGetBonusDetailLoading ||
		isSetBonusLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={`${pageTitle} > ${bonusMethod}`} />
			<EditBonusContext.Provider
				value={{
					form,
					editPermission,
					setCurrentTabActive,
					setCurrentCurrency,
					setInfoTabsKey,
					categoryList: categoryListData,
					currentActiveCurrency: currentCurrency,
					onEditDetailClick: editDetailModal.onOpen,
					onSetGroupBonusClick: setGroupBonusModal.onOpen,
				}}
			>
				<Row gutter={16}>
					<Col lg={12} xs={24}>
						<BonusDetailMainForm
							loading={loading}
							uploadUsingListLoading={isSetBonusUsingListLoading}
							tagList={tagList}
							isEdit={isEdit}
							bonusTypeList={bonusTypeList}
							vipLevelList={vipLevelList}
							onUploadUsingList={handleUploadUsingList}
							onClickMemberList={handleClickMemberList}
						/>
					</Col>
					<Col lg={12} xs={24}>
						<BonusDetailTab
							loading={loading}
							currencyListBySite={currencyListBySite}
						/>
						{/* BonusDetailTab 勾選 active才顯示 BannerInfoEditTab  */}
						{currentTabActive && (
							<BannerInfoEditTab
								loading={isGetLanguageListFetching}
								langCodes={langCodes}
								currentTabActive={currentTabActive}
							/>
						)}
					</Col>
				</Row>

				{/* 每次關閉都完整 remove 掉元件 , 確保開啟時拿到的資料為當前正確的 tab  */}
				{editDetailModal.visible && (
					<EditDetailModal
						visible={editDetailModal.visible}
						onFinish={editDetailModal.onCancel}
						infoTabsKey={infoTabsKey}
					/>
				)}

				{setGroupBonusModal.visible && (
					<SetGroupModal
						visible={setGroupBonusModal.visible}
						onFinish={setGroupBonusModal.onCancel}
					/>
				)}
				<MemberListModal
					loading={isGetBonusUsingListLoading}
					visible={usingListModal.visible}
					onClose={usingListModal.onCancel}
					bonusUsingList={bonusUsingList}
				/>
			</EditBonusContext.Provider>
			<AffixButtons>
				<AffixButtons.Saved
					disabled={!editPermission?.canUse}
					onClick={handleSaved}
				/>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default UpdateBonus

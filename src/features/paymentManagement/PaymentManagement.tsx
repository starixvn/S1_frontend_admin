import { isEmpty } from 'lodash'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { SiteIds } from 'app/constants/siteIds'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	useGetCryptoInfoQuery,
	useGetGlobalStatusListQuery,
	useLazyGetBankInfoListQuery,
	useLazyGetPaySettingListQuery,
	useSetBankStatusMutation,
	useSetChargeFeeMutation,
	useSetCryptoInfoMutation,
	useSetGlobalStatusMutation,
	useSetPayListLoginInfoMutation,
	useSetPaySettingMutation,
	useSetPaySettingStatusMutation,
	useGetAutoVerifyRuleListQuery,
	useAddAutoVerifyRuleMutation,
	useSetAutoVerifyRuleMutation,
	useDeleteAutoVerifyRuleMutation,
	useGetSystemBankInfoListQuery,
	useSetSystemBankInfoMutation,
} from 'features/paymentManagement/api'
import { PaymentManagementFilter } from 'features/paymentManagement/PaymentManagementFilter'
import { GlobalStatusModal } from 'features/paymentManagement/modals/GlobalStatusModal'
import {
	AmountRuleEnum,
	EditModalTypeEnum,
	IEditForm,
	IFilterForm,
	IGetCryptoInfoData,
	IGetGlobalStatusData,
	IGetPaySettingData,
	ILoginInfoForm,
	PaymentStatusEnum,
	IEditAutoWithdrawalRuleForm,
	IAddAutoWithdrawalRuleForm,
	IEditAutoVerifyRuleForm,
	IAddAutoVerifyRuleForm,
	AutoTypeEnums,
	AutoTypeDisplayNameEnums,
} from 'features/paymentManagement/type'
import { PaymentManagementTable } from 'features/paymentManagement/PaymentManagementTable'
import { OnlineBankInfoModal } from 'features/paymentManagement/modals/OnlineBankInfoModal'
import { EditPaymentModal } from 'features/paymentManagement/modals/EditPaymentModal'
import { FixedAmountConverter } from 'features/paymentManagement/utils'
import { EditLoginInfoModal } from 'features/paymentManagement/modals/EditLoginInfoModal'
import { CryptoSettingModal } from 'features/paymentManagement/modals/CryptoSettingModal'
import { AutoWithdrawalRuleModal } from 'features/paymentManagement/modals/AutoWithdrawalRuleModal'
import { AddAutoWithdrawalRuleModal } from 'features/paymentManagement/modals/AddAutoWithdrawalRuleModal'
import { AutoVerifyRuleModal } from 'features/paymentManagement/modals/AutoVerifyRuleModal'
import { AddAutoVerifyRuleModal } from 'features/paymentManagement/modals/AddAutoVerifyRuleModal'
import BankMaintenanceModal from 'features/paymentManagement/modals/BankMaintenanceModal'

const PaymentManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const {
		actionPermissions: {
			editPermission,
			editInfoPermission,
			setFeePermission,
			editAutoWithdrawalRulePermission,
			editWithdrawalAutoVerifyRulePermission,
			editSystemBankInfoPermission,
		} = {},
	} = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [queryParams, setQueryParams] = useQueryParams()

	const payIdRef = useRef<number | undefined>()
	// 用於編輯 globalStatus LoginInfo 需要暫存的資料
	const globalStatusLoginInfo = useRef<
		{ payName: string; payId: number } | undefined
	>()

	const globalStatusModal = useModal()
	const onlineBankInfoModal = useModal()
	const editPaySettingModal = useModal()
	const editLoginInfoModal = useModal()
	const cryptoInfoModal = useModal()
	const autoWithdrawalRuleModal = useModal()
	const addAutoWithdrawalRuleModal = useModal()
	const autoVerifyRuleModal = useModal()
	const addAutoVerifyRuleModal = useModal()
	const systemBankInfoModal = useModal()

	const [editForm] = Form.useForm<IEditForm>()

	const [filterForm] = Form.useForm<IFilterForm>()

	const [loginInfoForm] = Form.useForm<ILoginInfoForm>()

	// 編輯 Auto Withdrawal Rule Form
	const [editAutoWithdrawalRuleForm] =
		Form.useForm<IEditAutoWithdrawalRuleForm>()
	// 新增 Auto Withdrawal Rule Form
	const [addAutoWithdrawalRuleForm] = Form.useForm<IAddAutoWithdrawalRuleForm>()

	// 編輯 Auto Verify Rule Form
	const [editAutoVerifyRuleForm] = Form.useForm<IEditAutoVerifyRuleForm>()
	// 新增 Auto Verify Rule Form
	const [addAutoVerifyRuleForm] = Form.useForm<IAddAutoVerifyRuleForm>()

	// Method 下拉選單
	const {
		data: { data: methodList = [] } = {},
		isLoading: isGetMethodListLoading,
	} = useGetEnumTypeQuery({
		enumName: 'PayListMethodEnum',
	})

	// table 使用的 method List
	const { data: { data: tableMethodList = [] } = {} } = useGetEnumTypeQuery({
		enumName: 'PayChannelMethodEnum',
	})

	// table 使用的 amount List
	const { data: { data: amountRuleList = [] } = {} } = useGetEnumTypeQuery({
		enumName: 'AmountRuleEnum',
	})

	// Type 下拉選單
	const {
		data: { data: typeList = [] } = {},
		isLoading: isGetTypeListLoading,
	} = useGetEnumTypeQuery({
		enumName: 'PayChannelTypeEnum',
	})

	// GlobalStatus 下拉選單
	const {
		data: { data: globalStatusList = [] } = {},
		isLoading: isGetGlobalStatusLoading,
	} = useGetEnumTypeQuery({ enumName: 'PayListStatusEnum' })

	// Auto Verify Rule 的 Auto Type 選單
	const { data: { data: autoTypeList = [] } = {} } = useGetEnumTypeQuery({
		enumName: 'AutoType',
	})

	// payList
	const { data: { data: payList = [] } = {}, isFetching: isGetPayListLoading } =
		useGetGlobalStatusListQuery({
			siteId,
		})

	const [
		getPaySettingList,
		{
			data: { data: paySettingList = [], rowCount: paySettingTotal = 0 } = {},
			isFetching: isGetPaySettingListLoading,
		},
	] = useLazyGetPaySettingListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: paySettingTotal,
	})

	const [setGlobalStatus, { isLoading: isSetGlobalStatusLoading }] =
		useSetGlobalStatusMutation()

	const [setPayListLoginInfo, { isLoading: isSetPayListLoginInfoLoading }] =
		useSetPayListLoginInfoMutation()

	// BankInfo Modal
	const [
		getBankInfoList,
		{
			data: { data: bankInfoList = [] } = {},
			isFetching: isGetBankInfoListLoading,
		},
	] = useLazyGetBankInfoListQuery()

	// Bank 狀態
	const [setBankStatus, { isLoading: isSetBankStatusLoading }] =
		useSetBankStatusMutation()

	// PaySetting Status
	const [setPaySettingStatus, { isLoading: isSetPaySettingStatusLoading }] =
		useSetPaySettingStatusMutation()

	// PaySetting
	const [setPaySetting, { isLoading: isSetPaySettingLoading }] =
		useSetPaySettingMutation()

	// ChargeFee
	const [setChargeFee, { isLoading: isSetChargeFeeLoading }] =
		useSetChargeFeeMutation()

	// cryptoSetting 相關
	const {
		data: { data: cryptoInfo = [] } = {},
		isFetching: isGetCryptoInfoLoading,
	} = useGetCryptoInfoQuery(null)

	const [setCryptoInfo, { isLoading: isSetCryptoInfoLoading }] =
		useSetCryptoInfoMutation()

	// autoWithdrawalRule 相關
	const {
		data: { data: autoWithdrawalRuleList = [] } = {},
		isFetching: isGetAutoWithdrawalRuleLoading,
	} = useGetAutoVerifyRuleListQuery(
		{
			siteId,
			autoType: autoTypeList.find(
				({ name }) => name === AutoTypeDisplayNameEnums.AutoApproved
			)?.value,
		},
		{
			skip: isEmpty(autoTypeList),
		}
	)

	const [setAutoWithdrawalRule, { isLoading: isSetAutoWithdrawalRuleLoading }] =
		useSetAutoVerifyRuleMutation()

	const [addAutoWithdrawalRule, { isLoading: isAddAutoWithdrawalRuleLoading }] =
		useAddAutoVerifyRuleMutation()

	const [
		deleteAutoWithdrawalRule,
		{ isLoading: isDeleteAutoWithdrawalRuleLoading },
	] = useDeleteAutoVerifyRuleMutation()

	// autoVerifyRule 相關
	const {
		data: { data: autoVerifyRuleList = [] } = {},
		isFetching: isGetAutoVerifyRuleLoading,
	} = useGetAutoVerifyRuleListQuery(
		{
			siteId,
			autoType: autoTypeList.find(
				({ name }) => name === AutoTypeDisplayNameEnums.AutoVerify
			)?.value,
		},
		{
			skip: isEmpty(autoTypeList),
		}
	)

	const [setAutoVerifyRule, { isLoading: isSetAutoVerifyRuleLoading }] =
		useSetAutoVerifyRuleMutation()

	const [addAutoVerifyRule, { isLoading: isAddAutoVerifyRuleLoading }] =
		useAddAutoVerifyRuleMutation()

	const [deleteAutoVerifyRule, { isLoading: isDeleteAutoVerifyRuleLoading }] =
		useDeleteAutoVerifyRuleMutation()

	// SetSystemBankInfo 相關
	const {
		data: { data: systemBankInfoList = [] } = {},
		isFetching: isGetSystemBankInfoListFetching,
	} = useGetSystemBankInfoListQuery(null)

	const [setSystemBankInfo, { isLoading: isSetSystemBankInfoLoading }] =
		useSetSystemBankInfoMutation()

	// 主 Table 搜尋
	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { currencyIds, status, method, globalStatus, type, payId } =
			filterForm.getFieldsValue()
		try {
			await getPaySettingList({
				siteId,
				currencyIds,
				status: status === 'all' ? null : Number(status),
				method: method === 'all' ? null : Number(method),
				globalStatus: globalStatus === 'all' ? null : Number(globalStatus),
				type: type === 'all' ? null : Number(type),
				payId: payId === 'all' ? null : Number(payId),
				pageNumber: current,
				pageSize,
			}).unwrap()
			setQueryParams({
				currencyIds,
				status,
				method,
				globalStatus,
				type,
				payId,
				pageNumber: current,
				pageSize,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
		})
	}

	// Global Status 設定
	const handleSetGlobalStatus = async (payId: number, status: boolean) => {
		try {
			await setGlobalStatus({
				siteId,
				payId,
				status: status ? PaymentStatusEnum.True : PaymentStatusEnum.False,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// Channel Status 設定
	const handleSetSettingStatus = async ({
		channelId,
		currencyId,
		status,
	}: {
		channelId: number
		currencyId: number
		status: boolean
	}) => {
		try {
			await setPaySettingStatus({
				siteId,
				channelId,
				currencyId,
				status: status ? PaymentStatusEnum.True : PaymentStatusEnum.False,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// BankInfo 彈窗
	const handleBankInfoModalClicked = async ({
		payId,
		currencyId,
		channelId,
	}: {
		payId: number
		currencyId: number
		channelId: number
	}) => {
		payIdRef.current = payId
		try {
			onlineBankInfoModal.onOpen()
			await getBankInfoList({ siteId, currencyId, channelId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetBankInfoStatus = async ({
		sysId,
		status,
		method,
	}: {
		sysId: number
		status: boolean
		method: number
	}) => {
		if (!payIdRef.current) return
		try {
			await setBankStatus({
				siteId,
				payId: payIdRef.current,
				sysId,
				method,
				status: status ? PaymentStatusEnum.True : PaymentStatusEnum.False,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 編輯彈窗
	const handleEditClick = (
		record: IGetPaySettingData,
		type: EditModalTypeEnum
	) => {
		const {
			fixedAmountList: rawFixedAmountList,
			chargeFeePercentage,
			chargeFeePreCount,
			...rest
		} = record
		const parsedFixedAmount = FixedAmountConverter.S2C(rawFixedAmountList)
		editForm.setFieldsValue({
			fixedAmountList: parsedFixedAmount,
			percentage: chargeFeePercentage,
			preCount: chargeFeePreCount,
			editType: type,
			...rest,
		})
		editPaySettingModal.onOpen()
	}

	const handleSubmit = async () => {
		const {
			fixedAmountList,
			minAmount,
			maxAmount,
			amountRule,
			pointLevel,
			sort,
			percentage,
			preCount,
		} = await editForm.validateFields()
		const { currencyId, channelId, editType } = editForm.getFieldsValue(true)

		// Edit
		if (editType === EditModalTypeEnum.Edit) {
			if (
				amountRule === AmountRuleEnum.Fixed &&
				FixedAmountConverter.Validator(fixedAmountList)
			) {
				// 此處先檢查若 fixedAmount欄位填寫的參數有沒有正確
				message.error(
					`${t('Label_FixedAmount')} : ${t('Label_FollowValueRule')}`
				)
			} else {
				try {
					await setPaySetting({
						siteId,
						currencyId,
						channelId,
						minAmount,
						maxAmount,
						pointLevel,
						sort,
						amountRule,
						fixedAmountList:
							amountRule === AmountRuleEnum.Fixed
								? FixedAmountConverter.C2S(fixedAmountList)
								: null,
					}).unwrap()
					message.success(t('System.Label_Success'))
					editPaySettingModal.onCancel()
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
			}
		}

		// FeeSetting
		if (editType === EditModalTypeEnum.FeeSetting) {
			try {
				await setChargeFee({
					siteId,
					currencyId,
					channelId,
					percentage,
					preCount,
				}).unwrap()
				message.success(t('System.Label_Success'))
				editPaySettingModal.onCancel()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const handleEditLoginInfoClicked = (record: IGetGlobalStatusData) => {
		const {
			payName,
			payId,
			loginPassword,
			loginAccount,
			loginPin,
			loginUrl,
			transferPin,
		} = record
		globalStatusLoginInfo.current = { payName, payId }
		loginInfoForm.setFieldsValue({
			loginAccount,
			loginPin,
			loginUrl,
			transferPin,
			loginPassword,
		})
		editLoginInfoModal.onOpen()
	}

	const handleSetLoginInfo = async () => {
		if (!globalStatusLoginInfo.current?.payId) return
		const { payId } = globalStatusLoginInfo.current
		const {
			transferPin = '',
			loginPin = '',
			...restValue
		} = await loginInfoForm.validateFields()
		try {
			await setPayListLoginInfo({
				siteId,
				payId,
				transferPin,
				loginPin,
				...restValue,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 設定 Crypto Status
	const handleSetCryptoInfo = async (
		record: IGetCryptoInfoData,
		status: number
	) => {
		const { networkType: network, currencyId } = record
		try {
			await setCryptoInfo({ network, currencyId, status }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 修改 Auto Withdrawal Rule
	const handleSetAutoWithdrawalRule = async (
		id: number,
		currencyId: number,
		setEditingKey: (type: undefined) => void
	) => {
		const {
			withdrawalAmount,
			accountWithdrawalCount,
			status,
			tags,
			vipLevels,
			withdrawalType,
		} = await editAutoWithdrawalRuleForm.validateFields()

		const payload = {
			id,
			siteId,
			currencyId,
			withdrawalAmount,
			accountWithdrawalCount,
			// status 1: open, 0: close
			status: status ? 1 : 0,
			vipLevels,
			tags,
			deviceLevel: [], // * Auto Withdrawal Rule 沒有這參數 帶空陣列
			withdrawalType,
		}

		try {
			await setAutoWithdrawalRule(payload).unwrap()
			setEditingKey(undefined)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 新增 Auto Withdrawal Rule
	const handleAddAutoWithdrawalRule = async () => {
		const {
			currencyId,
			withdrawalAmount,
			accountWithdrawalCount,
			tags,
			vipLevels,
			withdrawalType,
		} = await addAutoWithdrawalRuleForm.validateFields()

		const payload = {
			autoType: AutoTypeEnums.AutoApproved,
			siteId,
			currencyId,
			withdrawalAmount,
			accountWithdrawalCount,
			vipLevels,
			tags,
			deviceLevel: [], // * Auto Withdrawal Rule 沒有這參數 帶空陣列
			withdrawalType,
		}

		try {
			await addAutoWithdrawalRule(payload).unwrap()
			message.success(t('System.Label_Success'))
			addAutoWithdrawalRuleModal.onCancel()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 刪除 Auto Withdrawal Rule
	const handleDeleteAutoWithdrawalRule = async (id: number) => {
		try {
			await deleteAutoWithdrawalRule({ id }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 修改 Auto Verify Rule
	const handleSetAutoVerifyRule = async (
		id: number,
		currencyId: number,
		setEditingKey: (type: undefined) => void
	) => {
		const {
			withdrawalAmount,
			accountWithdrawalCount,
			status,
			tags,
			vipLevels,
			deviceLevel,
			deviceScores,
		} = await editAutoVerifyRuleForm.validateFields()

		const payload = {
			id,
			siteId,
			currencyId,
			withdrawalAmount,
			accountWithdrawalCount,
			// status 1: open, 0: close
			status: status ? 1 : 0,
			vipLevels,
			tags,
			// Nova88 using deviceLevel, other sites using deviceScores
			deviceLevel: siteId === SiteIds.Nova88 ? deviceLevel : [],
			deviceScores: siteId === SiteIds.Nova88 ? 0 : deviceScores,
			// withdrawalType: 0, --> 不帶也可
		}

		try {
			await setAutoVerifyRule(payload).unwrap()
			setEditingKey(undefined)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 新增 Auto Verify Rule
	const handleAddAutoVerifyRule = async () => {
		const {
			currencyId,
			withdrawalAmount,
			accountWithdrawalCount,
			tags,
			vipLevels,
			deviceLevel,
			deviceScores,
		} = await addAutoVerifyRuleForm.validateFields()

		const autoType = autoTypeList.find(
			({ name }) => name === 'AutoVerify'
		)?.value

		if (!autoType) {
			message.error(t('System.Label_NotExpectedServerError'))
			return
		}

		const payload = {
			autoType,
			siteId,
			currencyId,
			withdrawalAmount,
			accountWithdrawalCount,
			vipLevels,
			tags,
			// Nova88 using deviceLevel, other sites using deviceScores
			deviceLevel: siteId === SiteIds.Nova88 ? deviceLevel : [],
			deviceScores: siteId === SiteIds.Nova88 ? 0 : deviceScores,
			// withdrawalType: 0, --> 不帶也可
		}

		try {
			await addAutoVerifyRule(payload).unwrap()
			message.success(t('System.Label_Success'))
			addAutoVerifyRuleModal.onCancel()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 刪除 Auto Verify Rule
	const handleDeleteAutoVerifyRule = async (id: number) => {
		try {
			await deleteAutoVerifyRule({ id }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 修改 SystemBankInfo
	const handleSetSystemBankInfo = async (
		sysId: number,
		bankCode: string,
		bankName: string,
		status: boolean
	) => {
		try {
			await setSystemBankInfo({
				sysId,
				bankCode,
				bankName,
				status: status ? 1 : 0,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (!isEmpty(queryParams)) {
				const {
					currencyIds,
					status,
					method,
					globalStatus,
					type,
					payId,
					pageNumber,
					pageSize,
				} = queryParams
				filterForm.setFieldsValue({
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					status: !Number(status) ? status : Number(status),
					method: !Number(method) ? method : Number(method),
					globalStatus: !Number(globalStatus)
						? globalStatus
						: Number(globalStatus),
					type: !Number(type) ? type : Number(type),
					payId: !Number(payId) ? payId : Number(payId),
				})
				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
				})
			}
		}
		init()
	}, [])

	const filterLoading =
		isGetMethodListLoading ||
		isGetTypeListLoading ||
		isGetGlobalStatusLoading ||
		isGetPayListLoading

	const cryptoLoading = isGetCryptoInfoLoading || isSetCryptoInfoLoading
	const autoWithdrawalRuleLoading =
		isGetAutoWithdrawalRuleLoading ||
		isSetAutoWithdrawalRuleLoading ||
		isDeleteAutoWithdrawalRuleLoading

	const autoVerifyRuleLoading =
		isGetAutoVerifyRuleLoading ||
		isSetAutoVerifyRuleLoading ||
		isDeleteAutoVerifyRuleLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<PaymentManagementFilter
				loading={isGetPaySettingListLoading}
				filterLoading={filterLoading}
				methodList={methodList}
				typeList={typeList}
				globalStatusList={globalStatusList}
				payList={payList}
				currencyListBySite={currencyListBySite}
				form={filterForm}
				onSearch={handleSearch}
				onSetCryptoInfoClicked={cryptoInfoModal.onOpen}
				onSetGlobalStatusClicked={globalStatusModal.onOpen}
				onAutoWithdrawalRuleClicked={autoWithdrawalRuleModal.onOpen}
				onAutoVerifyRuleClicked={autoVerifyRuleModal.onOpen}
				onSystemBankInfoClicked={systemBankInfoModal.onOpen}
			/>
			{!isEmpty(queryParams) && (
				<PaymentManagementTable
					loading={isGetPaySettingListLoading || isSetPaySettingStatusLoading}
					paySettingList={paySettingList}
					currencyListBySite={currencyListBySite}
					globalStatusList={globalStatusList}
					editPermission={editPermission}
					setFeePermission={setFeePermission}
					pagination={pagination}
					typeList={typeList}
					onTableChange={handleTableChange}
					onSetStatus={handleSetSettingStatus}
					tableMethodList={tableMethodList}
					onBankModalClicked={handleBankInfoModalClicked}
					amountRuleList={amountRuleList}
					onEditClick={handleEditClick}
				/>
			)}
			<GlobalStatusModal
				loading={isGetPayListLoading || isSetGlobalStatusLoading}
				visible={globalStatusModal.visible}
				onCancel={globalStatusModal.onCancel}
				editInfoPermission={editInfoPermission}
				editPermission={editPermission}
				payList={payList}
				onSetStatus={handleSetGlobalStatus}
				onEditClick={handleEditLoginInfoClicked}
			/>
			<OnlineBankInfoModal
				loading={isGetBankInfoListLoading || isSetBankStatusLoading}
				visible={onlineBankInfoModal.visible}
				onCancel={() => {
					payIdRef.current = undefined
					onlineBankInfoModal.onCancel()
				}}
				bankInfoList={bankInfoList}
				onSetStatus={handleSetBankInfoStatus}
				currencyListBySite={currencyListBySite}
			/>
			<EditPaymentModal
				loading={isSetPaySettingLoading || isSetChargeFeeLoading}
				form={editForm}
				visible={editPaySettingModal.visible}
				onCancel={editPaySettingModal.onCancel}
				typeList={typeList}
				currencyListBySite={currencyListBySite}
				amountRuleList={amountRuleList}
				onSubmit={handleSubmit}
			/>
			<EditLoginInfoModal
				form={loginInfoForm}
				loading={isSetPayListLoginInfoLoading}
				visible={editLoginInfoModal.visible}
				onCancel={editLoginInfoModal.onCancel}
				onSubmit={handleSetLoginInfo}
				title={globalStatusLoginInfo.current?.payName ?? ''}
			/>
			<CryptoSettingModal
				loading={cryptoLoading}
				visible={cryptoInfoModal.visible}
				onCancel={cryptoInfoModal.onCancel}
				cryptoInfo={cryptoInfo}
				onSetCryptoInfo={handleSetCryptoInfo}
			/>
			<AutoWithdrawalRuleModal
				form={editAutoWithdrawalRuleForm}
				visible={autoWithdrawalRuleModal.visible}
				editPermission={editAutoWithdrawalRulePermission}
				dataFetchingLoading={autoWithdrawalRuleLoading}
				autoWithdrawalRuleList={autoWithdrawalRuleList}
				onCancel={autoWithdrawalRuleModal.onCancel}
				onAddClick={addAutoWithdrawalRuleModal.onOpen}
				onSetAutoWithdrawalRule={handleSetAutoWithdrawalRule}
				onDeleteAutoWithdrawalRule={handleDeleteAutoWithdrawalRule}
			/>
			<AddAutoWithdrawalRuleModal
				form={addAutoWithdrawalRuleForm}
				visible={addAutoWithdrawalRuleModal.visible}
				dataFetchingLoading={isAddAutoWithdrawalRuleLoading}
				autoWithdrawalRuleList={autoWithdrawalRuleList}
				onCancel={addAutoWithdrawalRuleModal.onCancel}
				onSubmit={handleAddAutoWithdrawalRule}
			/>
			<AutoVerifyRuleModal
				form={editAutoVerifyRuleForm}
				visible={autoVerifyRuleModal.visible}
				editPermission={editWithdrawalAutoVerifyRulePermission}
				autoVerifyRuleList={autoVerifyRuleList}
				dataFetchingLoading={autoVerifyRuleLoading}
				onCancel={autoVerifyRuleModal.onCancel}
				onAddClick={addAutoVerifyRuleModal.onOpen}
				onSetVerifyRule={handleSetAutoVerifyRule}
				onDeleteAutoVerifyRule={handleDeleteAutoVerifyRule}
			/>
			<AddAutoVerifyRuleModal
				form={addAutoVerifyRuleForm}
				visible={addAutoVerifyRuleModal.visible}
				dataFetchingLoading={isAddAutoVerifyRuleLoading}
				autoVerifyRuleList={autoVerifyRuleList}
				onCancel={addAutoVerifyRuleModal.onCancel}
				onSubmit={handleAddAutoVerifyRule}
			/>
			<BankMaintenanceModal
				loading={isGetSystemBankInfoListFetching || isSetSystemBankInfoLoading}
				visible={systemBankInfoModal.visible}
				onCancel={systemBankInfoModal.onCancel}
				currencyListBySite={currencyListBySite}
				editSystemBankInfoPermission={editSystemBankInfoPermission}
				systemBankInfoList={systemBankInfoList}
				onSetStatus={handleSetSystemBankInfo}
			/>
		</LayoutContent.Main>
	)
}

export default PaymentManagement

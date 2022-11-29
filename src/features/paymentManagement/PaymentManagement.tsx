import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	useGetGlobalStatusListQuery,
	useLazyGetBankInfoListQuery,
	useLazyGetPaySettingListQuery,
	useSetBankStatusMutation,
	useSetGlobalStatusMutation,
	useSetPayListLoginInfoMutation,
	useSetPaySettingMutation,
	useSetPaySettingStatusMutation,
} from 'features/paymentManagement/api'
import { PaymentManagementFilter } from 'features/paymentManagement/PaymentManagementFilter'
import { GlobalStatusModal } from 'features/paymentManagement/modals/GlobalStatusModal'
import {
	AmountRuleEnum,
	IEditForm,
	IFilterForm,
	IGetGlobalStatusData,
	IGetPaySettingData,
	ILoginInfoForm,
	PaymentStatusEnum,
} from 'features/paymentManagement/type'
import { useEffect, useRef } from 'react'
import { isEmpty } from 'lodash'
import { PaymentManagementTable } from 'features/paymentManagement/PaymentManagementTable'
import { OnlineBankInfoModal } from 'features/paymentManagement/modals/OnlineBankInfoModal'
import { EditPaymentModal } from 'features/paymentManagement/modals/EditPaymentModal'
import { FixedAmountConverter } from 'features/paymentManagement/utils'
import { EditLoginInfoModal } from 'features/paymentManagement/modals/EditLoginInfoModal'

const PaymentManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
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

	const [editForm] = Form.useForm<IEditForm>()

	const [filterForm] = Form.useForm<IFilterForm>()

	const [loginInfoForm] = Form.useForm<ILoginInfoForm>()

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
	}: {
		sysId: number
		status: boolean
	}) => {
		if (!payIdRef.current) return
		try {
			await setBankStatus({
				siteId,
				payId: payIdRef.current,
				sysId,
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
	const handleEditClick = (record: IGetPaySettingData) => {
		const { fixedAmountList: rawFixedAmountList, ...rest } = record
		const parsedFixedAmount = FixedAmountConverter.S2C(rawFixedAmountList)
		editForm.setFieldsValue({
			fixedAmountList: parsedFixedAmount,
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
		} = await editForm.validateFields()
		const { currencyId, channelId } = editForm.getFieldsValue(true)
		if (
			amountRule === AmountRuleEnum.Fixed &&
			FixedAmountConverter.Validator(fixedAmountList)
		) {
			// 此處先檢查若 fixedAmount欄位填寫的參數有沒有正確
			message.error(`${t('Label_FixedAmount')} : ${t('Label_FollowValueRule')}`)
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
				// 視覺上確保 Modal 關閉後才清除資料
				setTimeout(() => {
					editForm.resetFields()
				}, 500)
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
				onSetGlobalStatusClicked={globalStatusModal.onOpen}
				editPermission={editPermission}
			/>
			{!isEmpty(queryParams) && (
				<PaymentManagementTable
					loading={isGetPaySettingListLoading || isSetPaySettingStatusLoading}
					paySettingList={paySettingList}
					currencyListBySite={currencyListBySite}
					globalStatusList={globalStatusList}
					editPermission={editPermission}
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
				loading={isSetPaySettingLoading}
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
		</LayoutContent.Main>
	)
}

export default PaymentManagement

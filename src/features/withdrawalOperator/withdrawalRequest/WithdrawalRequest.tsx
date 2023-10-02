import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Form, message, Modal, Row, Spin } from 'antd'
import {
	useCheckLockWithdrawalExistsMutation,
	useDeletePictureMutation,
	useGetAdjustmentLimitLogQuery,
	useGetAssociateBankUserQuery,
	useGetReceiptPictureQuery,
	useGetWithdrawalByTransIdQuery,
	useGetWithdrawalCommentQuery,
	useLockWithdrawalMutation,
	useManualApprovalMutation,
	useManualRejectMutation,
	useSetLockWithdrawalUserMutation,
	useSetWithdrawalStatusMutation,
	useUnLockWithdrawalMutation,
	useUploadPictureMutation,
} from 'features/withdrawalOperator/api'
import { useTimeZone } from 'components/TimeZoneSelect'
import { WithdrawalRequestInfo } from 'features/withdrawalOperator/withdrawalRequest/WithdrawalRequestInfo'
import { WithdrawalRequestComment } from 'features/withdrawalOperator/withdrawalRequest/components/WithdrawalRequestComment'
import { AffixButtons } from 'components/AffixButtons'
import { WithdrawalRequestButtonGroup } from 'features/withdrawalOperator/withdrawalRequest/WithdrawalRequestButtonGroup'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IAdjustmentWithdrawalData,
	IGetWithdrawalData,
	IPayInfo,
	IWithdrawalAccounting,
	IWithdrawalRequestForm,
} from 'features/withdrawalOperator/type'
import { WithdrawalRequestMemberInfo } from 'features/withdrawalOperator/withdrawalRequest/WithdrawalRequestMemberInfo'
import useMemberInfo from 'features/withdrawalOperator/withdrawalRequest/hooks/useMemberInfo'
import {
	AccountTypeEnum,
	PurposeEnum,
	WithdrawalStatusEnum,
	WithdrawalTypeEnum,
} from 'features/withdrawalOperator/constants'
import { useEffect, useState } from 'react'
import { useAuth, useModal } from 'common/hooks'
import { PayInfoModal } from 'features/withdrawalOperator/withdrawalRequest/components/PayInfoModal'
import { hashPayInfo } from 'features/withdrawalOperator/utils'
import { isJSON, multiEqual, utcFormatter } from 'common/utils'
import { BankSettingForm } from 'features/withdrawalOperator/withdrawalRequest/components/BankSettingForm'
import { find, head, isEqual, reduce } from 'lodash'
import { UsableActionButtonEnum } from 'features/depositOperator/type'
import { ReceiptUploader } from 'features/withdrawalOperator/withdrawalRequest/components/ReceiptUploader'
import { UploadFile } from 'antd/es/upload/interface'
import { IGetIpUserListResponse } from 'features/memberProfile/type'
import {
	useGetCheckDuplicateNameQuery,
	useLazyGetDeviceUserListQuery,
	useLazyGetIpUserQuery,
} from 'features/memberProfile/api'
import { UserListModal } from 'features/memberProfile/pages/customerInfo/components/UserListModal'
import { CryptoWalletSettingForm } from 'features/withdrawalOperator/withdrawalRequest/components/CryptoWalletSettingForm'
import {
	IBankInfoOffState,
	ICryptoPayData,
	IOnlinePayData,
} from 'common/service/baseDataApi/type'
import {
	useGetBankInfoOffListQuery,
	useGetCryptoPayListQuery,
	useGetCryptoWalletListQuery,
	useGetEwalletListQuery,
	useGetOnlinePayListQuery,
} from 'common/service/baseDataApi'
import { AssociateBankUserModal } from 'features/withdrawalOperator/withdrawalRequest/components/AssociateBankModal'
import { useSendReasonMessageHook } from 'features/withdrawalOperator/withdrawalRequest/hooks/useSendReasonMessageHook'
import moment from 'moment/moment'
import { AdjustmentLimitLogModal } from 'features/withdrawalOperator/withdrawalRequest/components/AdjustmentLimitLogModal'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useGetWithdrawalAdjustmentReasonListQuery } from 'features/withdrawalAdjustment/api'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const WithdrawalRequest = () => {
	const { t } = useTranslation()
	const { transId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const {
		actionPermissions: {
			editPermission,
			draftPermission,
			uploadReceiptPermission,
			deleteReceiptPermission,
			forceProceed,
		} = {},
	} = useAuth()
	const [form] = Form.useForm<IWithdrawalRequestForm>()
	const navigate = useNavigate()
	const payInfoModal = useModal()
	// ipUser 關聯彈窗
	const ipUserListModal = useModal()
	// deviceList 關聯彈窗
	const deviceUserModal = useModal()
	// duplicate FullName 關聯彈窗
	const duplicateNameModal = useModal()
	// Associate Bank 關聯彈窗
	const associateBankUserModal = useModal()
	// AdjustmentList 關聯彈窗
	const adjustmentLimitLogModal = useModal()

	// 當前 form 選的 withdrawalType
	const formWithdrawalType = Form.useWatch('withdrawalType', form)
	const [payInfo, setPayInfo] = useState<IPayInfo>()

	const {
		data: {
			data: withdrawalDetailData,
			// 因為不想要有 undefined 出現 , 所以這裡直接 as 賦型
		} = {} as IAxiosResponse<IGetWithdrawalData>,
		isFetching: isGetWithdrawalDataLoading,
		// 手動 refetch , 特殊情形手動 refetch , 避免 api 撈太快未取到最新資料
		refetch: refetchGetByTransId,
	} = useGetWithdrawalByTransIdQuery({ transId })

	const {
		custId,
		usableActionButton = [],
		currencyId,
		sysId,
		amount,
		cryptoCurrency,
		network,
		accountType,
		status: currentStatus,
		withdrawalType: responseWithdrawalType,
		transId: withdrawalTransId,
		withdrawalId,
		withdrawalInfo: rawWithdrawalInfo,
	} = withdrawalDetailData ?? {}

	// EWallet 用 withdrawalInfo 內的 EWalletSysId
	const { EWalletSysId = null } = isJSON(rawWithdrawalInfo)
		? JSON.parse(rawWithdrawalInfo)
		: {}

	// 某些階段不能更改 WithdrawalType , 要吃 api 給的 withdrawalType , 因為沒有生成 WithdrawalType 實體 , 所以 useWatch 取不到任何值
	const currentWithdrawalType = formWithdrawalType || responseWithdrawalType

	// crypto 使用的 channelName 要用組裝的
	const channelName =
		cryptoCurrency === network ? network : `${cryptoCurrency}-${network}`

	const {
		data: { data: withdrawalCommentData = [] } = {},
		isFetching: isGetWithdrawalCommentLoading,
		refetch: refetchComment,
	} = useGetWithdrawalCommentQuery({ transId })

	const { memberInfo, isMemberInfoLoading } = useMemberInfo({
		custId,
	})

	const { accountName } = memberInfo ?? {}

	// 更新狀態
	const [setWithdrawalStatus, { isLoading: isSetWithdrawalStatusLoading }] =
		useSetWithdrawalStatusMutation()

	// 手動 Approve
	const [manualApproval, { isLoading: isManualApprovalLoading }] =
		useManualApprovalMutation()

	// 手動 Reject
	const [manualReject, { isLoading: isManualRejectLoading }] =
		useManualRejectMutation()

	const [uploadPicture, { isLoading: isUploadReceiptLoading }] =
		useUploadPictureMutation()

	const [deletePicture, { isLoading: isDeleteReceiptLoading }] =
		useDeletePictureMutation()

	const { data: receiptList = [], isFetching: isGetReceiptListLoading } =
		useGetReceiptPictureQuery(
			{
				transId,
			},
			{ skip: !transId }
		)

	const { data: { data: onlinePayList = [] } = {} } = useGetOnlinePayListQuery(
		{
			currencyId,
			custId,
			sysId,
			amount,
		},
		{ skip: !custId }
	)

	const { data: { data: cryptoPayList = [] } = {} } = useGetCryptoPayListQuery(
		{
			amount,
			custId,
			currencyId,
			channelName,
		},
		{
			// accountType 為 crypto 時才打 api
			skip: !custId || accountType !== AccountTypeEnum.Crypto,
		}
	)

	const { data: { data: localBankList = [] } = {} } =
		useGetBankInfoOffListQuery(
			{ currencyId, purpose: PurposeEnum.Withdrawal },
			{ skip: !currencyId }
		)
	const { data: { data: eWalletList = [] } = {} } = useGetEwalletListQuery(
		{
			currencyId,
			custId,
			sysId: EWalletSysId as number,
			amount,
		},
		{ skip: !currencyId || !EWalletSysId }
	)

	const { data: { data: cryptoWalletList = [] } = {} } =
		useGetCryptoWalletListQuery(
			{ currencyId, purpose: PurposeEnum.Withdrawal },
			// accountType 為 crypto 時才打 api
			{ skip: !currencyId || accountType !== AccountTypeEnum.Crypto }
		)

	// 取得 IP 關聯 User
	const [
		getIpUser,
		{
			data: { data: ipUserList = [] } = {} as IGetIpUserListResponse,
			isFetching: isGetIpUserListLoading,
		},
	] = useLazyGetIpUserQuery()

	// 取得 Device 關聯 User
	const [
		getDeviceUserList,
		{
			data: { data: deviceUserList = [] } = {},
			isFetching: isGetDeviceUserLoading,
		},
	] = useLazyGetDeviceUserListQuery()

	const {
		data: { data: checkDuplicateNameList = [] } = {},
		isFetching: isGetCheckDuplicateNameListFetching,
	} = useGetCheckDuplicateNameQuery(
		{
			custId: Number(custId),
			fullName: accountName,
		},
		{
			skip: !accountName,
			// 因為要先預打 api 取得當前數量，在不影響使用者的情況下每30秒自動更新
			pollingInterval: 30000,
		}
	)

	const {
		data: { data: associateBankUserList = [] } = {},
		isFetching: isGetAssociateBankUserList,
	} = useGetAssociateBankUserQuery(
		{
			custId: Number(custId),
		},
		{
			skip: !custId,
			// 因為要先預打 api 取得當前數量，在不影響使用者的情況下每30秒自動更新
			pollingInterval: 30000,
		}
	)
	// 取得近七日 Adjustment Amount Limitation，這隻 api 結構長得跟其他隻不一樣，所以這樣寫
	const {
		data: adjustmentWithdrawalData = {} as IAdjustmentWithdrawalData,
		isFetching: isGetAdjustmentWithdrawalLoading,
	} = useGetAdjustmentLimitLogQuery(
		{
			startDate: utcFormatter({
				date: moment().subtract(7, 'day').startOf('day'),
				utcOffset: timeZoneUtcOffset,
			}),
			endDate: utcFormatter({
				date: moment().endOf('day'),
				utcOffset: timeZoneUtcOffset,
			}),
			custId: Number(custId),
		},
		{
			skip: !custId,
			// 因為要先預打 api 取得當前數量，在不影響使用者的情況下每30秒自動更新
			pollingInterval: 30000,
		}
	)

	const { adjustmentWithdrawalLimitLogList: adjustmentLimitList = [] } =
		adjustmentWithdrawalData ?? {}

	const { data: { data: directionEnumList = [] } = {} } = useGetEnumTypeQuery({
		enumName: 'DirectionEnum',
	})

	const { data: { data: reasonList = [] } = {} } =
		useGetWithdrawalAdjustmentReasonListQuery(null)

	// 領單流程
	// 領單
	const [lockWithdrawal, { isLoading: isLockWithdrawalLoading }] =
		useLockWithdrawalMutation()

	// 退單
	const [unLockWithdrawal, { isLoading: isUnLockWithdrawalLoading }] =
		useUnLockWithdrawalMutation()

	const [setLockWithdrawalUser, { isLoading: isSetLockWithdrawalUserLoading }] =
		useSetLockWithdrawalUserMutation()

	const [
		checkLockWithdrawalExists,
		{ isLoading: isCheckLockWithdrawalExistsLoading },
	] = useCheckLockWithdrawalExistsMutation()

	const { onShowSendMessageModal } = useSendReasonMessageHook({
		args: {
			currencyId,
			transId: withdrawalTransId,
			withdrawalId,
		},
	})

	// 顯示 bankInfo
	const handlePayInfoClicked = (
		record: IOnlinePayData | ICryptoPayData | IBankInfoOffState
	) => {
		setPayInfo(hashPayInfo(currentWithdrawalType, record))
		payInfoModal.onOpen()
	}

	// 執行退單
	const handleUnLock = async () => {
		if (!transId) return
		try {
			await unLockWithdrawal({ transId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetWithdrawalRequest = async (action: WithdrawalStatusEnum) => {
		if (!transId) return
		const { withdrawalInfo } = withdrawalDetailData
		const {
			comment,
			withdrawalType,
			withdrawalAccountingModels,
			selId: rawSelId,
			cryptoWallet,
			gasFee,
		} = await form.validateFields()

		// 因為 LocalBank 設定在不同狀態會複用到 , 故拉出來寫成 function
		const handleSetLocalBank = async () => {
			// localBanking 拆單金額加總
			const totalAmount = reduce(
				withdrawalAccountingModels,
				(sum, cur) => {
					const { amount: withdrawalAmount = 0 } = cur ?? {}
					return sum + withdrawalAmount
				},
				0
			)
			if (!isEqual(amount, totalAmount)) {
				// 拆單金額若有錯則 show error message
				message.error(t('Label_AccountingAmountErrorMsg'))
			} else {
				// localBank 取第一筆 bank Data 當作 selId
				const correctSelId = head(withdrawalAccountingModels)?.bankId
				try {
					await setWithdrawalStatus({
						comment,
						transId,
						withdrawalInfo,
						action,
						selId: correctSelId,
						withdrawalType,
						withdrawalAccountingModels,
					}).unwrap()
					// 跳回上一頁
					if (
						multiEqual(action, [
							WithdrawalStatusEnum.Rejected,
							WithdrawalStatusEnum.Approved,
							WithdrawalStatusEnum.Verify,
							WithdrawalStatusEnum.Pending,
						])
					) {
						navigate(-1)
					}
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
			}
		}

		// 因為 CryptoWallet 在不同狀態會復用到，故拉出來獨立寫
		const handleSetCryptoWallet = async () => {
			const withdrawalAccountingData: IWithdrawalAccounting = {
				bankId: cryptoWallet,
				chargeFee: gasFee,
				amount,
			}

			try {
				await setWithdrawalStatus({
					comment,
					transId,
					withdrawalInfo,
					action,
					selId: cryptoWallet,
					withdrawalType,
					withdrawalAccountingModels: [withdrawalAccountingData],
				}).unwrap()
				// 跳回上一頁
				if (
					multiEqual(action, [
						WithdrawalStatusEnum.Rejected,
						WithdrawalStatusEnum.Approved,
						WithdrawalStatusEnum.Verify,
						WithdrawalStatusEnum.Pending,
					])
				) {
					navigate(-1)
				}
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}

		// Action 流程判斷
		// 只有進入 Process 需要送完整 Withdrawal 資料
		if (action === WithdrawalStatusEnum.Process) {
			switch (withdrawalType) {
				case WithdrawalTypeEnum.Undefined:
					message.error(t('Label_UndefinedTypeError'))
					break
				case WithdrawalTypeEnum.LocalBank:
					await handleSetLocalBank()
					break
				case WithdrawalTypeEnum.CryptoWallet:
					await handleSetCryptoWallet()
					break
				case WithdrawalTypeEnum.CryptoPay:
					try {
						const channelId = find(
							cryptoPayList,
							({ payId }) => payId === rawSelId
						)?.channelId

						await setWithdrawalStatus({
							comment,
							transId,
							withdrawalInfo,
							action,
							selId: rawSelId,
							withdrawalType,
							channelId,
						}).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case WithdrawalTypeEnum.OnlinePayment:
					try {
						const paymentList =
							accountType === AccountTypeEnum.EWallet
								? eWalletList
								: onlinePayList

						const channelId = find(
							paymentList,
							({ payId }) => payId === rawSelId
						)?.channelId

						await setWithdrawalStatus({
							comment,
							transId,
							withdrawalInfo,
							action,
							selId: rawSelId,
							withdrawalType:
								accountType === AccountTypeEnum.EWallet
									? WithdrawalTypeEnum.EWalletPayment
									: withdrawalType,
							channelId,
						}).unwrap()
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				default:
					break
			}
		} else if (
			currentStatus === WithdrawalStatusEnum.Approved &&
			responseWithdrawalType === WithdrawalTypeEnum.LocalBank
		) {
			// 特殊狀況 ，只有 LocalBank 可以在 Approved 之後再修改 bankInfo , 故拉出來特別處理
			await handleSetLocalBank()
		} else if (
			currentStatus === WithdrawalStatusEnum.Approved &&
			responseWithdrawalType === WithdrawalTypeEnum.CryptoWallet
		) {
			// 特殊狀況 ，CryptoWallet  可以在 Approved 之後再修改 bankInfo , 故拉出來特別處理
			await handleSetCryptoWallet()
		} else {
			// other Action
			try {
				// 單純切狀態只需要送這三個資料
				await setWithdrawalStatus({
					comment,
					transId,
					action,
				}).unwrap()

				// Reject 和 Approved 才跳回上一頁
				if (
					multiEqual(action, [
						WithdrawalStatusEnum.Rejected,
						WithdrawalStatusEnum.Approved,
						WithdrawalStatusEnum.Verify,
						WithdrawalStatusEnum.Pending,
					])
				) {
					navigate(-1)
				}
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
		form.resetFields(['comment'])
	}

	// 兩個手動設定 沒有和尋常 status 放在一起，故單獨寫一隻 function
	const handleManualOperator = async (
		action:
			| UsableActionButtonEnum.ManualApproved
			| UsableActionButtonEnum.ManualRejected
	) => {
		if (!transId) return
		switch (action) {
			case UsableActionButtonEnum.ManualApproved:
				try {
					await manualApproval({ transId }).unwrap()
					navigate(-1)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
				break
			case UsableActionButtonEnum.ManualRejected:
				try {
					await manualReject({ transId }).unwrap()
					navigate(-1)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
				break
			default:
				break
		}
	}

	const handleUploadImage = async (image: string) => {
		if (!transId) return
		try {
			await uploadPicture({
				transId,
				pic: [image],
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteImage = async (number: number) => {
		if (!transId) return
		try {
			await deletePicture({
				transId,
				number,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const imageInit = () => {
		const initFileList: UploadFile[] = []
		receiptList?.forEach((url, index) => {
			const file: UploadFile = {
				// 這裡給 index 供 delete api 取用
				uid: String(index),
				name: url.split('/').pop() ?? 'receipt',
				status: 'done',
				url,
			}
			initFileList.push(file)
		})
		form.setFieldsValue({
			fileList: initFileList,
		})
	}

	// 領單流程
	const handleReceive = async () => {
		if (!transId) return
		if (forceProceed?.canUse) {
			// 主管級要多做 check
			try {
				// 檢查
				await checkLockWithdrawalExists({ transId }).unwrap()
				// 沒人領過 => 直接領單
				await lockWithdrawal({ transId }).unwrap()
				// 這裡都手動 query 避免 api 撈太快沒撈到最新資料
				refetchGetByTransId()
				refetchComment()
			} catch (error) {
				Modal.confirm({
					title: t('Label_ReceiveConfirmMsg'),
					icon: <ExclamationCircleOutlined />,
					async onOk() {
						await setLockWithdrawalUser({ transId }).unwrap()
						// 這裡都手動 query 避免 api 撈太快沒撈到最新資料
						refetchGetByTransId()
						refetchComment()
					},
					onCancel() {},
				})
			}
		} else {
			try {
				await lockWithdrawal({ transId }).unwrap()
				// 這裡都手動 query 避免 api 撈太快沒撈到最新資料
				refetchGetByTransId()
				refetchComment()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	//  顯示 ip 關聯帳號彈窗
	const handleIpCountClick = async (ip: string) => {
		ipUserListModal.onOpen()
		try {
			await getIpUser({ ip }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 顯示 Device 關聯帳號彈窗
	const handleDeviceCountClick = async (deviceId: string) => {
		deviceUserModal.onOpen()
		if (!custId) return
		try {
			await getDeviceUserList({ custId, deviceId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isGetWithdrawalDataLoading ||
		isGetWithdrawalCommentLoading ||
		isMemberInfoLoading ||
		isSetWithdrawalStatusLoading ||
		isManualApprovalLoading ||
		isManualRejectLoading ||
		isLockWithdrawalLoading ||
		isUnLockWithdrawalLoading ||
		isSetLockWithdrawalUserLoading ||
		isCheckLockWithdrawalExistsLoading

	const updateReceiptLoading =
		isUploadReceiptLoading || isGetReceiptListLoading || isDeleteReceiptLoading

	useEffect(() => {
		// 參數初始處理
		if (!isGetWithdrawalDataLoading) {
			const {
				withdrawalType = WithdrawalTypeEnum.Undefined,
				payId,
				withdrawalAccountingModels = [],
			} = withdrawalDetailData

			form.setFieldsValue({
				withdrawalType,
				selId: payId ?? undefined,
			})

			// CryptoWallet
			if (withdrawalType === WithdrawalTypeEnum.CryptoWallet) {
				const cryptoInfo = head(
					withdrawalAccountingModels
				) as IWithdrawalAccounting
				const { bankId, chargeFee = 0 } = cryptoInfo ?? {}
				form.setFieldsValue({
					cryptoWallet: bankId ?? null,
					gasFee: chargeFee,
				})
			}

			if (withdrawalAccountingModels.length > 0) {
				form.setFieldsValue({
					withdrawalAccountingModels,
				})
			}
		}
	}, [isGetWithdrawalDataLoading])

	useEffect(() => {
		// 圖片初始化
		if (!isGetReceiptListLoading && receiptList) {
			imageInit()
		}
	}, [isGetReceiptListLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_WithdrawalRequest')} />
			<Spin spinning={loading}>
				<LayoutContent.Card>
					<Row gutter={16}>
						<Col xl={10} lg={24} md={24} xs={24}>
							<Form
								component={false}
								form={form}
								initialValues={{
									withdrawalType: WithdrawalTypeEnum.Undefined,
								}}
								colon={false}
								layout='vertical'
								disabled={!editPermission?.canUse}
							>
								<WithdrawalRequestInfo
									form={form}
									timeZoneUtcOffset={timeZoneUtcOffset}
									withdrawalDetailData={withdrawalDetailData}
									localBankList={localBankList}
									eWalletList={eWalletList}
									cryptoPayList={cryptoPayList}
									cryptoWalletList={cryptoWalletList}
									onlinePayList={onlinePayList}
									onPayInfoClicked={handlePayInfoClicked}
								/>
							</Form>
							{multiEqual(currentStatus, [
								WithdrawalStatusEnum.Approved,
								WithdrawalStatusEnum.Process,
								WithdrawalStatusEnum.Rejected,
								WithdrawalStatusEnum.Cancelled,
							]) &&
								multiEqual(currentWithdrawalType, [
									WithdrawalTypeEnum.LocalBank,
									WithdrawalTypeEnum.CryptoWallet,
								]) && (
									<ReceiptUploader
										loading={updateReceiptLoading}
										form={form}
										status={currentStatus}
										uploadReceiptPermission={uploadReceiptPermission}
										deleteReceiptPermission={deleteReceiptPermission}
										onUploadImage={handleUploadImage}
										onDeleteImage={handleDeleteImage}
									/>
								)}
						</Col>
						<Form
							component={false}
							form={form}
							colon={false}
							layout='vertical'
							disabled={!editPermission?.canUse}
						>
							<Col xl={14} lg={24} md={24} xs={24}>
								<WithdrawalRequestMemberInfo
									memberInfo={memberInfo}
									withdrawalDetailData={withdrawalDetailData}
									loading={isMemberInfoLoading}
									checkDuplicateNameList={checkDuplicateNameList}
									associateBankUserList={associateBankUserList}
									adjustmentLimitList={adjustmentLimitList}
									onIpCountClick={handleIpCountClick}
									onDeviceCountClick={handleDeviceCountClick}
									onDuplicateAccountClick={duplicateNameModal.onOpen}
									onAssociateBankUserClick={associateBankUserModal.onOpen}
									onAdjustmentLimitClick={adjustmentLimitLogModal.onOpen}
								/>
								{/* Local Bank 的拆單功能獨立做成 Form 表單放於此處  */}
								{multiEqual(currentStatus, [
									WithdrawalStatusEnum.Approved,
									WithdrawalStatusEnum.Verify,
									WithdrawalStatusEnum.Process,
								]) &&
									currentWithdrawalType === WithdrawalTypeEnum.LocalBank && (
										<BankSettingForm
											form={form}
											status={currentStatus}
											localBankList={localBankList}
											editPermission={editPermission}
											onPayInfoClicked={handlePayInfoClicked}
											amount={amount}
										/>
									)}
								{multiEqual(currentStatus, [
									WithdrawalStatusEnum.Approved,
									WithdrawalStatusEnum.Verify,
									WithdrawalStatusEnum.Process,
								]) &&
									currentWithdrawalType === WithdrawalTypeEnum.CryptoWallet && (
										<CryptoWalletSettingForm
											form={form}
											cryptoWalletList={cryptoWalletList}
											status={currentStatus}
											onPayInfoClicked={handlePayInfoClicked}
										/>
									)}
							</Col>
						</Form>
					</Row>
					<Form
						component={false}
						form={form}
						initialValues={{
							comment: '',
						}}
						colon={false}
						layout='vertical'
						disabled={!draftPermission?.canUse}
					>
						<WithdrawalRequestComment
							withdrawalCommentData={withdrawalCommentData}
							timeZoneUtcOffset={timeZoneUtcOffset}
						/>
					</Form>
					<WithdrawalRequestButtonGroup
						loading={loading}
						usableActionButton={usableActionButton}
						onSetWithdrawalRequest={handleSetWithdrawalRequest}
						onSetManualOperator={handleManualOperator}
						onShowSendMessageModal={onShowSendMessageModal}
						onReceive={handleReceive}
					/>
					<PayInfoModal
						visible={payInfoModal.visible}
						type={currentWithdrawalType}
						payInfo={payInfo}
						onCancel={payInfoModal.onCancel}
					/>
					{/* IP User */}
					<UserListModal
						loading={isGetIpUserListLoading}
						userList={ipUserList}
						visible={ipUserListModal.visible}
						onCancel={ipUserListModal.onCancel}
					/>
					{/* Device User */}
					<UserListModal
						loading={isGetDeviceUserLoading}
						userList={deviceUserList}
						visible={deviceUserModal.visible}
						onCancel={deviceUserModal.onCancel}
					/>
					{/* DuplicateFullName */}
					<UserListModal
						loading={isGetCheckDuplicateNameListFetching}
						userList={checkDuplicateNameList}
						visible={duplicateNameModal.visible}
						onCancel={duplicateNameModal.onCancel}
						clearCache={false}
					/>
					{/* Associate Bank  */}
					<AssociateBankUserModal
						loading={isGetAssociateBankUserList}
						associateBankUserList={associateBankUserList}
						visible={associateBankUserModal.visible}
						onCancel={associateBankUserModal.onCancel}
					/>
					{/* 增加兩個 br 使 button 不會與 AffixButton 重疊 */}
					<AdjustmentLimitLogModal
						loading={isGetAdjustmentWithdrawalLoading}
						visible={adjustmentLimitLogModal.visible}
						timeZoneUtcOffset={timeZoneUtcOffset}
						reasonList={reasonList}
						adjustmentLimitList={adjustmentLimitList}
						directionEnumList={directionEnumList}
						onCancel={adjustmentLimitLogModal.onCancel}
					/>
					<br />
					<br />
				</LayoutContent.Card>
				<AffixButtons>
					<AffixButtons.BackToTop />
					<AffixButtons.GoBackRoute
						onClick={async () => {
							await handleUnLock()
							navigate(-1)
						}}
					/>
				</AffixButtons>
			</Spin>
		</LayoutContent.Main>
	)
}

export default WithdrawalRequest

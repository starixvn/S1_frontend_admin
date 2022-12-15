import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Form, message, Row, Spin } from 'antd'
import {
	useDeletePictureMutation,
	useGetCryptoPayListQuery,
	useGetLocalBankListQuery,
	useGetOnlinePayListQuery,
	useGetReceiptPictureQuery,
	useGetWithdrawalByTransIdQuery,
	useGetWithdrawalCommentQuery,
	useManualApprovalMutation,
	useManualRejectMutation,
	useSetWithdrawalStatusMutation,
	useUploadPictureMutation,
} from 'features/withdrawalOperator/api'
import { useTimeZone } from 'components/TimeZoneSelect'
import { WithdrawalRequestInfo } from 'features/withdrawalOperator/withdrawalRequest/WithdrawalRequestInfo'
import { WithdrawalRequestComment } from 'features/withdrawalOperator/withdrawalRequest/components/WithdrawalRequestComment'
import { AffixButtons } from 'components/AffixButtons'
import { WithdrawalRequestButtonGroup } from 'features/withdrawalOperator/withdrawalRequest/WithdrawalRequestButtonGroup'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetBankInfoData,
	IGetCryptoPayData,
	IGetOnlinePayData,
	IGetWithdrawalData,
	IPayInfo,
	IWithdrawalRequestForm,
} from 'features/withdrawalOperator/type'
import { WithdrawalRequestMemberInfo } from 'features/withdrawalOperator/withdrawalRequest/WithdrawalRequestMemberInfo'
import useMemberInfo from 'features/withdrawalOperator/withdrawalRequest/hooks/useMemberInfo'
import {
	AccountTypeEnum,
	WithdrawalStatusEnum,
	WithdrawalTypeEnum,
} from 'features/withdrawalOperator/constants'
import { useEffect, useState } from 'react'
import { useModal } from 'common/hooks'
import { PayInfoModal } from 'features/withdrawalOperator/withdrawalRequest/components/PayInfoModal'
import { hashPayInfo } from 'features/withdrawalOperator/utils'
import { multiEqual } from 'common/utils'
import { BankSettingForm } from 'features/withdrawalOperator/withdrawalRequest/components/BankSettingForm'
import { find, head, isEqual, reduce } from 'lodash'
import { UsableActionButtonEnum } from 'features/depositOperator/type'
import { ReceiptUploader } from 'features/withdrawalOperator/withdrawalRequest/components/ReceiptUploader'
import { UploadFile } from 'antd/es/upload/interface'

const WithdrawalRequest = () => {
	const { t } = useTranslation()
	const { transId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const [form] = Form.useForm<IWithdrawalRequestForm>()
	const navigate = useNavigate()
	const payInfoModal = useModal()

	// 當前的 withdrawalType
	const currentWithdrawalType = Form.useWatch('withdrawalType', form)
	const [payInfo, setPayInfo] = useState<IPayInfo>()

	const {
		data: {
			data: withdrawalDetailData,
			// 因為不想要有 undefined 出現 , 所以這裡直接 as 賦型
		} = {} as IAxiosResponse<IGetWithdrawalData>,
		isFetching: isGetWithdrawalDataLoading,
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
	} = withdrawalDetailData ?? {}

	// crypto 使用的 channelName 要用組裝的
	const channelName =
		cryptoCurrency === network ? network : `${cryptoCurrency}-${network}`

	const {
		data: { data: withdrawalCommentData = [] } = {},
		isFetching: isGetWithdrawalCommentLoading,
	} = useGetWithdrawalCommentQuery({ transId })

	const { memberInfo, isMemberInfoLoading } = useMemberInfo({
		custId,
	})

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

	const {
		data: { data: onlinePayList = [] } = {},
		isLoading: isGetOnlinePayListLoading,
	} = useGetOnlinePayListQuery(
		{
			currencyId,
			custId,
			sysId,
			amount,
		},
		{ skip: !custId }
	)

	const {
		data: { data: cryptoPayList = [] } = {},
		isLoading: isGetCryptoPayListLoading,
	} = useGetCryptoPayListQuery(
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

	const {
		data: { data: localBankList = [] } = {},
		isLoading: isGetLocalBankListLoading,
	} = useGetLocalBankListQuery(
		{ currencyId, purpose: 2 },
		{ skip: !currencyId }
	)

	// 顯示 bankInfo
	const handlePayInfoClicked = (
		record: IGetOnlinePayData | IGetCryptoPayData | IGetBankInfoData
	) => {
		setPayInfo(hashPayInfo(currentWithdrawalType, record))
		payInfoModal.onOpen()
	}

	const handleSetWithdrawalRequest = async (action: WithdrawalStatusEnum) => {
		if (!transId) return
		const { withdrawalInfo } = withdrawalDetailData
		const {
			comment,
			withdrawalType,
			withdrawalAccountingModels,
			selId: rawSelId,
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
					navigate(-1)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
			}
		}

		// Action 流程判斷
		// 只有進入 Process 需要送完整 Withdrawal 資料
		if (action === WithdrawalStatusEnum.Process) {
			// cryptoPay ChannelId
			const channelId = find(
				cryptoPayList,
				({ payId }) => payId === rawSelId
			)?.channelId

			switch (withdrawalType) {
				case WithdrawalTypeEnum.Undefined:
					message.error(t('Label_UndefinedTypeError'))
					break
				case WithdrawalTypeEnum.LocalBank:
					await handleSetLocalBank()
					break
				case WithdrawalTypeEnum.CryptoPay:
					try {
						await setWithdrawalStatus({
							comment,
							transId,
							withdrawalInfo,
							action,
							selId: rawSelId,
							withdrawalType,
							channelId,
						}).unwrap()
						navigate(-1)
					} catch (error) {
						message.error(
							(error as Error)?.message ||
								t('System.Label_NotExpectedServerError')
						)
					}
					break
				case WithdrawalTypeEnum.OnlinePayment:
					try {
						await setWithdrawalStatus({
							comment,
							transId,
							withdrawalInfo,
							action,
							selId: rawSelId,
							withdrawalType,
						}).unwrap()
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
		} else if (
			currentStatus === WithdrawalStatusEnum.Approved &&
			withdrawalType === WithdrawalTypeEnum.LocalBank
		) {
			// 特殊狀況 ，只有 LocalBank 可以在 Approved 之後再修改 bankInfo , 故拉出來特別處理
			await handleSetLocalBank()
		} else {
			// other Action
			try {
				// 單純切狀態只需要送這三個資料
				await setWithdrawalStatus({
					comment,
					transId,
					action,
				}).unwrap()
				navigate(-1)
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
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

	const loading =
		isGetWithdrawalDataLoading ||
		isGetWithdrawalCommentLoading ||
		isMemberInfoLoading ||
		isSetWithdrawalStatusLoading ||
		isManualApprovalLoading ||
		isManualRejectLoading

	// 此 loading 狀態供監聽是否加載完畢
	const paymentListLoading =
		isGetOnlinePayListLoading ||
		isGetCryptoPayListLoading ||
		isGetLocalBankListLoading

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
					<Form
						component={false}
						form={form}
						initialValues={{
							comment: '',
							withdrawalType: WithdrawalTypeEnum.Undefined,
						}}
						colon={false}
						layout='vertical'
					>
						<Row gutter={16}>
							<Col xl={10} lg={24} md={24} xs={24}>
								<WithdrawalRequestInfo
									form={form}
									timeZoneUtcOffset={timeZoneUtcOffset}
									withdrawalDetailData={withdrawalDetailData}
									paymentListLoading={paymentListLoading}
									localBankList={localBankList}
									cryptoPayList={cryptoPayList}
									onlinePayList={onlinePayList}
									onPayInfoClicked={handlePayInfoClicked}
								/>
								{multiEqual(currentStatus, [
									WithdrawalStatusEnum.Approved,
									WithdrawalStatusEnum.Process,
								]) &&
									multiEqual(currentWithdrawalType, [
										WithdrawalTypeEnum.LocalBank,
									]) && (
										<ReceiptUploader
											loading={updateReceiptLoading}
											form={form}
											status={currentStatus}
											onUploadImage={handleUploadImage}
											onDeleteImage={handleDeleteImage}
										/>
									)}
							</Col>
							<Col xl={14} lg={24} md={24} xs={24}>
								<WithdrawalRequestMemberInfo
									loading={isMemberInfoLoading}
									memberInfo={memberInfo}
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
											onPayInfoClicked={handlePayInfoClicked}
											amount={amount}
										/>
									)}
							</Col>
						</Row>
						<WithdrawalRequestComment
							withdrawalCommentData={withdrawalCommentData}
							timeZoneUtcOffset={timeZoneUtcOffset}
						/>
						<WithdrawalRequestButtonGroup
							loading={loading}
							usableActionButton={usableActionButton}
							onSetWithdrawalRequest={handleSetWithdrawalRequest}
							onSetManualOperator={handleManualOperator}
						/>
					</Form>
					<PayInfoModal
						visible={payInfoModal.visible}
						type={currentWithdrawalType}
						payInfo={payInfo}
						onCancel={payInfoModal.onCancel}
					/>
					{/* 增加兩個 br 使 button 不會與 AffixButton 重疊 */}
					<br />
					<br />
				</LayoutContent.Card>
				<AffixButtons>
					<AffixButtons.BackToTop />
					<AffixButtons.GoBackRoute />
				</AffixButtons>
			</Spin>
		</LayoutContent.Main>
	)
}

export default WithdrawalRequest

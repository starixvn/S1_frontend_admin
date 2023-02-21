import moment from 'moment'
import { useEffect } from 'react'
import { Col, Divider, PageHeader, Row, Form, message, Modal } from 'antd'
import { filter, find } from 'lodash'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
	useCheckDepositReceiptMutation,
	useDeleteReceiptMutation,
	useGetDepositCommentsByTransIdQuery,
	useGetDepositInfoByTransIdQuery,
	useGetDepositReceiptByTransIdQuery,
	useSetAmountByTransIdMutation,
	useSetDepositManualApprovalMutation,
	useSetDepositStatusMutation,
	useUploadReceiptMutation,
} from 'features/depositOperator/api'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { useAuth, useCopy } from 'common/hooks'
import {
	GET_BANK_INFO_OFF_LIST_ARGS,
	useGetBankInfoOffListQuery,
	useGetCalCodeListQuery,
	useLazyGetPaymentListQuery,
} from 'common/service/baseDataApi'
import { selectUserSite } from 'common/enum'
import { utcFormatter } from 'common/utils'
import {
	DepositStatusEnum,
	ISetDepositStatusArgs,
	ISetAmountByTransIdArgs,
	IDepositOperatorData,
} from 'features/depositOperator/type'
import { RcFile } from 'antd/es/upload'
import DepositRequestDepositInfo from 'features/depositOperator/depositRequest/DepositRequestDepositInfo'
import DepositRequestComments from 'features/depositOperator/depositRequest/DepositRequestComments'
import DepositRequestMemberInfo from 'features/depositOperator/depositRequest/DepositRequestMemberInfo'
import DepositRequestOperatorButtonGroup from 'features/depositOperator/depositRequest/DepositRequestOperatorButtonGroup'
import DepositRequestPaymentInfoDescriptions from 'features/depositOperator/depositRequest/DepositRequestPaymentInfoDescriptions'
import DepositRequestBankInfoDescriptions from 'features/depositOperator/depositRequest/DepositRequestBankInfoDescriptions'
import useMemberInfo from 'features/depositOperator/depositRequest/hooks/useMemberInfo'
import { UploadFile } from 'antd/es/upload/interface'
import { DepositTypeEnum } from 'type'
import { CalCodePurposeEnum } from 'common/service/baseDataApi/type'
import { ReceiptUploader } from 'features/depositOperator/components/ReceiptUploader'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { useSendReasonMessageHook } from './hooks/useSendReasonMessageHook'

const DepositRequest = ({ pageTitle = '' }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { transId } = useParams()
	const {
		actionPermissions: {
			uploadReceiptPermission,
			deleteReceiptPermission,
			setAmountPermission,
		} = {},
	} = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm()
	const { onCopy } = useCopy()

	const {
		data: { data: depositReceiptCreateFromEnum } = {} as IEnumTypeResponse,
		isFetching: isDepositReceiptCreateFromEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'DepositReceiptCreateFromEnum' })

	const {
		data: { data: depositInfo = {} as IDepositOperatorData } = {},
		isFetching: isDepositInfoLoading,
	} = useGetDepositInfoByTransIdQuery({ transId })

	const { data: { data: bankInfoOffList = [] } = {} } =
		useGetBankInfoOffListQuery(
			{
				siteId,
				currencyId: depositInfo.currencyId,
				purpose: GET_BANK_INFO_OFF_LIST_ARGS.PURPOSE.DEPOSIT,
			},
			{
				skip: !depositInfo.currencyId,
			}
		)

	const { memberInfo, isMemberInfoLoading } = useMemberInfo({
		custId: depositInfo?.custId,
	})

	const {
		data: depositReceiptByTransIdList = [],
		isFetching: isGetDepositReceiptByTransIdLoading,
	} = useGetDepositReceiptByTransIdQuery({ transId })

	const { data: calCodeList = [], isFetching: isGetCalCodeListFetching } =
		useGetCalCodeListQuery(
			{
				siteId,
				purpose: CalCodePurposeEnum.Deposit,
			},
			{
				selectFromResult: ({ data: { data } = {}, isFetching }) => {
					const filteredData = filter(
						data,
						({ currencyId }) => depositInfo.currencyId === currencyId
					)
					return { data: filteredData, isFetching }
				},
			}
		)

	const [getPaymentList, { isFetching: isGetPaymentListFetching }] =
		useLazyGetPaymentListQuery()

	const {
		data: { data: depositComments = [] } = {},
		isFetching: isGetDepositCommentsByTransIdFetching,
	} = useGetDepositCommentsByTransIdQuery({
		transId,
	})

	const [setAmountByTransId, { isLoading: isSetAmountByTransIdLoading }] =
		useSetAmountByTransIdMutation()

	const [setDepositStatus, { isLoading: isSetDepositStatusLoading }] =
		useSetDepositStatusMutation()

	const [
		setDepositManualApproval,
		{ isLoading: isSetDepositManualApprovalLoading },
	] = useSetDepositManualApprovalMutation()

	const [checkDepositReceipt, { isLoading: isCheckDepositReceiptLoading }] =
		useCheckDepositReceiptMutation()

	const [uploadReceipt, { isLoading: isUploadReceiptLoading }] =
		useUploadReceiptMutation()

	const [deleteReceipt, { isLoading: isDeleteReceiptLoading }] =
		useDeleteReceiptMutation()

	const { onShowSendMessageModal } = useSendReasonMessageHook({
		args: {
			currencyId: depositInfo.currencyId,
			transId: depositInfo.transId,
			depositId: depositInfo.depositId,
			actualDeposit: depositInfo.actualDeposit,
			depositType: depositInfo.depositType,
		},
	})

	const onOpenBankInfoModal = (accountNo: string | null) => {
		if (!accountNo) return

		const bankInfo = find(bankInfoOffList, { accountNo })
		Modal.info({
			content: <DepositRequestBankInfoDescriptions bankInfo={bankInfo} />,
			width: '540px',
		})
	}

	const onOpenPaymentInfoModal = async (payId: number | undefined) => {
		if (!payId) return
		const { data: paymentList } = await getPaymentList({ payId }).unwrap()
		const paymentInfo = find(paymentList, { payId })
		Modal.info({
			content: (
				<DepositRequestPaymentInfoDescriptions paymentInfo={paymentInfo} />
			),
			width: '540px',
		})
	}

	const handleSetDepositStatus = async (status: DepositStatusEnum) => {
		if (!transId) return

		const { comment, bankId, statementTime } = form.getFieldsValue()
		const { actualDeposit, depositType } = depositInfo

		const args: ISetDepositStatusArgs = {
			action: status,
			actualDeposit,
			comment,
			transId,
			// * statementTime、bankId 只有在 action 是 draft && LocalBanking 時才需要送出
			...(status === DepositStatusEnum.Draft &&
				depositType === DepositTypeEnum.LocalBanking && {
					statementTime: utcFormatter({
						date: statementTime,
						utcOffset: timeZoneUtcOffset,
					}),
					bankId,
				}),
		}

		try {
			if (status === DepositStatusEnum.ManualApproved) {
				await setDepositManualApproval({ transId }).unwrap()
			} else {
				await setDepositStatus(args).unwrap()
				form.setFieldsValue({
					comment: '',
				})
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetAmountByTransId = async () => {
		if (!memberInfo?.currencyId) return

		const afterAmount = form.getFieldValue('amount')
		const { currencyId } = memberInfo

		if (!siteId || !transId) return

		const args: ISetAmountByTransIdArgs = {
			siteId,
			currencyId,
			transId,
			before: {
				amount: depositInfo.amount,
			},
			after: {
				amount: afterAmount,
			},
		}
		try {
			await setAmountByTransId(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCheckDepositReceipt = async () => {
		if (!transId) return
		try {
			const args = {
				transId,
			}
			await checkDepositReceipt(args).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUploadImage = async (image: RcFile) => {
		if (!siteId || !transId) return
		const { custId } = depositInfo
		try {
			const formData = new FormData()
			formData.append('SiteId', siteId.toString())
			formData.append('Receipt', image as RcFile)
			formData.append('CustId', custId.toString())
			formData.append('TransId', transId.toString())
			await uploadReceipt(formData).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteImage = async (receiptNo: number) => {
		if (!siteId || !transId) return
		const { custId } = depositInfo
		try {
			const args = {
				siteId,
				custId,
				receiptNo,
				transId,
			}
			await deleteReceipt(args).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const depositLoading =
		isDepositInfoLoading ||
		isGetCalCodeListFetching ||
		isSetAmountByTransIdLoading ||
		isGetPaymentListFetching ||
		isGetDepositReceiptByTransIdLoading ||
		isDepositReceiptCreateFromEnumLoading

	useEffect(() => {
		if (depositLoading) return

		const { bankId, statementTime, amount } = depositInfo

		form.setFieldsValue({
			bankId,
			amount,
			statementTime: moment(statementTime),
		})
	}, [depositLoading])

	const imageInit = async () => {
		const initFileList: UploadFile[] = []
		depositReceiptByTransIdList?.forEach(item => {
			const { receiptNo, receipt, creator, createTime, createFrom } = item
			const { contentType, fileContents } = receipt
			const url = `data:${contentType};base64,${fileContents}`
			const file: UploadFile = {
				uid: String(item.receiptNo),
				name: `receipt${receiptNo}&${creator}&${createTime}&${createFrom}`,
				status: 'done',
				url,
			}

			initFileList.push(file)
		})
		form.setFieldsValue({
			fileList: initFileList,
		})
	}

	useEffect(() => {
		if (!isGetDepositReceiptByTransIdLoading && depositReceiptByTransIdList) {
			imageInit()
		}
	}, [isGetDepositReceiptByTransIdLoading])

	return (
		<LayoutContent.Main>
			<PageHeader title={pageTitle} />
			<LayoutContent.Card style={{ marginTop: 0 }}>
				<Form
					form={form}
					initialValues={{
						amount: null,
						statementTime: null,
						comment: '',
						bankId: null,
					}}
				>
					<Row align='top' gutter={[16, 32]}>
						<Col xxl={12} xl={12} lg={12} md={24} xs={24}>
							<DepositRequestDepositInfo
								form={form}
								setAmountPermission={setAmountPermission}
								loading={depositLoading}
								timeZoneUtcOffset={timeZoneUtcOffset}
								depositInfo={depositInfo}
								calCodeList={calCodeList}
								onCopy={onCopy}
								onSetAmountByTransId={handleSetAmountByTransId}
								onOpenBankInfoModal={onOpenBankInfoModal}
								onOpenPaymentInfoModal={onOpenPaymentInfoModal}
							/>
						</Col>

						<Col xxl={12} xl={12} lg={12} md={24} xs={24}>
							<DepositRequestMemberInfo
								loading={isMemberInfoLoading}
								memberInfo={memberInfo}
								depositInfo={depositInfo}
							/>

							<ReceiptUploader
								loading={depositLoading}
								form={form}
								depositReceiptByTransIdList={depositReceiptByTransIdList}
								depositReceiptCreateFromEnum={depositReceiptCreateFromEnum}
								status={DepositStatusEnum.Pending}
								timeZoneUtcOffset={timeZoneUtcOffset}
								uploadReceiptPermission={uploadReceiptPermission}
								deleteReceiptPermission={deleteReceiptPermission}
								onUploadImage={handleUploadImage}
								onDeleteImage={handleDeleteImage}
							/>
						</Col>

						<Col span={24}>
							<DepositRequestComments
								form={form}
								loading={isGetDepositCommentsByTransIdFetching}
								depositComments={depositComments}
								timeZoneUtcOffset={timeZoneUtcOffset}
							/>
						</Col>
					</Row>
				</Form>
				<Divider />
				<DepositRequestOperatorButtonGroup
					loading={
						isSetDepositStatusLoading ||
						isSetDepositManualApprovalLoading ||
						isCheckDepositReceiptLoading ||
						isUploadReceiptLoading ||
						isDeleteReceiptLoading
					}
					isCheckReceipt={Boolean(depositInfo?.checkReceipt)}
					usableActionButtons={depositInfo?.usableActionButton ?? []}
					onSetDepositStatus={handleSetDepositStatus}
					onShowSendMessageModal={onShowSendMessageModal}
					onCheckDepositReceipt={handleCheckDepositReceipt}
				/>

				{/* // * 預留空間以防止 OperatorButton 及 AffixButton 黏在一起 */}
				<br />
				<br />
				<br />
			</LayoutContent.Card>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositRequest

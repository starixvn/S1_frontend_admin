import moment from 'moment'
import { useEffect } from 'react'
import {
	Col,
	Divider,
	Image,
	PageHeader,
	Row,
	Spin,
	Form,
	message,
	Modal,
} from 'antd'
import { find } from 'lodash'
import copy from 'copy-to-clipboard'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
	useGetDepositCommentsByTransIdQuery,
	useSetAmountByTransIdMutation,
	useSetDepositManualApprovalMutation,
	useSetDepositStatusMutation,
} from 'features/depositOperator/api'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { noImageFallBack } from 'app/constants/images'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { useAuth } from 'common/hooks'
import {
	useGetCalCodeListQuery,
	useLazyGetPaymentListQuery,
} from 'common/service/baseDataApi'
import { selectUserSite } from 'common/enum'
import { utcFormatter } from 'common/utils'
import {
	DepositStatusEnum,
	ISetDepositStatusArgs,
	ISetAmountByTransIdArgs,
	IDepositRequestFrom,
} from 'features/depositOperator/type'
import useDepositInfo from 'features/depositOperator/depositRequest/hooks/useDepositInfo'
import useReceiptImage from 'features/depositOperator/depositRequest/hooks/useReceiptImage'
import DepositRequestDepositInfo from 'features/depositOperator/depositRequest/DepositRequestDepositInfo'
import DepositRequestComments from 'features/depositOperator/depositRequest/DepositRequestComments'
import DepositRequestMemberInfo from 'features/depositOperator/depositRequest/DepositRequestMemberInfo'
import DepositRequestOperatorButtonGroup from 'features/depositOperator/depositRequest/DepositRequestOperatorButtonGroup'
import DepositRequestPaymentInfoDescriptions from 'features/depositOperator/depositRequest/DepositRequestPaymentInfoDescriptions'
import DepositRequestBankInfoDescriptions from 'features/depositOperator/depositRequest/DepositRequestBankInfoDescriptions'
import useMemberInfo from 'features/depositOperator/depositRequest/hooks/useMemberInfo'
import { DepositTypeEnum } from 'type'

const DepositRequest = ({ pageTitle = '' }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { transId } = useParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<IDepositRequestFrom>()
	const {
		data: { data: calCodeList = [] } = {},
		isFetching: isGetCalCodeListFetching,
	} = useGetCalCodeListQuery({
		siteId,
	})

	const { depositInfo, isDepositInfoLoading, bankInfoOffList } = useDepositInfo(
		{
			siteId,
			transId,
		}
	)

	const { memberInfo, isMemberInfoLoading } = useMemberInfo({
		custId: depositInfo?.custId,
	})

	const { receiptImg, isReceiptImgLoading } = useReceiptImage({ transId })

	const [getPaymentList, { isFetching: isGetPaymentListFetching }] =
		useLazyGetPaymentListQuery()

	const {
		data: { data: depositComments = [] } = {},
		isFetching: isGetDepositCommentsByTransIdFetching,
	} = useGetDepositCommentsByTransIdQuery({
		transId,
	})

	const [setDepositStatus] = useSetDepositStatusMutation()

	const [setAmountByTransId, { isLoading: isSetAmountByTransIdLoading }] =
		useSetAmountByTransIdMutation()

	const [setDepositManualApproval] = useSetDepositManualApprovalMutation()

	const onOpenBankInfoModal = (accountNo: string | null) => {
		if (!accountNo) return
		const bankInfo = find(bankInfoOffList, { accountNo })
		Modal.info({
			content: <DepositRequestBankInfoDescriptions bankInfo={bankInfo} />,
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

	const handleCopy = async (value: string) => {
		if (copy(value)) {
			message.success(`${t('Label_Copied')} ${t('System.Label_Success')}`)
		} else {
			message.error(t('Label_TryAgain'))
		}
	}

	const depositLoading =
		isDepositInfoLoading ||
		isGetCalCodeListFetching ||
		isSetAmountByTransIdLoading ||
		isGetPaymentListFetching

	useEffect(() => {
		if (depositLoading) return
		const {
			statementTime,
			amount,
			// ! 這邊會有點混淆，depositInfo json sysId 代表 bankId
			depositInfo: { sysId: bankId },
		} = depositInfo

		form.setFieldsValue({
			bankId,
			amount,
			statementTime: moment(statementTime),
		})
	}, [depositLoading])

	return (
		<LayoutContent.Main>
			<PageHeader title={pageTitle} />
			<LayoutContent.Card>
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
						<Col xxl={8} xl={12} lg={24} md={24} xs={24}>
							<DepositRequestDepositInfo
								form={form}
								editPermission={editPermission}
								loading={depositLoading}
								timeZoneUtcOffset={timeZoneUtcOffset}
								depositInfo={depositInfo}
								calCodeList={calCodeList}
								onCopy={handleCopy}
								onSetAmountByTransId={handleSetAmountByTransId}
								onOpenBankInfoModal={onOpenBankInfoModal}
								onOpenPaymentInfoModal={onOpenPaymentInfoModal}
							/>
						</Col>
						<Col xxl={8} xl={12} lg={24} md={24} xs={24}>
							<DepositRequestMemberInfo
								loading={isMemberInfoLoading}
								memberInfo={memberInfo}
							/>
						</Col>
						<Col xxl={8} xl={12} lg={12} md={12} xs={12}>
							{/* //* 給兩個 br 讓 Image 與其他元件同高 */}
							<br />
							<br />

							<Spin spinning={isReceiptImgLoading}>
								<Image
									width='100%'
									src={receiptImg}
									fallback={noImageFallBack}
								/>
							</Spin>
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
					usableActionButtons={depositInfo?.usableActionButton ?? []}
					onSetDepositStatus={handleSetDepositStatus}
				/>
			</LayoutContent.Card>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositRequest

import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { Collapse, Divider, Form, message } from 'antd'
import { useQueryParams, useAuth, useModal } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import {
	useGetAdjustmentTypeQuery,
	useGetReasonListQuery,
	useGetAdjustmentLimitInfoQuery,
	useLazyGetCustInfoWithBalanceQuery,
	useSetBalanceAdjustmentMutation,
	useSetBatchBalanceAdjustmentMutation,
	useCheckPasswordMutation,
} from 'features/balanceAdjustment/balanceAdjustment/api'
import {
	IAdjustmentLimitResponse,
	ICustInfoWithBalanceResponse,
	IGetAdjustmentTypeResponse,
	IGetReasonListResponse,
} from 'features/balanceAdjustment/balanceAdjustment/type'
import { IAxiosError } from 'common/service/axiosBaseQuery'
import { BalanceAdjustmentFilter } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentFilter'
import { BalanceAdjustmentForm } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentForm'
import { MethodTypeEnum } from 'features/balanceAdjustment/constants'
import { RcFile } from 'antd/es/upload/interface'
import { IMethodType } from '../type'
import ConfirmPasswordModal from './ConfirmPasswordModal'

const BalanceAdjustment: FC<{
	methodType: MethodTypeEnum
	filteredMethodTypes: IMethodType[]
	onMethodTypeChange: (type: MethodTypeEnum) => void
}> = ({ methodType, filteredMethodTypes, onMethodTypeChange }) => {
	const { t } = useTranslation()
	const { actionPermissions: { addBatchPermission, addPermission } = {} } =
		useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm<{
		//  * Filter Form
		userName: string
		sabaId: string
		// * Submit Form
		adjustmentType: number | null
		reasonId: number | null
		transId: string
		amount: number | null
		withdrawalLimitOption: boolean
		withdrawalLimitAmount: number | null
		memo: string
		fileList: RcFile[]
	}>()

	const formAdjustmentType = Form.useWatch('adjustmentType', form)

	const checkPasswordModal = useModal()

	const {
		data: { data: adjustmentTypeList } = {} as IGetAdjustmentTypeResponse,
		isLoading: isGetAdjustmentTypeLoading,
	} = useGetAdjustmentTypeQuery(null)

	const {
		data: { data: reasonList } = {} as IGetReasonListResponse,
		isLoading: isGetReasonListLoading,
	} = useGetReasonListQuery(
		{
			methodTypeID: methodType,
			adjustmentTypeID: formAdjustmentType as number,
		},
		{ skip: !methodType || !formAdjustmentType }
	)

	const [
		getCustInfoWithBalance,
		{
			data: { data: custInfoWithBalance } = {} as ICustInfoWithBalanceResponse,
			isFetching: isGetCustInfoWithBalanceLoading,
		},
	] = useLazyGetCustInfoWithBalanceQuery()

	const {
		data: { data: adjustmentLimitInfo } = {} as IAdjustmentLimitResponse,
	} = useGetAdjustmentLimitInfoQuery({
		siteId,
		currencyId: custInfoWithBalance?.currencyId,
	})

	const [checkPassword, { isLoading: isCheckPasswordLoading }] =
		useCheckPasswordMutation()

	const [setBalanceAdjustment, { isLoading: isSetBalanceAdjustmentLoading }] =
		useSetBalanceAdjustmentMutation()

	const [
		setBatchBalanceAdjustment,
		{ isLoading: isSetBatchBalanceAdjustmentLoading },
	] = useSetBatchBalanceAdjustmentMutation()

	const handleGetBalance = async () => {
		const { userName = '', sabaId = '' } = form.getFieldsValue()
		if (!isEmpty(userName) && !isEmpty(sabaId)) {
			message.error(
				t('Label_FieldsOneTime', {
					FieldA: t('Label_MemberId'),
					FieldB: t('Label_SabaId'),
				})
			)
		} else {
			try {
				await getCustInfoWithBalance({
					siteId,
					userName,
					sabaId,
				}).unwrap()

				setQueryParams({
					userName,
					sabaId,
					methodType,
				})
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}
	const handleSubmit = async () => {
		if (!siteId) return
		if (methodType === MethodTypeEnum.mainWalletBatch) {
			const {
				adjustmentType,
				reasonId,
				withdrawalLimitOption,
				withdrawalLimitAmount = 0,
			} = await form.validateFields()
			// 因為 fileList 沒有渲染在畫面上 所以用 message.error show error
			const { fileList } = form.getFieldsValue()
			if (!fileList) {
				message.error(t('Label_Required', { key: t('Label_File') }))
			} else {
				const formData = new FormData()
				formData.append('siteId', siteId.toString())
				formData.append('excelUpload', fileList[0] as RcFile)
				formData.append('option', String(adjustmentType ?? ''))
				formData.append(
					'withdrawalLimitAmount',
					Number(withdrawalLimitAmount).toString()
				)
				formData.append(
					'withdrawalLimitOption',
					Number(withdrawalLimitOption).toString()
				)
				formData.append('reasonId', String(reasonId ?? ''))

				try {
					const response = await setBatchBalanceAdjustment(formData).unwrap()
					// 這隻的 api 的 response 是陣列 可能有成功或錯誤的訊息
					if (response.length > 0) {
						response.forEach(res => {
							if (res.errorCode === 0) {
								message.success(res?.message || t('System.Label_Success'))
							} else {
								message.error(
									res?.message || t('System.Label_NotExpectedServerError')
								)
							}
						})
					}
					form.setFieldsValue({
						adjustmentType: null,
						reasonId: null,
						withdrawalLimitOption: false,
						withdrawalLimitAmount: null,
						fileList: [],
					})
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
			}
		} else if (methodType === MethodTypeEnum.mainWallet) {
			if (!custInfoWithBalance?.custId && !adjustmentLimitInfo?.adjustmentMax)
				return

			const { amount = 0 } = await form.validateFields()

			// * 如果調帳金額大於 adjustmentMax，需要做一次密碼確認

			if (
				adjustmentLimitInfo?.adjustmentMax &&
				(amount as number) > adjustmentLimitInfo?.adjustmentMax
			) {
				checkPasswordModal.onOpen()
			} else {
				handleSetBalanceAdjustment()
			}
		}
	}

	const handleCheckPassword = async (password: string) => {
		if (!siteId) return

		try {
			await checkPassword({ siteId, password }).unwrap()
			await handleSetBalanceAdjustment()
			checkPasswordModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			if ((error as IAxiosError)?.errorCode === 1004) {
				message.error(t('System.Label_WrongPassword'))
			} else {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const handleSetBalanceAdjustment = async () => {
		const {
			adjustmentType,
			reasonId,
			amount = 0,
			withdrawalLimitOption,
			withdrawalLimitAmount = 0,
			memo = '',
			transId,
		} = await form.validateFields()
		const { custId } = custInfoWithBalance

		try {
			const response = await setBalanceAdjustment({
				custId,
				adjustmentType,
				amount,
				// *  有可能是 null 所以要轉成 Number
				withdrawalLimitAmount: Number(withdrawalLimitAmount),
				withdrawalLimitOption: Number(withdrawalLimitOption),
				reasonId,
				transId,
				memo,
				methodType,
			}).unwrap()

			form.setFieldsValue({
				adjustmentType: null,
				reasonId: null,
				withdrawalLimitOption: false,
				withdrawalLimitAmount: null,
				amount: null,
				fileList: [],
				memo: '',
			})

			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams) || methodType === MethodTypeEnum.mainWalletBatch)
				return

			const { userName = '', sabaId = '' } = queryParams
			form.setFieldsValue({
				userName,
				sabaId,
			})
			if (userName !== '' || sabaId !== '') {
				// 有資料才做search
				handleGetBalance()
			}
		}
		init()
	}, [])

	const loading =
		isGetAdjustmentTypeLoading ||
		isGetReasonListLoading ||
		isGetCustInfoWithBalanceLoading

	const isShowSaveButton =
		custInfoWithBalance || methodType === MethodTypeEnum.mainWalletBatch

	return (
		<>
			<Collapse defaultActiveKey={1}>
				<Collapse.Panel header='' key='1'>
					<BalanceAdjustmentFilter
						loading={loading}
						form={form}
						methodType={methodType}
						filteredMethodTypes={filteredMethodTypes}
						onMethodTypeChange={onMethodTypeChange}
						onGetBalance={handleGetBalance}
						addBatchPermission={addBatchPermission}
					/>
					{(custInfoWithBalance ||
						methodType === MethodTypeEnum.mainWalletBatch) && (
						<>
							<Divider />
							<BalanceAdjustmentForm
								loading={loading}
								adjustmentTypeList={adjustmentTypeList}
								reasonList={reasonList}
								custInfoWithBalance={custInfoWithBalance}
								form={form}
								methodType={methodType}
							/>
						</>
					)}
				</Collapse.Panel>
			</Collapse>

			<AffixButtons>
				<AffixButtons.BackToTop />
				{isShowSaveButton && (
					<AffixButtons.Saved
						loading={
							isSetBalanceAdjustmentLoading ||
							isSetBatchBalanceAdjustmentLoading
						}
						disabled={!addPermission?.canUse}
						onClick={handleSubmit}
					/>
				)}
			</AffixButtons>

			<ConfirmPasswordModal
				{...checkPasswordModal}
				loading={isCheckPasswordLoading}
				onFinish={handleCheckPassword}
			/>
		</>
	)
}

export default BalanceAdjustment

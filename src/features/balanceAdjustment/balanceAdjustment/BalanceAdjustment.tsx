import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { Collapse, Divider, Form, message } from 'antd'
import { useQueryParams, useAuth } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import {
	useGetAdjustmentTypeQuery,
	useGetReasonListQuery,
	useLazyGetCustDetailQuery,
	useSetBalanceAdjustmentMutation,
	useSetBatchBalanceAdjustmentMutation,
} from 'features/balanceAdjustment/balanceAdjustment/api'
import {
	IGetAdjustmentTypeResponse,
	IGetCustDetailResponse,
	IGetReasonListResponse,
} from 'features/balanceAdjustment/balanceAdjustment/type'
import { BalanceAdjustmentFilter } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentFilter'
import { BalanceAdjustmentForm } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentForm'
import { MethodTypeEnum } from 'features/balanceAdjustment/constants'
import { RcFile } from 'antd/es/upload/interface'
import { IMethodType } from '../type'

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
	const [form] = Form.useForm()

	const {
		data: { data: adjustmentTypeList } = {} as IGetAdjustmentTypeResponse,
		isLoading: isGetAdjustmentTypeLoading,
	} = useGetAdjustmentTypeQuery(null)

	const {
		data: { data: reasonList } = {} as IGetReasonListResponse,
		isLoading: isGetReasonListLoading,
	} = useGetReasonListQuery(null)

	const [
		getCustDetail,
		{
			data: { data: custDetailData } = {} as IGetCustDetailResponse,
			isFetching: isGetCustDetailDataLoading,
		},
	] = useLazyGetCustDetailQuery()

	const [setBalanceAdjustment, { isLoading: isSetBalanceAdjustmentLoading }] =
		useSetBalanceAdjustmentMutation()

	const [
		setBatchBalanceAdjustment,
		{ isLoading: isSetBatchBalanceAdjustmentLoading },
	] = useSetBatchBalanceAdjustmentMutation()
	const handleGetBalance = async () => {
		const { userName = '', sabaId = '' } = form.getFieldsValue()
		try {
			await getCustDetail({
				siteId,
				userName,
				sabaId,
			}).unwrap()

			setQueryParams({
				userName,
				sabaId,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
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
				formData.append('excelUpload', fileList[0] as RcFile)
				formData.append('siteId', siteId.toString())
				formData.append('option', adjustmentType.toString())
				formData.append('category', reasonId.toString())
				formData.append('withdrawal', Number(withdrawalLimitAmount).toString())
				formData.append(
					'withdrawalLimitOption',
					Number(withdrawalLimitOption).toString()
				)
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
			if (!custDetailData?.custId) return
			const {
				adjustmentType,
				reasonId,
				amount = 0,
				withdrawalLimitOption,
				withdrawalLimitAmount = 0,
				memo = '',
			} = await form.validateFields()
			try {
				const response = await setBalanceAdjustment({
					adjustmentType,
					reasonId,
					amount,
					memo,
					withdrawalLimitOption: Number(withdrawalLimitOption),
					// 有可能是 null 所以要轉成 Number
					withdrawalLimitAmount: Number(withdrawalLimitAmount),
					custId: custDetailData?.custId,
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
		isGetCustDetailDataLoading

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
					{(custDetailData ||
						methodType === MethodTypeEnum.mainWalletBatch) && (
						<>
							<Divider />
							<BalanceAdjustmentForm
								loading={loading}
								adjustmentTypeList={adjustmentTypeList}
								reasonList={reasonList}
								custDetailData={custDetailData}
								form={form}
								methodType={methodType}
							/>
						</>
					)}
				</Collapse.Panel>
			</Collapse>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Saved
					loading={
						isSetBalanceAdjustmentLoading || isSetBatchBalanceAdjustmentLoading
					}
					disabled={!addPermission?.canUse}
					onClick={handleSubmit}
				/>
			</AffixButtons>
		</>
	)
}

export default BalanceAdjustment

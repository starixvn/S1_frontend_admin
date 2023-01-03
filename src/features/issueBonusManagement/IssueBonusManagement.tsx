import { FC, useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { IssueBonusManagementBatchForm } from 'features/issueBonusManagement/batchBonusComponents/IssueBonusManagementBatchForm'
import { PayoutTypeEnum } from 'features/issueBonusManagement/constants'
import {
	IAdjustmentLimitResponse,
	ICheckBonusCodeData,
	ICustInfoDetailsResponse,
} from 'features/issueBonusManagement/type'
import {
	useLazyCheckBonusCodeQuery,
	useLazyGetAdjustmentLimitInfoQuery,
	useLazyGetCustInfoDetailsQuery,
	useSetBonusPayoutBatchMutation,
} from 'features/issueBonusManagement/api'
import IssueBonusManagementInfoContent from 'features/issueBonusManagement/IssueBonusManagementInfoContent'
import IssueBonusManagementSearchForm from 'features/issueBonusManagement/IssueBonusManagementSearchForm'
import { RcFile } from 'antd/lib/upload'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { BatchLogTable } from 'features/issueBonusManagement/batchBonusComponents/BatchLogTable'

const IssueBonusManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [isShowInfoForm, setIsShowInfoForm] = useState<boolean>(false)
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	// 提高資料在前端渲染時的可控性，這裡把資料接出來自己控制
	const [batchLog, setBatchLog] = useState<IAxiosResponse<void>[]>([])
	const [batchBonusCodeInfo, setBatchBonusCodeInfo] = useState<
		ICheckBonusCodeData | undefined
	>(undefined)

	const [batchForm] = Form.useForm<{
		payoutType: number
		bonusCode: string
		currencyId: number
	}>()
	const [searchForm] = Form.useForm<{
		userName: string
		sabaId: string
	}>()
	const [infoForm] = Form.useForm<{
		bonusCode: string
	}>()

	const userName = Form.useWatch('userName', searchForm)
	const sabaId = Form.useWatch('sabaId', searchForm)
	const payoutType = Form.useWatch('payoutType', batchForm)

	const [
		getCustInfoDetails,
		{
			data: { data: custInfoDetails } = {} as ICustInfoDetailsResponse,
			isError: isGetCustInfoDetailsError,
			isFetching: isGetCustInfoDetailsFetching,
		},
	] = useLazyGetCustInfoDetailsQuery()

	const handelClear = () => {
		searchForm.resetFields()
		infoForm.resetFields()
	}

	// clear batch bonus Data
	const handleClearBatch = () => {
		batchForm.resetFields(['bonusCode', 'currencyId'])
		setBatchLog([])
		setBatchBonusCodeInfo(undefined)
	}

	const [
		getAdjustmentLimitInfo,
		{
			data: { data: adjustmentLimitInfo } = {} as IAdjustmentLimitResponse,
			isFetching: isGetAdjustmentLimitInfoFetching,
		},
	] = useLazyGetAdjustmentLimitInfoQuery()

	// Check Batch Bonus Code
	const [checkBonusCode, { isFetching: isCheckBonusCodeFetching }] =
		useLazyCheckBonusCodeQuery()

	// Set Batch Bonus
	const [setBonusPayoutBatch] = useSetBonusPayoutBatchMutation()

	const handleSearch = async () => {
		if (!siteId) return

		await searchForm.validateFields()

		try {
			const { data } = await getCustInfoDetails({
				siteId,
				userName,
				sabaId,
			}).unwrap()

			await getAdjustmentLimitInfo({
				siteId,
				currencyId: data.currencyId,
			}).unwrap()

			setIsShowInfoForm(true)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCheckBatchBonusCode = async () => {
		if (!siteId) return
		const { currencyId, bonusCode } = batchForm.getFieldsValue()

		try {
			const { data } = await checkBonusCode({
				siteId,
				currencyId,
				bonusCode,
			}).unwrap()
			if (!data.hasBonusCode) {
				message.warn('BonusCode Error')
			}
			setBatchBonusCodeInfo(data)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUploadBonus = async (file: RcFile) => {
		if (!siteId || !batchBonusCodeInfo) return
		const { bonusCode, promotionType, bonus } = batchBonusCodeInfo
		const formData = new FormData()
		formData.append('ExcelAdd', file)
		formData.append('SiteId', String(siteId))
		formData.append('BonusCode', bonusCode)
		formData.append('PromotionType', String(promotionType))
		formData.append('Amount', String(bonus))

		try {
			const response = await setBonusPayoutBatch(formData).unwrap()
			setBatchLog(response)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
			setBatchLog([])
			// throw error 回去 uploader 元件 , 觸發 error status
			throw error
		}
	}

	useEffect(() => {
		if (!userName && !sabaId) {
			setIsShowInfoForm(false)
		}
	}, [userName, sabaId])

	useEffect(() => {
		handelClear()
		handleClearBatch()
	}, [payoutType])

	const loading =
		isGetCustInfoDetailsFetching || isGetAdjustmentLimitInfoFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<IssueBonusManagementBatchForm
				loading={isCheckBonusCodeFetching}
				form={batchForm}
				currencyListBySite={currencyListBySite}
				batchBonusCodeInfo={batchBonusCodeInfo}
				onUploadBonus={handleUploadBonus}
				onCheckBatchBonusCode={handleCheckBatchBonusCode}
			/>
			{payoutType === PayoutTypeEnum.BatchBonusPayout &&
				batchLog.length > 0 && <BatchLogTable batchLog={batchLog} />}
			{payoutType === PayoutTypeEnum.BonusPayout && (
				<>
					<IssueBonusManagementSearchForm
						loading={loading}
						searchForm={searchForm}
						onSearch={handleSearch}
					/>
					{isShowInfoForm &&
						!isGetCustInfoDetailsError &&
						(userName || sabaId) && (
							<IssueBonusManagementInfoContent
								infoForm={infoForm}
								custInfoDetails={custInfoDetails}
								adjustmentMax={adjustmentLimitInfo?.adjustmentMax}
								siteId={siteId}
								onClear={handelClear}
							/>
						)}
				</>
			)}
		</LayoutContent.Main>
	)
}

export default IssueBonusManagement

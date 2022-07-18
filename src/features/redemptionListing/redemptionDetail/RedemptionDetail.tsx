import { useEffect } from 'react'
import { useAuth, useQueryParams } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Col, Form, Input, message, Row, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import {
	useLazyGetRedemptionDetailQuery,
	useLazyGetRedemptionLogQuery,
	useSetRedemptionInfoMutation,
	useUploadReceiptMutation,
} from '../api'
import {
	IGetRedemptionDetailResponse,
	IGetRedemptionLogResponse,
	ISetRedemptionInfoArgs,
} from '../type'
import { RedemptionDetailTable } from './components/RedemptionDetailTable'
import { ReceiptUploader } from './components/ReceiptUploader'
import { ShippingInformationTable } from './components/ShippingInformationTable'
import { NoteArea } from './components/NoteArea'
import { RedemptionLogTable } from './components/RedemptionLogTable'
import { StatusEnum } from '../constants'
import { ButtonGroup } from './components/ButtonGroup'

const RedemptionDetail = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [queryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { transId } = queryParams
	const { redemptionId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [
		getRedemptionDetail,
		{
			data: { data: redemptionDetail } = {} as IGetRedemptionDetailResponse,
			isFetching: isGetRedemptionDetailLoading,
		},
	] = useLazyGetRedemptionDetailQuery()

	const [
		getRedemptionLog,
		{
			data: { data: redemptionLog } = {} as IGetRedemptionLogResponse,
			isFetching: isGetRedemptionLogLoading,
		},
	] = useLazyGetRedemptionLogQuery()

	const [setRedemptionInfo, { isLoading: isSetRedemptionInfoLoading }] =
		useSetRedemptionInfoMutation()

	const [uploadReceipt, { isLoading: isUploadReceiptLoading }] =
		useUploadReceiptMutation()
	const handleFetching = async () => {
		if (!redemptionId) return
		try {
			getRedemptionDetail({
				redemptionId: Number(redemptionId),
			}).unwrap()
			getRedemptionLog({
				transId,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetRedemptionInfo = async (action: number) => {
		if (!redemptionDetail) return
		const {
			actualCost,
			comment = '',
			receiptUrls,
		} = await form.validateFields()
		const request: ISetRedemptionInfoArgs = {
			siteId,
			transId,
			action,
			actualCost,
			comment,
			receiptUrls,
		}

		try {
			await setRedemptionInfo(request).unwrap()
			form.setFieldsValue({
				comment: '',
			})
			if (action === StatusEnum.Approve || action === StatusEnum.Rejected) {
				navigate(-1)
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const renderActualCost = () => {
		const { actualCost, status } = redemptionDetail
		form.setFieldsValue({
			actualCost,
		})
		if (status === StatusEnum.Rejected || status === StatusEnum.Approve) {
			return (
				<div style={{ marginBottom: '15px' }}>
					<Typography.Text strong>
						{`${t('Label_ActualCost')} : ${actualCost}`}
					</Typography.Text>
				</div>
			)
		}
		return (
			<Form form={form}>
				<Form.Item
					label={
						<Typography.Text strong>{t('Label_ActualCost')}</Typography.Text>
					}
					name='actualCost'
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_ActualCost'),
							}),
						},
					]}
				>
					<Input />
				</Form.Item>
			</Form>
		)
	}

	// 這裡把 upload image function 拉出來寫主要是要讓 Button Group 可以吃到 loading 狀態 , 避免在圖片上傳完成之前送出
	const handleUploadReceiptImage = async (formData: FormData) => {
		try {
			const { data } = await uploadReceipt(formData).unwrap()
			const newUrls = data.receiptUrls
			const { receiptUrls: currentUrls } = form.getFieldsValue()
			form.setFieldsValue({
				receiptUrls: [...currentUrls, ...newUrls],
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
			// throw error 回去 uploader 元件 , 觸發 error status
			throw error
		}
	}

	useEffect(() => {
		if (!redemptionId) return
		handleFetching()
	}, [redemptionId])

	useEffect(() => {
		if (redemptionDetail) {
			form.setFieldsValue({
				actualCost: redemptionDetail.actualCost,
				receiptUrls: redemptionDetail.receiptUrls
					? [...redemptionDetail.receiptUrls]
					: [],
			})
		}
	}, [isGetRedemptionDetailLoading])

	const loading =
		isGetRedemptionDetailLoading ||
		isGetRedemptionLogLoading ||
		isSetRedemptionInfoLoading

	if (!editPermission?.canUse) return <Navigate to='/403' />
	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${t('Label_RedemptionList')} > ${transId}`}
			/>
			{redemptionDetail && (
				<RedemptionDetailTable
					loading={loading}
					redemptionDetailData={redemptionDetail}
				/>
			)}
			<LayoutContent.Card style={{ marginTop: 20, padding: 30 }}>
				<Row gutter={24}>
					<Col lg={14} md={24} sm={24}>
						<Row gutter={24}>
							<Col lg={14} md={24} sm={24}>
								{redemptionDetail && renderActualCost()}
							</Col>
						</Row>
						{redemptionDetail && (
							<ShippingInformationTable redemptionDetail={redemptionDetail} />
						)}

						<Col span={24}>
							<NoteArea form={form} />
						</Col>

						<Col span={24}>
							<RedemptionLogTable
								redemptionLog={redemptionLog}
								timeZoneUtcOffset={timeZoneUtcOffset}
								loading={isGetRedemptionLogLoading}
							/>
						</Col>
					</Col>
					<Col lg={10} md={24} sm={24}>
						<ReceiptUploader
							form={form}
							onUploadReceipt={handleUploadReceiptImage}
						/>
					</Col>
				</Row>
				<Row gutter={16} style={{ marginTop: '20px' }}>
					{redemptionDetail && (
						<ButtonGroup
							status={redemptionDetail.status}
							onSetRedemptionInfo={handleSetRedemptionInfo}
							loading={isUploadReceiptLoading}
						/>
					)}
				</Row>
			</LayoutContent.Card>
			<AffixButtons>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default RedemptionDetail

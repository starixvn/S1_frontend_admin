import { FC, useState } from 'react'
import {
	IGetAdjustmentTypeData,
	IGetCustDetailData,
	ReasonTypeEum,
} from 'features/balanceAdjustment/balanceAdjustment/type'
import {
	Button,
	Checkbox,
	Col,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
	Typography,
	Upload,
} from 'antd'

import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { MethodTypeEnum } from 'features/balanceAdjustment/constants'
import { UploadOutlined } from '@ant-design/icons'
import { UploadProps } from 'antd/es/upload/interface'

interface IBalanceAdjustmentFormProps {
	loading: boolean
	adjustmentTypeList: IGetAdjustmentTypeData[]
	reasonList: IGetAdjustmentTypeData[]
	custInfoWithBalance: IGetCustDetailData
	form: FormInstance
	methodType: MethodTypeEnum
}

const { Option } = Select
export const xlsxMimeType =
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const BalanceAdjustmentForm: FC<IBalanceAdjustmentFormProps> = ({
	loading,
	adjustmentTypeList,
	custInfoWithBalance,
	reasonList,
	form,
	methodType,
}) => {
	const [selectedReasonType, setSelectedReasonType] = useState<number | null>(
		null
	)
	const { t } = useTranslation()
	const conditionAvailable = Form.useWatch('withdrawalLimitOption', form)
	const fileList = Form.useWatch('fileList', form)

	const props: UploadProps = {
		onRemove: () => {
			form.setFieldsValue({
				fileList: [],
			})
		},
		accept: xlsxMimeType,
		beforeUpload: file => {
			form.setFieldsValue({
				fileList: [file],
			})
			return false
		},
		fileList,
	}

	// 判斷選擇的reason為何，並且把type的值存到state: selectedReasonType
	const handleReasonChange = (selectedReasonId: number) => {
		const selectedReason = reasonList.find(
			reason => reason.id === selectedReasonId
		)
		if (selectedReason) {
			setSelectedReasonType(selectedReason.type)
		}
	}

	return (
		<LayoutContent.Card style={{ marginTop: '20px' }}>
			<Spin spinning={loading}>
				{methodType !== MethodTypeEnum.mainWalletBatch && (
					<Row
						style={{
							marginTop: '10px',
						}}
					>
						<Typography.Title level={4}>
							{`${t('Label_BalanceAmount')} :
						${
							custInfoWithBalance?.balance
								? numberFormatter.format(custInfoWithBalance?.balance)
								: '0'
						}`}
						</Typography.Title>
					</Row>
				)}

				<Form
					layout='vertical'
					size='middle'
					form={form}
					initialValues={{
						withdrawalLimitOption: false,
						transId: '',
						amount: 0,
					}}
					style={{ marginTop: '10px' }}
				>
					<Row align='middle' gutter={16}>
						<Col lg={8} md={24} xs={24}>
							<Form.Item
								name='adjustmentType'
								label={t('Label_AdjustmentType')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AdjustmentType'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select')}
									onChange={() => form.resetFields(['reasonId'])}
								>
									{adjustmentTypeList?.map(type => (
										<Option key={type.id} value={type.id}>
											{type.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row align='middle' gutter={16}>
						<Col lg={8} md={24} xs={24}>
							<Form.Item
								name='reasonId'
								label={t('Label_AdjustmentReason')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AdjustmentReason'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select')}
									onChange={handleReasonChange}
								>
									{reasonList?.map(type => (
										<Option key={type.id} value={type.id}>
											{type.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					{selectedReasonType === ReasonTypeEum.Deposit && (
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='transId'
									label={t('Label_DepositId')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_DepositId'),
											}),
										},
									]}
								>
									<Input allowClear placeholder={t('Label_DepositId')} />
								</Form.Item>
							</Col>
						</Row>
					)}

					{selectedReasonType === ReasonTypeEum.Withdrawal && (
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='transId'
									label={t('Label_WithdrawalId')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_WithdrawalId'),
											}),
										},
									]}
								>
									<Input allowClear placeholder={t('Label_WithdrawalId')} />
								</Form.Item>
							</Col>
						</Row>
					)}

					{methodType !== MethodTypeEnum.mainWalletBatch && (
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='amount'
									label={t('Label_Amount')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Amount'),
											}),
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										type='number'
										placeholder={t('Label_Amount')}
									/>
								</Form.Item>
							</Col>
						</Row>
					)}
					<Row align='middle' gutter={16}>
						<Col lg={8} md={24} xs={24}>
							<Form.Item
								name='withdrawalLimitOption'
								style={{ marginBottom: '5px' }}
								valuePropName='checked'
							>
								<Checkbox style={{ whiteSpace: 'nowrap' }}>
									{t('Label_WithdrawConditionMessage')}
								</Checkbox>
							</Form.Item>
							{/* checked 之後才可使用 */}
							<Form.Item name='withdrawalLimitAmount'>
								<Input
									disabled={!conditionAvailable}
									type='number'
									allowClear
								/>
							</Form.Item>
						</Col>
					</Row>
					{methodType !== MethodTypeEnum.mainWalletBatch && (
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item name='memo' label={t('Label_Memo')}>
									<Input.TextArea allowClear />
								</Form.Item>
							</Col>
						</Row>
					)}
					{methodType === MethodTypeEnum.mainWalletBatch && (
						<Row align='middle' gutter={16} style={{ marginBottom: '10px' }}>
							<Col lg={8} md={24} xs={24}>
								{/* 因為Upload 包在 Button 內 ,沒法直接用 Form.Item 包裝 (會吃到 Button的 Event ) */}
								<Button icon={<UploadOutlined />} block>
									<Upload {...props} maxCount={1}>
										{t('Label_Upload', { key: t('Label_File') })}
									</Upload>
								</Button>
								<Form.Item name='fileList' noStyle />
							</Col>
						</Row>
					)}
				</Form>
			</Spin>
		</LayoutContent.Card>
	)
}

export { BalanceAdjustmentForm }

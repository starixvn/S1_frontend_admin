import { useTranslation } from 'react-i18next'
import { find } from 'lodash'
import {
	Col,
	Descriptions,
	Divider,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Select,
	Spin,
} from 'antd'
import { IEnumTypeData } from 'common/service/enumApi'
import { Currency } from 'common/enum/type'
import {
	AmountRuleEnum,
	EditModalTypeEnum,
	IEditForm,
} from 'features/paymentManagement/type'
import { InputNumber } from 'components'

interface IEditPaymentModalProps {
	loading: boolean
	form: FormInstance<IEditForm>
	visible: boolean
	onCancel: () => void
	typeList: IEnumTypeData[]
	currencyListBySite: Currency[]
	amountRuleList: IEnumTypeData[]
	onSubmit: () => void
}

const EditPaymentModal = ({
	loading,
	form,
	visible,
	onCancel,
	typeList,
	currencyListBySite,
	amountRuleList,
	onSubmit,
}: IEditPaymentModalProps) => {
	const { t } = useTranslation()
	const { payName, currencyId, channelName, type, editType } =
		form.getFieldsValue(true)
	const amountRule = Form.useWatch('amountRule', form)

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			okText={t('Label_Submit')}
			onOk={onSubmit}
			confirmLoading={loading}
			afterClose={() => form.resetFields()}
			title={
				<div style={{ textAlign: 'center' }}>{`${t('Label_Edit')} ${t(
					'Label_Payment'
				)}`}</div>
			}
		>
			<Spin spinning={loading}>
				<Descriptions column={{ lg: 2, md: 2, sm: 1 }}>
					<Descriptions.Item label={t('Label_GateWay')}>
						{payName}
					</Descriptions.Item>
					<Descriptions.Item label={t('Label_Currency')}>
						{
							find(
								currencyListBySite,
								target => target.currencyId === currencyId
							)?.isoCode
						}
					</Descriptions.Item>
					<Descriptions.Item label={t('Label_Channel')}>
						{channelName}
					</Descriptions.Item>
					<Descriptions.Item label={t('Label_Type')}>
						{find(typeList, target => target.value === type)?.name}
					</Descriptions.Item>
				</Descriptions>
				<Divider />
				<Form form={form} layout='horizontal' size='middle'>
					{editType === EditModalTypeEnum.Edit ? (
						// Edit
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='pointLevel'
									label={t('Label_PointLevel')}
									rules={[
										{
											required: true,
											message: t('Label_RequiredText'),
										},
										{
											type: 'number',
											min: 0,
											message: '',
										},
									]}
								>
									<InputNumber />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='sort'
									label={t('Label_Sort')}
									rules={[
										{
											required: true,
											message: t('Label_RequiredText'),
										},
										{
											type: 'number',
											min: 0,
											message: '',
										},
									]}
								>
									<InputNumber />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='minAmount'
									label={t('Label_MinAmount')}
									rules={[
										{
											required: true,
											message: t('Label_RequiredText'),
										},
										{
											type: 'number',
											min: 0,
											message: '',
										},
									]}
								>
									<InputNumber />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='maxAmount'
									label={t('Label_MaxAmount')}
									rules={[
										{
											required: true,
											message: t('Label_RequiredText'),
										},
										{
											type: 'number',
											min: 0,
											message: '',
										},
									]}
								>
									<InputNumber />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='amountRule' label={t('Label_AmountRule')}>
									<Select>
										{amountRuleList?.map(rule => (
											<Select.Option key={rule.value} value={rule.value}>
												{rule.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							{amountRule === AmountRuleEnum.Fixed && (
								<Col span={24}>
									<Form.Item
										name='fixedAmountList'
										label={t('Label_FixedAmount')}
										rules={[
											{
												required: true,
												message: t('Label_RequiredText'),
											},
										]}
									>
										<Input placeholder='etc : 100,2000,5000,10000,30000' />
									</Form.Item>
								</Col>
							)}
						</Row>
					) : (
						<Row gutter={16} align='middle'>
							<Col span={12}>
								<Form.Item
									name='percentage'
									label={`${t('Label_ChargeFee')} ( % )`}
									rules={[
										{
											required: true,
											message: t('Label_RequiredText'),
										},
										{
											type: 'number',
											min: 0,
											message: '',
										},
									]}
								>
									<InputNumber />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='preCount'
									label={t('Label_PerCount')}
									rules={[
										{
											required: true,
											message: t('Label_RequiredText'),
										},
										{
											type: 'number',
											min: 0,
											message: '',
										},
									]}
								>
									<InputNumber />
								</Form.Item>
							</Col>
						</Row>
					)}
				</Form>
			</Spin>
		</Modal>
	)
}

export { EditPaymentModal }

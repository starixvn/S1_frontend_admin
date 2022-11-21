import { Col, Form, FormInstance, InputNumber, Modal, Row, Select } from 'antd'
import {
	IAddForm,
	IGetTpGameTypeData,
	IGetTpListData,
} from 'features/bettingMonitorSetting/type'
import { Currency } from 'common/enum/type'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const { Option } = Select

interface IAddSettingModalProps {
	form: FormInstance<IAddForm>
	visible: boolean
	loading: boolean
	currencyListBySite: Currency[]
	tpList: IGetTpListData[]
	tpGameList: IGetTpGameTypeData[]
	onCancel: () => void
	onSubmit: (
		frequency: number,
		tpGameType: number,
		tpId: number,
		currencyId: number
	) => void
}

const AddSettingModal = ({
	form,
	visible,
	loading,
	currencyListBySite,
	tpList,
	tpGameList,
	onCancel,
	onSubmit,
}: IAddSettingModalProps) => {
	const { t } = useTranslation()

	useEffect(() => {
		if (!visible) {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			title={t('Label_AddMonitorProduct')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			width={400}
			onOk={() => {
				form
					.validateFields()
					.then(({ frequency, tpGameType, tpId, currencyId }) => {
						onSubmit(frequency, tpGameType, tpId, currencyId)
						form.resetFields()
					})
			}}
		>
			<Form form={form} initialValues={{ tpId: null }}>
				<Row align='middle' justify='center' gutter={16}>
					<Col lg={24} md={24} xs={24}>
						<Form.Item
							name='currencyId'
							label={t('Label_Currency')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Currency'),
									}),
								},
							]}
						>
							<Select>
								{currencyListBySite.map(({ currencyId, isoCode }) => (
									<Option key={currencyId} value={currencyId}>
										{isoCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center' gutter={16}>
					<Col lg={24} md={24} xs={24}>
						<Form.Item
							name='tpId'
							label={t('Label_Vender')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Vender'),
									}),
								},
							]}
						>
							<Select>
								{tpList.map(({ id, tpName }) => (
									<Option key={id} value={id}>
										{tpName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center' gutter={16}>
					<Col lg={24} md={24} xs={24}>
						<Form.Item
							name='tpGameType'
							label={t('Label_Product')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Product'),
									}),
								},
							]}
						>
							<Select>
								{tpGameList.map(({ type, typeName }) => (
									<Option key={type} value={type}>
										{typeName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center' gutter={16}>
					<Col lg={24} md={24} xs={24}>
						<Form.Item
							name='frequency'
							label={`${t('Label_Frequency')} (${t('label_Mins')})`}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Frequency'),
									}),
								},
							]}
						>
							<InputNumber
								type='number'
								controls={false}
								min={0}
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default AddSettingModal

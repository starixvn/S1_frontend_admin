import {
	Col,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Select,
	Switch,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { IAddForm } from 'features/externalDomain/type'
import { Currency } from 'common/enum/type'

const { Option } = Select

interface IAddExternalDomainModalProps {
	form: FormInstance<IAddForm>
	loading: boolean
	currencyListBySite: Currency[]
	visible: boolean
	onCancel: () => void
	onFinish: () => void
}

const AddExternalDomainModal = ({
	form,
	loading,
	currencyListBySite,
	visible,
	onCancel,
	onFinish,
}: IAddExternalDomainModalProps) => {
	const { t } = useTranslation()
	return (
		<Modal
			confirmLoading={loading}
			title={<div style={{ textAlign: 'center' }}>{t('Label_AddDomain')}</div>}
			open={visible}
			onCancel={onCancel}
			forceRender
			afterClose={() => {
				form.resetFields(['currencyId', 'status', 'domain', 'sort'])
			}}
			onOk={onFinish}
			width='30vw'
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					currencyId: currencyListBySite[0].currencyId,
					status: 0,
					domain: '',
					sort: '',
				}}
			>
				<Row
					align='middle'
					justify='center'
					gutter={16}
					style={{ alignItems: 'center' }}
				>
					<Col span={12}>
						<Form.Item name='currencyId' label={t('Label_Currency')}>
							<Select>
								{currencyListBySite.map(({ currencyId, isoCode }) => (
									<Option key={currencyId} value={currencyId}>
										{isoCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='status'
							label={t('Label_Status')}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center' gutter={16}>
					<Col span={24}>
						<Form.Item name='domain' label={t('Label_Domain')}>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center' gutter={16}>
					<Col span={24}>
						<Form.Item name='sort' label={t('Label_Sort')}>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default AddExternalDomainModal

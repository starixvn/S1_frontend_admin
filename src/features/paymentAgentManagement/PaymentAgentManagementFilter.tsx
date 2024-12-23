import React from 'react'
import {
	Form,
	Row,
	Col,
	Input,
	Button,
	Select,
	Collapse,
	FormInstance,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'
import { MultipleSelect } from '../../components/Select'

const { Panel } = Collapse
const { Option } = Select

interface PaymentAgentManagementFilterProps {
	loading: boolean
	form: FormInstance
	paymentAgentTypeEnum: Array<{ name: string; value: number }>
	paymentAgentStatusEnum: Array<{ name: string; value: number }>
	onSearch: () => void
}

const PaymentAgentManagementFilter = ({
	loading,
	form,
	paymentAgentTypeEnum,
	paymentAgentStatusEnum,
	onSearch,
}: PaymentAgentManagementFilterProps) => {
	const { t } = useTranslation()

	const statusSelector = () => {
		const onChangeStatus = (newStatus: ('all' | number)[]) => {
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					status: paymentAgentStatusEnum?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					status: newStatus as number[],
				})
			}
		}
		return (
			<Form.Item
				name='status'
				label={t('Label_Status')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Status'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={onChangeStatus}
					placeholder={t('Label_Select')}
				>
					{(paymentAgentStatusEnum?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{paymentAgentStatusEnum?.map(({ name, value }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const typeSelector = () => {
		const onChangeType = (newStatus: ('all' | number)[]) => {
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					types: paymentAgentTypeEnum?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					types: newStatus as number[],
				})
			}
		}
		return (
			<Form.Item
				name='types'
				label={t('Label_Type')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Type'),
						}),
					},
				]}
			>
				<MultipleSelect onChange={onChangeType} placeholder={t('Label_Select')}>
					{(paymentAgentTypeEnum?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{paymentAgentTypeEnum?.map(({ name, value }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch()}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{typeSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{statusSelector()}
							</Col>
						</Row>
						<br />

						<Row justify='end' align='middle' gutter={16}>
							<Col>
								<Button
									data-tour='search-button'
									loading={loading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
								>
									{t('Label_Search')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default PaymentAgentManagementFilter

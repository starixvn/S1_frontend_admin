import { Button, Col, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { PlusOutlined } from '@ant-design/icons'

interface ICustomerNotesFormProps {
	loading: boolean
	form: FormInstance
	onAddNotes: () => void
}

const CustomerNotesForm = ({
	form,
	onAddNotes,
	loading,
}: ICustomerNotesFormProps) => {
	const { t } = useTranslation()
	return (
		<Form layout='vertical' size='middle' form={form} onFinish={onAddNotes}>
			<Row align='middle' gutter={16}>
				<Col span={18}>
					<Form.Item
						name='note'
						label={t('Label_Note')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Note'),
								}),
							},
						]}
					>
						<Input allowClear placeholder={t('Label_AddNoteMsg')} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label={' '}>
						<Button
							loading={loading}
							icon={<PlusOutlined />}
							htmlType='submit'
							type='primary'
						>
							{`${t('Label_Add')}  ${t('Label_Note')}`}
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export { CustomerNotesForm }

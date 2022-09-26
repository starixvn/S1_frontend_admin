import { Button, Col, Collapse, Form, FormInstance, Input, Row } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'

interface IWithdrawalAdjustmentFilterProps {
	loading: boolean
	form: FormInstance
	onSearch: () => void
}
const { Panel } = Collapse

const WithdrawalAdjustmentFilter = ({
	loading,
	form,
	onSearch,
}: IWithdrawalAdjustmentFilterProps) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={onSearch}
						initialValues={{
							userName: '',
							sabaId: '',
						}}
					>
						<Row gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='sabaId' label={t('Label_SabaId')}>
									<Input allowClear placeholder={t('Label_SabaId')} />
								</Form.Item>
							</Col>
						</Row>
						<br />
						<Row justify='end' align='middle'>
							<Col>
								<Button
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

export { WithdrawalAdjustmentFilter }

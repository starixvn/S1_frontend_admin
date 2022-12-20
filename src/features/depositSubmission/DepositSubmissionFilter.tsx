import { Button, Col, Collapse, Form, FormInstance, Input, Row } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'
import { IFilterForm } from 'features/depositSubmission/type'
import { useTranslation } from 'react-i18next'

const { Panel } = Collapse

interface IDepositSubmissionFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	isButtonAble: boolean
	onSearch: () => void
}

const DepositSubmissionFilter = ({
	form,
	loading,
	isButtonAble,
	onSearch,
}: IDepositSubmissionFilterProps) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card>
					<Form layout='vertical' size='middle' form={form} onFinish={onSearch}>
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
						<Row justify='end' align='middle'>
							<Col>
								<Button
									disabled={!isButtonAble}
									loading={loading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
								>
									{t('Label_GetBankList')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default DepositSubmissionFilter

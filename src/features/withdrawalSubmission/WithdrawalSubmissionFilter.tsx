import { FC } from 'react'
import { Button, Col, Collapse, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'

interface IWithdrawalSubmissionFilterProps {
	form: FormInstance
	loading: boolean
	onSearch: () => void
}

const { Panel } = Collapse

const WithdrawalSubmissionFilter: FC<IWithdrawalSubmissionFilterProps> = ({
	form,
	loading,
	onSearch,
}) => {
	const { t } = useTranslation()
	const userName = Form.useWatch('userName', form)
	const sabaId = Form.useWatch('sabaId', form)
	const isButtonAble = userName || sabaId

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						initialValues={{ userName: '', sabaId: '' }}
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
									disabled={!isButtonAble}
									loading={loading}
									icon={<SearchOutlined />}
									onClick={onSearch}
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

export { WithdrawalSubmissionFilter }

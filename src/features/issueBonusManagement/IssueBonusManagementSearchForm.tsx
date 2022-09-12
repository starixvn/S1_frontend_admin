import { Col, Form, FormInstance, Input, Row } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { StyleButton } from './StyleButton'

interface IIssueBonusManagementSearchFormProps {
	loading: boolean
	searchForm: FormInstance
	onSearch: () => void
}

const IssueBonusManagementSearchForm = ({
	loading,
	searchForm,
	onSearch,
}: IIssueBonusManagementSearchFormProps) => {
	const { t } = useTranslation()
	const userName = Form.useWatch('userName', searchForm)
	const sabaId = Form.useWatch('sabaId', searchForm)

	const isSearchButtonDisabled = !userName && !sabaId

	return (
		<LayoutContent.Card>
			<Form
				layout='vertical'
				size='middle'
				form={searchForm}
				onFinish={onSearch}
				initialValues={{
					userName: '',
					sabaId: '',
				}}
			>
				<Row align='middle' gutter={16}>
					<Col lg={6} md={12} xs={12}>
						<Form.Item name='userName' label={t('Label_MemberId')}>
							<Input
								placeholder={t('Label_MemberId')}
								disabled={sabaId}
								allowClear
							/>
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={12}>
						<Form.Item name='sabaId' label={t('Label_SabaId')}>
							<Input
								placeholder={t('Label_SabaId')}
								disabled={userName}
								allowClear
							/>
						</Form.Item>
					</Col>

					<Col
						lg={{ span: 6, offset: 6 }}
						md={{ span: 12, offset: 12 }}
						xs={{ span: 12, offset: 12 }}
					>
						<Form.Item label=' '>
							<StyleButton
								disabled={isSearchButtonDisabled}
								loading={loading}
								htmlType='submit'
								type='primary'
							>
								{t('Label_GetInfo')}
							</StyleButton>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export default IssueBonusManagementSearchForm

import { useTranslation } from 'react-i18next'
import { Col, Row, Tabs, Form, Input, FormInstance } from 'antd'
import { PermissionInterface } from 'type'
import { IEditForm } from 'features/newsManagement/type'
import EditNewsImageUploader from './EditNewsImageUploader'

interface INewsManagementEditorProps {
	langCodes: string[]
	form: FormInstance<IEditForm>
	editPermission?: PermissionInterface
}

const { TextArea } = Input

const NewsManagementEditor = ({
	langCodes,
	form,
	editPermission,
}: INewsManagementEditorProps) => {
	const { t } = useTranslation()
	const disabled = !editPermission?.canUse

	const items = langCodes?.map(langCode => {
		const isRequired = langCode === 'en'

		return {
			label: langCode,
			key: langCode,
			children: (
				<Form
					form={form}
					layout='vertical'
					initialValues={{
						imageUrl: {
							[langCode]: {
								imageUrl: '',
							},
						},
						title: {
							[langCode]: {
								title: '',
							},
						},
						content: {
							[langCode]: {
								content: '',
							},
						},
					}}
					disabled={disabled}
				>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name={['imageUrl', langCode, 'imageUrl']}
								label={t('Label_ImageURL')}
								rules={[
									{
										required: isRequired,
										message: '',
									},
								]}
							>
								<EditNewsImageUploader langCode={langCode} form={form} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name={['title', langCode, 'title']}
								label={t('Label_Title')}
								rules={[
									{
										required: isRequired,
										message: '',
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name={['content', langCode, 'content']}
								label={t('Label_Content')}
								rules={[
									{
										required: isRequired,
										message: '',
									},
								]}
							>
								<TextArea rows={6} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			),
		}
	})

	return <Tabs defaultActiveKey='1' type='card' items={items} />
}

export { NewsManagementEditor }

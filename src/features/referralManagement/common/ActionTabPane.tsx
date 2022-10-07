import { FormInstance, Form, Col, Row, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { TinymceEditor } from 'components'

interface ActionTabPaneProps {
	lang: string
	form: FormInstance
}

const ActionTabPane = ({ lang, form }: ActionTabPaneProps) => {
	const { t } = useTranslation()

	const detail = Form.useWatch(['specific', lang, 'detail'], form)

	const onHtmlStateChange = (newHtml: string) => {
		form.setFieldsValue({
			specific: {
				[lang]: {
					detail: newHtml,
				},
			},
		})
	}

	return (
		<Form form={form} layout='vertical'>
			<Row align='middle' gutter={16}>
				<Col lg={6} md={12} xs={12}>
					<Form.Item
						name={['specific', lang, 'bannerUrl']}
						label={t('Label_BannerUrl')}
					>
						<Input allowClear />
					</Form.Item>
				</Col>
				<Col lg={6} md={12} xs={12}>
					<Form.Item
						name={['specific', lang, 'title']}
						label={t('Label_Title')}
					>
						<Input allowClear />
					</Form.Item>
				</Col>
				<Col lg={6} md={12} xs={12}>
					<Form.Item
						name={['specific', lang, 'description']}
						label={t('Label_Description')}
					>
						<Input allowClear />
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Form.Item
					name={['specific', lang, 'detail']}
					label={t('Label_Detail')}
				>
					<TinymceEditor
						defaultHtmlState={detail}
						onHtmlStateChange={onHtmlStateChange}
					/>
				</Form.Item>
			</Row>
		</Form>
	)
}

export default ActionTabPane

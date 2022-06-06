import { FC } from 'react'
import { FormInstance, Tabs, TabPaneProps, Form, Col, Row, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { Editor } from 'components'

const { TabPane } = Tabs

interface ActionTabPaneProps extends TabPaneProps {
	lang: string
	form: FormInstance<any>
}

const ActionTabPane: FC<ActionTabPaneProps> = ({ lang, form, ...props }) => {
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
		<TabPane {...props}>
			<Form form={form} layout='vertical'>
				<Row align='middle' gutter={16}>
					<Col lg={6} md={12} xs={12}>
						<Form.Item
							name={['specific', lang, 'bannerUrl']}
							label={t('Label_BannerUrl')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_BannerUrl'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={12}>
						<Form.Item
							name={['specific', lang, 'title']}
							label={t('Label_Title')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Title'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={12}>
						<Form.Item
							name={['specific', lang, 'description']}
							label={t('Label_Description')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Description'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item
							name={['specific', lang, 'detail']}
							label={t('Label_Detail')}
						>
							<Editor
								defaultHtmlState={detail}
								onHtmlStateChange={onHtmlStateChange}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</TabPane>
	)
}

export default ActionTabPane

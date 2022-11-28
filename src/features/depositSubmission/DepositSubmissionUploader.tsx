import { Upload, Form, FormInstance, Col, Row, Modal } from 'antd'
import { RcFile } from 'antd/es/upload'
import { PlusOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { IDepositForm } from 'features/depositSubmission/type'
import { getBase64, normFileForFormImageItem } from 'common/utils/image'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

interface IDepositSubmissionUploaderProps {
	form: FormInstance<IDepositForm>
	visible: boolean
	onClick: () => void
	onCancel: () => void
}

const DepositSubmissionUploader = ({
	form,
	visible,
	onClick,
	onCancel,
}: IDepositSubmissionUploaderProps) => {
	const { t } = useTranslation()
	const formReceipt = Form.useWatch('receipt', form)
	const [previewImage, setPreviewImage] = useState('')
	const [previewTitle, setPreviewTitle] = useState('')
	const [previewAlt, setPreviewAlt] = useState('')

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{t('Label_Receipt')}</div>
		</div>
	)

	const props: UploadProps = {
		accept: 'image/*',
		fileList: formReceipt,
		onRemove: () => {
			form.setFieldsValue({
				receipt: [],
			})
		},
		beforeUpload: () => false,
		onPreview: async (file: UploadFile) => {
			if (!file.url && !file.preview) {
				file.preview = await getBase64(file.originFileObj as RcFile)
			}
			setPreviewImage(file.url || (file.preview as string))
			setPreviewTitle(
				file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
			)
			setPreviewAlt(
				file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
			)
			onClick()
		},
		onChange: ({ fileList: [file] }) => {
			if (file) {
				form.setFieldsValue({
					receipt: [file],
				})
			} else {
				form.setFieldsValue({
					receipt: [],
				})
			}
		},
	}

	return (
		<Form layout='vertical' size='middle' form={form}>
			<Row>
				<Col lg={6} md={12} xs={12}>
					<Form.Item
						name='receipt'
						valuePropName='receipt'
						getValueFromEvent={normFileForFormImageItem}
						label={t('Label_Receipt')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Receipt'),
								}),
							},
						]}
					>
						<Upload {...props} listType='picture-card'>
							{formReceipt?.length >= 1 ? null : uploadButton}
						</Upload>
					</Form.Item>
				</Col>
			</Row>
			<Modal
				open={visible}
				title={previewTitle}
				footer={null}
				onCancel={onCancel}
			>
				<img alt={previewAlt} style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</Form>
	)
}

export default DepositSubmissionUploader

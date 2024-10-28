import { FC, useState } from 'react'
import { ReloadOutlined, UploadOutlined } from '@ant-design/icons'
import {
	Button,
	Col,
	Form,
	FormInstance,
	Image,
	Row,
	Space,
	Upload,
} from 'antd'
import { UploadFile, RcFile } from 'antd/es/upload/interface'
import type { UploadProps } from 'antd/es/upload/interface'
import { head } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
	getBase64,
	placeholderBase64Image,
	normFileForFormImageItem,
} from 'common/utils/image'

interface IGiftListingImageUploaderProps {
	form: FormInstance
	lang: string
	pictureUrl: string | undefined
}

const ImageUploader: FC<IGiftListingImageUploaderProps> = ({
	form,
	lang,
	pictureUrl,
}) => {
	const { t } = useTranslation()
	const [uploading, setUploading] = useState<boolean>()
	const formFileList = Form.useWatch<UploadFile[]>(
		['infos', lang, 'fileList'],
		form
	)

	const imageFile = head(formFileList)

	const onLoadPreviewImage = async (file: UploadFile<any> | undefined) => {
		setUploading(true)
		if (file) {
			file.preview = await getBase64(file.originFileObj as RcFile)
			form.setFieldsValue({ fileList: [file] })
		}
		setUploading(false)
	}

	const uploadProps: UploadProps = {
		accept: 'image/*',
		// * 只拿最後一筆資料
		maxCount: 1,
		// * 給予資料將元件轉變為 Control Component
		fileList: imageFile ? [imageFile] : [],
		// * 回傳 false 阻止即時送出 request
		beforeUpload: () => false,
		// * 回傳 false 阻止 antd preview 元件 default 的預覽事件
		onPreview: () => false,
		// * 解析當前圖片的 base64 格式給使用者在傳送前預覽，並 setState
		onChange: async ({ fileList: [file] }) => {
			if (file) {
				await onLoadPreviewImage(file)
				form.setFieldsValue({ fileList: [file] })
			} else {
				form.setFieldsValue({ fileList: [] })
			}
		},
	}

	const previewImage = imageFile?.preview ? imageFile.preview : pictureUrl

	return (
		<Row>
			<Col flex='220px'>
				<Image
					loading='lazy'
					width={200}
					height={200}
					src={uploading ? undefined : previewImage}
					placeholder={
						<Image width={200} preview={false} src={placeholderBase64Image} />
					}
				/>
			</Col>

			<Col>
				<Space direction='vertical'>
					<Button
						style={{ width: '120px' }}
						icon={<ReloadOutlined />}
						type='primary'
						loading={uploading}
						disabled={!imageFile}
						onClick={() => {
							onLoadPreviewImage(imageFile)
						}}
					>
						{uploading ? t('Label_Uploading') : t('Label_Reload')}
					</Button>

					<Form.Item
						name={['infos', lang, 'fileList']}
						// * valuePropName 告訴 form 表單這是 fileList 的資料格式
						valuePropName='fileList'
						getValueFromEvent={normFileForFormImageItem}
						rules={[
							{
								required: !pictureUrl,
								message: t('Label_Required', {
									key: t('Label_Image'),
								}),
							},
						]}
					>
						<Upload {...uploadProps}>
							<Button style={{ width: '120px' }} icon={<UploadOutlined />}>
								{t('Label_Upload', { key: t('Label_File') })}
							</Button>
						</Upload>
					</Form.Item>
				</Space>
			</Col>
		</Row>
	)
}

export default ImageUploader

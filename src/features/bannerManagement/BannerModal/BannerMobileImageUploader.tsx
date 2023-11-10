import { useEffect, useState } from 'react'
import { Form, Button, Upload, message, Image, FormInstance, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useUploadImageMutation } from '../api'

interface ImageUploadProps {
	form: FormInstance
	lang: string
	siteId: number
}

const BannerMobileImageUploader = ({
	form,
	lang,
	siteId,
}: ImageUploadProps) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
	const [uploadImage, { isLoading }] = useUploadImageMutation()

	useEffect(() => {
		const initialImageUrl = form.getFieldValue([
			'specific',
			lang,
			'bannerMobileUrl',
		])
		if (initialImageUrl) {
			setUploadedImageUrl(initialImageUrl)
		}
	}, [form, lang])

	const handleUpload = async (file: Blob) => {
		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('File', file)

		try {
			const res = await uploadImage(formData).unwrap()
			form.setFieldsValue({
				specific: {
					[lang]: {
						...form.getFieldValue(['specific', lang]),
						bannerMobileUrl: res.data.returnImagePath,
					},
				},
			})
			setUploadedImageUrl(res.data.returnImagePath)
		} catch (error: any) {
			message.error(
				`Image upload failed: ${error.data?.message || error.message}`
			)
		}
	}

	// const uploadedImageUrl = form.getFieldValue([
	// 	'specific',
	// 	lang,
	// 	'bannerMobileUrl',
	// ])

	const onChange = async ({
		fileList: newFileList,
	}: UploadChangeParam<UploadFile>) => {
		setFileList(newFileList)
	}

	const beforeUpload = (file: Blob) => {
		handleUpload(file)
		return false
	}

	return (
		<Form form={form}>
			<Form.Item name='bannerImageUrl'>
				<Upload
					name='banner'
					listType='picture'
					fileList={fileList}
					beforeUpload={beforeUpload}
					onChange={onChange}
					onRemove={() => true}
					maxCount={1}
					showUploadList={false}
				>
					<Button icon={<UploadOutlined />}>Upload Image</Button>
				</Upload>
			</Form.Item>
			<Spin spinning={isLoading}>
				{uploadedImageUrl && (
					<Image src={uploadedImageUrl} alt='Banner Image' />
				)}
			</Spin>
		</Form>
	)
}

export default BannerMobileImageUploader

import React, { useEffect, useState } from 'react'
import { Form, Button, Upload, message, Image } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useUploadImageMutation } from '../api'

interface Props {
	form: any
	lang: any
	siteId: any
}

const BannerMobileImageUploader: React.FC<Props> = ({ form, lang, siteId }) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
	const [uploadImage] = useUploadImageMutation()

	useEffect(() => {
		const initialImageUrl = form.getFieldValue([
			'specific',
			lang,
			'bannerPCUrl',
		])
		if (initialImageUrl) {
			setUploadedImageUrl(initialImageUrl)
		}
	}, [form, lang])

	const handleUpload = async (file: any) => {
		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId)
		formData.append('File', file)

		try {
			const res = await uploadImage(formData).unwrap()
			form.setFieldsValue({
				bannerPCUrl: res.data.returnImagePath,
			})
			setUploadedImageUrl(res.data.returnImagePath)
			form.setFieldsValue({
				specific: {
					[lang]: {
						...form.getFieldValue(['specific', lang]),
						bannerPCUrl: res.data.returnImagePath,
					},
				},
			})
		} catch (error: any) {
			message.error(
				`Image upload failed: ${error.data?.message || error.message}`
			)
		}
	}

	const onChange = async ({
		fileList: newFileList,
	}: UploadChangeParam<UploadFile<any>>) => {
		setFileList(newFileList)
	}

	const beforeUpload = (file: UploadFile) => {
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
				>
					<Button icon={<UploadOutlined />}>Upload Image</Button>
				</Upload>
			</Form.Item>
			{uploadedImageUrl && <Image src={uploadedImageUrl} alt='BannerImage' />}
		</Form>
	)
}

export default BannerMobileImageUploader

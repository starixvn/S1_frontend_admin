import React, { useEffect, useState } from 'react'
import { Form, Button, Upload, message, Image } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useUploadImageMutation } from '../api'

interface Props {
	form: any
	langCode: any
}

const EditImageUploader: React.FC<Props> = ({ form, langCode }) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
	const [uploadImage, { isLoading }] = useUploadImageMutation()
	const { siteId } = useAppSelector(selectUserSite) as { siteId: number }

	useEffect(() => {
		const initialImageUrl = form.getFieldValue([
			'imageUrl',
			langCode,
			'imageUrl',
		])
		if (initialImageUrl) {
			setUploadedImageUrl(initialImageUrl)
		}
	}, [form, langCode])

	const handleChange = async (info: UploadChangeParam<UploadFile<any>>) => {
		setFileList(info.fileList)
		if (info.file.status === 'done') {
			await handleUpload()
		}
	}

	const handleUpload = async () => {
		if (fileList.length === 0) {
			message.error('Please select a file to upload.')
			return
		}

		const file = fileList[0].originFileObj
		if (!file) {
			message.error('File not found after selection')
			return
		}

		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('File', file)

		try {
			const res = await uploadImage(formData).unwrap()
			form.setFieldsValue({
				bannerImageUrl: res.data.returnImagePath,
			})
			setUploadedImageUrl(res.data.returnImagePath)
			form.setFieldsValue({
				imageUrl: {
					[langCode]: {
						...form.getFieldValue(['imageUrl', langCode]),
						imageUrl: res.data.returnImagePath,
					},
				},
			})
		} catch (error: any) {
			message.error(
				`Image upload failed: ${error.data?.message || error.message}`
			)
		}
	}

	return (
		<Form form={form}>
			{uploadedImageUrl && <Image src={uploadedImageUrl} alt='BannerImage' />}
			<Form.Item name='bannerImageUrl'>
				<Upload
					name='banner'
					listType='picture'
					fileList={fileList}
					beforeUpload={() => false}
					onChange={handleChange}
					onRemove={() => true}
				>
					<Button icon={<UploadOutlined />}>Select File</Button>
				</Upload>
			</Form.Item>
			<Button
				type='primary'
				onClick={handleUpload}
				disabled={fileList.length === 0}
				loading={isLoading}
			>
				Upload
			</Button>
		</Form>
	)
}

export default EditImageUploader

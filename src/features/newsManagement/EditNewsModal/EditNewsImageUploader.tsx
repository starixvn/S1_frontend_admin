import React, { useEffect, useState } from 'react'
import { Form, Button, Upload, message, Image, FormInstance, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useUploadNewsImageMutation } from '../api'

interface Props {
	form: FormInstance
	langCode: string
}

const EditNewsImageUploader: React.FC<Props> = ({ form, langCode }) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
	const [uploadNewsImage, { isLoading }] = useUploadNewsImageMutation()

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

	const handleUpload = async (file: Blob) => {
		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('File', file)

		try {
			const res = await uploadNewsImage(formData).unwrap()
			form.setFieldsValue({
				imageUrl: res.data.returnImagePath,
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

	const onChange = async ({
		fileList: newFileList,
	}: UploadChangeParam<UploadFile<any>>) => {
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
					maxCount={1}
					listType='picture'
					fileList={fileList}
					onChange={onChange}
					beforeUpload={beforeUpload}
					onRemove={() => true}
					showUploadList={false}
				>
					<Button icon={<UploadOutlined />}>Select File</Button>
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

export default EditNewsImageUploader

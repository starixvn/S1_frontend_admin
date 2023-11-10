import React, { useEffect, useState } from 'react'
import { Form, Button, Upload, message, Image, FormInstance, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useUploadImageMutation } from '../api'

interface Props {
	form: FormInstance
	tabsKey: string
}

const EditBannerImageUploader: React.FC<Props> = ({ form, tabsKey }) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
	const [uploadImage, { isLoading }] = useUploadImageMutation()
	const { siteId } = useAppSelector(selectUserSite) as { siteId: number }

	useEffect(() => {
		const initialImageUrl = form.getFieldValue([
			'details',
			tabsKey,
			'bannerUrl',
		])
		if (initialImageUrl) {
			setUploadedImageUrl(initialImageUrl)
		}
	}, [form, tabsKey])

	const handleUpload = async (file: Blob) => {
		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('File', file)

		try {
			const res = await uploadImage(formData).unwrap()
			form.setFieldsValue({
				bannerUrl: res.data.returnImagePath,
			})
			setUploadedImageUrl(res.data.returnImagePath)
			form.setFieldsValue({
				details: {
					[tabsKey]: {
						...form.getFieldValue(['imageUrl', tabsKey]),
						bannerUrl: res.data.returnImagePath,
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

export default EditBannerImageUploader

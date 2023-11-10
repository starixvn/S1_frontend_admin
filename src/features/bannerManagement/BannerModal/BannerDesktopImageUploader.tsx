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

const BannerDesktopImageUploader = ({
	form,
	lang,
	siteId,
}: ImageUploadProps) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
	const [uploadImage, { isLoading }] = useUploadImageMutation()

	// useEffect: 當組件加載或（form, lang）變更時， 搭配getFieldValue從 form 中獲取初始圖片 URL，並渲染尚未變更前的圖片
	// 搭配發送api ，也就是只會去抓form裡面name值 (bannerPCUrl) 的值，並且把值設定給uploadedImageUrl
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

	// handleUpload:
	// - 處理圖片上傳的邏輯。
	// - 創建 FormData 物件，並添加所需的參數和文件。
	// - 使用 uploadImage API 發送請求並處理響應或錯誤。
	// - 上傳成功後，更新表單中相應的值，並設置 uploadedImageUrl 以顯示新的圖片。

	const handleUpload = async (file: Blob) => {
		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
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

	// onChange:
	// - 文件選擇或狀態變更時觸發。
	// - 更新 fileList 狀態，以反映當前選中的文件。

	const onChange = async ({
		fileList: newFileList,
	}: UploadChangeParam<UploadFile<any>>) => {
		setFileList(newFileList)
	}

	// beforeUpload:
	// - 文件上傳前觸發。
	// - 執行自定義上傳操作並返回 false 以阻止默認行為。

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

export default BannerDesktopImageUploader

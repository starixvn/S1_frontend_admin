import { useState } from 'react'
import { Form, Button, Upload, message, Image, FormInstance, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useWatch } from 'antd/lib/form/Form'
import { useTranslation } from 'react-i18next'
import { useUploadBonusImageMutation } from '../api'

interface EditBannerImageUploaderArgs {
	form: FormInstance
	tabsKey: string
}

const EditBannerImageUploader = ({
	form,
	tabsKey,
}: EditBannerImageUploaderArgs) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadBonusImage, { isLoading }] = useUploadBonusImageMutation()
	const { t } = useTranslation()
	const formImageUrl = useWatch(['details', tabsKey, 'bannerUrl'], form)
	const { siteId } = useAppSelector(selectUserSite) as { siteId: number }

	const handleUpload = async (file: Blob) => {
		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('File', file)

		try {
			const res = await uploadBonusImage(formData).unwrap()
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
					<Button icon={<UploadOutlined />}>
						{t('Label_Upload', { key: t('Label_File') })}
					</Button>
				</Upload>
			</Form.Item>
			<Spin spinning={isLoading}>
				{formImageUrl && <Image src={formImageUrl} alt='Banner Image' />}
			</Spin>
		</Form>
	)
}

export default EditBannerImageUploader

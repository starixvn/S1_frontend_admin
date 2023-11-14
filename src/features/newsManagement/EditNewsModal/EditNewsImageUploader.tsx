import { useState } from 'react'
import { Button, Upload, message, Image, Spin, FormInstance } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useWatch } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'
import { useUploadNewsImageMutation } from '../api'

interface EditNewsImageUploaderArgs {
	form: FormInstance
	langCode: string
}

const EditNewsImageUploader = ({
	form,
	langCode,
}: EditNewsImageUploaderArgs) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadNewsImage, { isLoading }] = useUploadNewsImageMutation()
	const { t } = useTranslation()
	const formImageUrl = useWatch(['imageUrl', langCode, 'imageUrl'], form)
	const { siteId } = useAppSelector(selectUserSite) as { siteId: number }

	const handleUpload = async (file: Blob) => {
		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('File', file)

		try {
			const res = await uploadNewsImage(formData).unwrap()
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
		<>
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
			<Spin spinning={isLoading}>
				{formImageUrl && <Image src={formImageUrl} alt='Banner Image' />}
			</Spin>
		</>
	)
}

export default EditNewsImageUploader

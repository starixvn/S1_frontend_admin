import { useTranslation } from 'react-i18next'
import { Button, Image, Spin, Upload } from 'antd'
import { UploadProps } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'

import { isEmpty } from 'lodash'

interface ISlotImageUploader {
	isLoading: boolean
	onUploadImage: (file: Blob) => Promise<string>
}

const SlotImageUploader = ({
	isLoading,
	onUploadImage,
}: ISlotImageUploader) => {
	const { t } = useTranslation()
	const [formImageUrl, setFormImageUrl] = useState('')

	const props: UploadProps = {
		accept: 'image/*',
		maxCount: 1,
		onRemove: () => false,
		beforeUpload: async file => {
			const url = await onUploadImage(file)
			setFormImageUrl(url)
			return false
		},
	}

	return (
		<>
			<Upload {...props}>
				<Button icon={<UploadOutlined />}>
					{t('Label_Upload', { key: t('Label_Image') })}
				</Button>
			</Upload>
			<div
				style={{ position: 'relative', marginTop: '10px', minHeight: '200px' }}
			>
				<Spin
					spinning={isLoading}
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
					}}
				/>
				{!isEmpty(formImageUrl) && <Image src={formImageUrl} alt='' />}
			</div>
		</>
	)
}

export { SlotImageUploader }

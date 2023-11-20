import { Button, Upload, Image, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { FormInstance, useWatch } from 'antd/lib/form/Form'
import { useTranslation } from 'react-i18next'

interface IBannerImageUploaderArgs {
	lang: string
	imageType: string
	form: FormInstance
	isLoading: boolean
	fileList: UploadFile[]
	onChange: (info: UploadChangeParam<UploadFile>) => void
	beforeUpload: (file: Blob) => boolean
}

const BannerImageUploader = ({
	lang,
	form,
	fileList,
	isLoading,
	imageType,
	onChange,
	beforeUpload,
}: IBannerImageUploaderArgs) => {
	const { t } = useTranslation()
	const formImageUrl = useWatch(
		[
			'specific',
			lang,
			imageType === 'desktop' ? 'bannerPCUrl' : 'bannerMobileUrl',
		],
		form
	)

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
				{formImageUrl && <Image src={formImageUrl} alt='' />}
			</div>
		</>
	)
}

export default BannerImageUploader

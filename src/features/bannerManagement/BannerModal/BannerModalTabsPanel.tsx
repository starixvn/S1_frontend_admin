import { useState } from 'react'
import { Col, Form, FormInstance, Input, Row, UploadFile, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { ActionModeEnum } from 'features/bannerManagement/constants'
import { IAddForm } from 'features/bannerManagement/type'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { UploadChangeParam } from 'antd/lib/upload'
import { useUploadBannerImageMutation } from '../api'
import BannerImageUploader from './BannerImageUploader'

interface IBannerModalTabsPanelProps {
	form: FormInstance<IAddForm>
	lang: string
	actionMode: number | string
}

const BannerModalTabsPanel = ({
	form,
	lang,
	actionMode,
}: IBannerModalTabsPanelProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) as { siteId: number }
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [uploadBannerImage] = useUploadBannerImageMutation()
	const [isLoadingMobile, setIsLoadingMobile] = useState(false)
	const [isLoadingDesktop, setIsLoadingDesktop] = useState(false)

	// handleUpload
	// - 異步上傳桌面或手機使用的圖片。
	// - file: 要上傳的圖片文件。
	// - imageType: 圖片的類型，'desktop' 或 'mobile'。

	const handleUpload = async (file: Blob, imageType: 'desktop' | 'mobile') => {
		const setIsLoading =
			imageType === 'desktop' ? setIsLoadingDesktop : setIsLoadingMobile
		setIsLoading(true)

		const formData = new FormData()
		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('File', file)

		try {
			const res = await uploadBannerImage(formData).unwrap()
			const fieldPath =
				imageType === 'desktop' ? 'bannerPCUrl' : 'bannerMobileUrl'
			form.setFieldsValue({
				specific: {
					[lang]: {
						...form.getFieldValue(['specific', lang]),
						[fieldPath]: res.data.returnImagePath,
					},
				},
			})
		} catch (error: any) {
			message.error(
				`Image upload failed: ${error.data?.message || error.message}`
			)
		} finally {
			setIsLoading(false)
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

	const beforeUpload = (file: Blob, type: 'desktop' | 'mobile') => {
		handleUpload(file, type)
		return false
	}
	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{
				specific: {
					[lang]: {
						bannerLink: '',
						bannerPCUrl: '',
						bannerMobileUrl: '',
					},
				},
			}}
		>
			{(actionMode === ActionModeEnum.RedirectPage ||
				actionMode === ActionModeEnum.OpenWindow) && (
				<Row align='middle' gutter={16}>
					<Col lg={16} md={24} xs={24}>
						<Form.Item
							name={['specific', lang, 'bannerLink']}
							label={t('Label_BannerLink')}
							rules={[{ required: true }]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
			)}

			<Row gutter={16}>
				<Col lg={12} md={12} xs={24}>
					<Form.Item
						name={['specific', lang, 'bannerPCUrl']}
						label={t('Label_BannerPcPicUrl')}
						rules={[{ required: true }]}
					>
						<BannerImageUploader
							form={form}
							lang={lang}
							fileList={fileList}
							onChange={onChange}
							isLoading={isLoadingDesktop}
							imageType='desktop'
							beforeUpload={file => beforeUpload(file, 'desktop')}
						/>
					</Form.Item>
				</Col>
				<Col lg={12} md={12} xs={24}>
					<Form.Item
						name={['specific', lang, 'bannerMobileUrl']}
						label={t('Label_BannerMobilePicUrl')}
						rules={[{ required: true }]}
					>
						<BannerImageUploader
							form={form}
							lang={lang}
							fileList={fileList}
							onChange={onChange}
							isLoading={isLoadingMobile}
							imageType='mobile'
							beforeUpload={file => beforeUpload(file, 'mobile')}
						/>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export default BannerModalTabsPanel

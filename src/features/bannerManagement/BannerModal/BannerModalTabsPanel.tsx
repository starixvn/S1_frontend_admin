import { Col, Form, FormInstance, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { ActionModeEnum } from 'features/bannerManagement/constants'
import { IAddForm } from 'features/bannerManagement/type'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import BannerDesktopImageUploader from './BannerDesktopImageUploader'
import BannerMobileImageUploader from './BannerMobileImageUploader'

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
	const { siteId } = useAppSelector(selectUserSite) as {
		siteId: number
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
						<BannerDesktopImageUploader
							form={form}
							lang={lang}
							siteId={siteId}
						/>
					</Form.Item>
				</Col>
				<Col lg={12} md={12} xs={24}>
					<Form.Item
						name={['specific', lang, 'bannerMobileUrl']}
						label={t('Label_BannerMobilePicUrl')}
						rules={[{ required: true }]}
					>
						<BannerMobileImageUploader
							form={form}
							lang={lang}
							siteId={siteId}
						/>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export default BannerModalTabsPanel

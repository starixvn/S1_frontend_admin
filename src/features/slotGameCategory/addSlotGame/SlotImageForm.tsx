import { Card, Col, Row, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { SlotImageUploader } from 'features/slotGameCategory/addSlotGame/SlotImageUploader'

interface ISlotImageFormProps {
	onUploadImage: ({
		file,
		lang,
	}: {
		file: Blob
		lang: 'en' | 'cs'
	}) => Promise<string>
}
const SlotImageForm = ({ onUploadImage }: ISlotImageFormProps) => {
	const { t } = useTranslation()
	return (
		<LayoutContent.Card>
			<Typography.Title level={5} type='warning'>
				{t('Label_AddSlotFunction_Step2')}
			</Typography.Title>
			<Row gutter={16}>
				<Col lg={12} md={12} xs={24}>
					<Card title={t('Label_EnPic')}>
						<SlotImageUploader
							isLoading={false}
							onUploadImage={file => onUploadImage({ file, lang: 'en' })}
						/>
					</Card>
				</Col>
				<Col lg={12} md={12} xs={24}>
					<Card title={t('Label_CsPic')}>
						<SlotImageUploader
							isLoading={false}
							onUploadImage={file => onUploadImage({ file, lang: 'cs' })}
						/>
					</Card>
				</Col>
			</Row>
		</LayoutContent.Card>
	)
}

export { SlotImageForm }

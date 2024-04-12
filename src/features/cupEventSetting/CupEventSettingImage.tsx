import { Dispatch, FC, SetStateAction } from 'react'
import { Button, Image } from 'antd'
import image from 'assets/images/worldcup/worldcup.png'
import { useTranslation } from 'react-i18next'

interface ICupEventSettingImageProps {
	imageVisible: boolean
	setImageVisible: Dispatch<SetStateAction<boolean>>
}

const CupEventSettingImage: FC<ICupEventSettingImageProps> = ({
	imageVisible,
	setImageVisible,
}) => {
	const { t } = useTranslation()
	return (
		<>
			<Image
				width={200}
				style={{ display: 'none' }}
				src={image}
				preview={{
					visible: imageVisible,
					onVisibleChange: value => {
						setImageVisible(value)
					},
				}}
			/>
			<Button type='primary' onClick={() => setImageVisible(true)}>
				{t('Label_ShowImagePreview')}
			</Button>
		</>
	)
}

export default CupEventSettingImage

import { Button, Image, Popconfirm, Spin } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

interface IUploaderImageProps {
	isKyc: boolean
	src: string | undefined
	onRemove: () => void
	deleteLoading: boolean
}

const ImageContainer = styled.div`
	position: relative;
`

const StyleButton = styled(Button)`
	position: absolute;
	z-index: 100;
	top: 20px;
	right: 0;
`

const UploaderImage = ({
	isKyc,
	src,
	onRemove,
	deleteLoading,
}: IUploaderImageProps) => {
	const { t } = useTranslation()
	return (
		<Spin spinning={deleteLoading}>
			<ImageContainer>
				<Image src={src} style={{ marginTop: '20px' }} width='100%' />
				{!isKyc && (
					<Popconfirm title={t('Label_SureToDelete')} onConfirm={onRemove}>
						<StyleButton icon={<DeleteOutlined />} />
					</Popconfirm>
				)}
			</ImageContainer>
		</Spin>
	)
}

export { UploaderImage }

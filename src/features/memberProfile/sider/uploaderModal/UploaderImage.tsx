import { Button, Image, Spin } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styled from 'styled-components'

interface IUploaderImageProps {
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
	src,
	onRemove,
	deleteLoading,
}: IUploaderImageProps) => {
	return (
		<Spin spinning={deleteLoading}>
			<ImageContainer>
				<Image
					src={src}
					preview={false}
					style={{ marginTop: '20px' }}
					width='100%'
				/>
				<StyleButton icon={<DeleteOutlined />} onClick={onRemove} />
			</ImageContainer>
		</Spin>
	)
}

export { UploaderImage }

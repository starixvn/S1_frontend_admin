import { Modal, Upload, Button, Empty, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
import { findIndex } from 'lodash'
import { UploaderImage } from 'features/memberProfile/sider/uploaderModal/UploaderImage'
import { IGetCustPhotoData } from 'features/memberProfile/type'

interface IUploadPicModalProps {
	isKyc: boolean
	deleteLoading: boolean
	custPhotoListLoading: boolean
	uploading: boolean
	visible: boolean
	onCancel: () => void
	custPhotoList: IGetCustPhotoData[]
	onDeletePhoto: (id: number) => void
	onUploadPhoto: (file: UploadFile) => void
}

const UploadPicModal = ({
	isKyc,
	deleteLoading,
	custPhotoListLoading,
	visible,
	onCancel,
	custPhotoList,
	onDeletePhoto,
	onUploadPhoto,
	uploading,
}: IUploadPicModalProps) => {
	const { t } = useTranslation()
	const [fileList, setFileList] = useState<UploadFile[]>([])

	const props: UploadProps = {
		accept: 'image/*',
		maxCount: 5,
		onRemove: () => {
			setFileList([])
		},
		beforeUpload: () => false,
		itemRender: () => false,
		onChange: async ({ file, fileList: newFileList }) => {
			const index = findIndex(newFileList, item => item.uid === file.uid)
			const currentFile = newFileList[index]
			await onUploadPhoto(currentFile)
		},
		fileList,
	}

	useEffect(() => {
		// 初始化相片, 更新後重新載入圖片
		if (!custPhotoListLoading && custPhotoList.length !== 0) {
			const initFileList: UploadFile[] = []
			custPhotoList.forEach(photo => {
				const { photoUrl, id } = photo
				const file: UploadFile = {
					uid: String(id),
					name: photoUrl?.split('/').pop() ?? 'receipt',
					status: 'done',
					url: photoUrl,
				}
				initFileList.push(file)
			})
			setFileList(initFileList)
		} else {
			setFileList([])
		}
	}, [custPhotoListLoading])

	return (
		<Modal
			open={visible}
			title={t('Label_IdentificationCard')}
			onCancel={onCancel}
			footer={[
				<Button icon={<UploadOutlined />} loading={uploading}>
					<Upload {...props}>
						{t('Label_Upload', { key: t('Label_Image') })}
					</Upload>
				</Button>,
			]}
		>
			<Spin spinning={custPhotoListLoading}>
				<div
					style={{
						overflowY: 'scroll',
						maxHeight: '60vh',
						minHeight: '60vh',
					}}
				>
					{fileList.length === 0 && <Empty />}
					{fileList.map(file => {
						const { uid } = file
						if (file.url) {
							return (
								<UploaderImage
									isKyc={isKyc}
									key={Number(uid)}
									src={file.url}
									deleteLoading={deleteLoading}
									onRemove={() => onDeletePhoto(Number(uid))}
								/>
							)
						}
						return (
							<UploaderImage
								isKyc={isKyc}
								key={Number(uid)}
								src={file.preview}
								deleteLoading={deleteLoading}
								onRemove={() => onDeletePhoto(Number(uid))}
							/>
						)
					})}
				</div>
			</Spin>
		</Modal>
	)
}

export { UploadPicModal }

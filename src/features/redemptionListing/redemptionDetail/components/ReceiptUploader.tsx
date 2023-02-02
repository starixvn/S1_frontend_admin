import { FC, useEffect, useState } from 'react'
import { Form, FormInstance, Modal, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import { RcFile } from 'antd/es/upload'
import { cloneDeep, findIndex } from 'lodash'
import { cloudImgURL } from 'app/constants/images'
import { getBase64 } from 'common/utils/image'
import { useModal } from 'common/hooks'

interface ReceiptUploaderInterface {
	form: FormInstance
	disabled: boolean | undefined
	onUploadReceipt: (data: FormData) => void
}

const ReceiptUploader: FC<ReceiptUploaderInterface> = ({
	form,
	disabled,
	onUploadReceipt,
}) => {
	const { t } = useTranslation()
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const initReceiptUrls = Form.useWatch('receiptUrls', form)
	const previewModal = useModal()
	const [previewImage, setPreviewImage] = useState('')
	const [previewTitle, setPreviewTitle] = useState('')
	const [previewAlt, setPreviewAlt] = useState('')
	const [isImageLoaded, setImageLoaded] = useState(false)
	const props: UploadProps = {
		accept: 'image/*',
		fileList,
		onRemove: file => {
			const index = fileList.indexOf(file)
			const newFileList = fileList.slice()
			const { receiptUrls: currentUrls } = form.getFieldsValue()
			currentUrls.splice(index, 1)
			newFileList.splice(index, 1)
			setFileList(newFileList)
			form.setFieldsValue({
				receiptUrls: currentUrls,
			})
		},
		beforeUpload: () => false,
		onPreview: async (file: UploadFile) => {
			if (!file.url && !file.preview) {
				file.preview = await getBase64(file.originFileObj as RcFile)
			}
			setPreviewImage(file.url || (file.preview as string))
			setPreviewTitle(
				file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
			)
			setPreviewAlt(
				file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
			)
			previewModal.onOpen()
		},
		onChange: async ({ file, fileList: newFileList }) => {
			const index = findIndex(newFileList, item => item.uid === file.uid)
			// 複製一個 uploadFile , 和初始List 出來 , 以便調整 status 狀態
			const currentFile = newFileList[index]
			const cloneList = cloneDeep(fileList)
			currentFile.status = 'uploading'
			setFileList([...cloneList, currentFile])
			try {
				const formData = new FormData()
				formData.append('File', currentFile.originFileObj as RcFile)
				await onUploadReceipt(formData)
				currentFile.status = 'done'
				setFileList([...cloneList, currentFile])
			} catch (error) {
				currentFile.status = 'error'
				setFileList([...cloneList, currentFile])
			}
		},
	}

	useEffect(() => {
		// 這裡添加一個 isImageLoaded 狀態 , 使 imageInit function 只在第一次獲取資料時進行初始化
		if (!initReceiptUrls || isImageLoaded) return
		const imageInit = () => {
			const initFileList: UploadFile[] = []
			initReceiptUrls.forEach((url: string) => {
				const file: UploadFile = {
					uid: uuidV4(),
					name: url?.split('/').pop() ?? 'receipt',
					status: 'done',
					url: `${cloudImgURL}${url}`,
				}
				initFileList.push(file)
			})
			setFileList(initFileList)
			setImageLoaded(true)
		}
		if (initReceiptUrls.length === 0) {
			// 避免空陣列在第一次新增圖片時二次加載 , 故若初始值是空陣列時直接將狀態設為加載完畢
			setImageLoaded(true)
		} else {
			imageInit()
		}
	}, [initReceiptUrls])

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{t('Label_Receipt')}</div>
		</div>
	)
	return (
		<Form form={form} component={false}>
			{/* 此處 form.Item 單純用來儲存 urls , 供設定 api 使用 , 上傳圖片邏輯寫在 Upload內 */}
			<Form.Item name='receiptUrls' />
			<Upload {...props} listType='picture-card' disabled={disabled}>
				{fileList.length >= 10 ? null : uploadButton}
			</Upload>
			<Modal
				open={previewModal.visible}
				title={previewTitle}
				footer={null}
				onCancel={previewModal.onCancel}
			>
				<img alt={previewAlt} style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</Form>
	)
}

export { ReceiptUploader }

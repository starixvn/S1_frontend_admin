import { useTranslation } from 'react-i18next'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { Card, Form, FormInstance, Modal, Spin, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRef, useState } from 'react'
import { getBase64, normFileForFormImageItem } from 'common/utils/image'
import { findIndex } from 'lodash'
import { useModal, usePasteEffect } from 'common/hooks'
import { RcFile } from 'antd/es/upload'
import { multiEqual } from 'common/utils'
import { PermissionInterface } from 'type'
import {
	DepositStatusEnum,
	IDepositReceiptByTransIdData,
} from 'features/depositOperator/type'

interface IReceiptUploaderProps {
	loading: boolean
	form: FormInstance
	depositReceiptByTransIdList: IDepositReceiptByTransIdData[]
	editPermission?: PermissionInterface
	uploadReceiptPermission?: PermissionInterface
	deleteReceiptPermission?: PermissionInterface
	status: DepositStatusEnum
	onUploadImage: (result: RcFile) => void
	onDeleteImage: (number: number) => void
}

const ReceiptUploader = ({
	loading,
	form,
	depositReceiptByTransIdList,
	status,
	editPermission,
	uploadReceiptPermission,
	deleteReceiptPermission,
	onUploadImage,
	onDeleteImage,
}: IReceiptUploaderProps) => {
	const { t } = useTranslation()
	// 判斷當前狀態能否使用
	const canEdit =
		multiEqual(status, [DepositStatusEnum.Pending, DepositStatusEnum.OnHold]) &&
		uploadReceiptPermission?.canUse &&
		deleteReceiptPermission?.canUse &&
		editPermission?.canUse
	const componentRef = useRef(null)
	const formFileList = Form.useWatch('fileList', form)
	// previewState
	const previewModal = useModal()
	const [previewImage, setPreviewImage] = useState('')
	const [previewAlt, setPreviewAlt] = useState('')

	// Paste Upload 綁定
	usePasteEffect(async (result, kind) => {
		if (kind === 'file' && canEdit) {
			onUploadImage(result as RcFile)
		}
	}, componentRef)

	const props: UploadProps = {
		fileList: formFileList || [],
		accept: 'image/*',
		listType: 'picture-card',
		onRemove: async file => {
			const { uid } = file
			const deleteNum = depositReceiptByTransIdList.find(
				({ receiptNo }) => receiptNo === Number(uid)
			)?.receiptNo
			await onDeleteImage(Number(deleteNum))
			// 不做 刪除動畫 , 直接打 api , 透過 api refetch 更新 picList
			return false
		},
		beforeUpload: () => false,
		onPreview: async (file: UploadFile) => {
			if (!file.url && !file.preview) {
				file.preview = await getBase64(file.originFileObj as RcFile)
			}
			setPreviewImage(file.url || (file.preview as string))
			setPreviewAlt(
				file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
			)
			previewModal.onOpen()
		},
		onChange: async ({ file, fileList: newFileList }) => {
			const index = findIndex(newFileList, item => item.uid === file.uid)
			// 複製一個 uploadFile , 和初始List 出來 , 以便調整 status 狀態
			const currentFile = newFileList[index]
			// const image = await getBase64(currentFile.originFileObj as RcFile)
			await onUploadImage(currentFile.originFileObj as RcFile)
		},
	}

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{t('Label_Receipt')}</div>
		</div>
	)

	return (
		<Spin spinning={loading}>
			<Card
				ref={componentRef}
				style={{ width: '100%', marginTop: '30px' }}
				title={t('Label_Upload', { key: t('Label_Receipt') })}
				size='small'
				className='highlight'
				// 給予 tabIndex , 可使 <div/> focusable , 不可編輯就不賦值
				tabIndex={canEdit ? 0 : undefined}
			>
				<Form form={form} component={false} disabled={!canEdit}>
					<Form.Item
						name='fileList'
						valuePropName='fileList'
						getValueFromEvent={normFileForFormImageItem}
					>
						<Upload {...props}>{canEdit ? uploadButton : null}</Upload>
					</Form.Item>
				</Form>

				<Modal
					open={previewModal.visible}
					title={false}
					footer={null}
					onCancel={previewModal.onCancel}
				>
					<img alt={previewAlt} style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</Card>
		</Spin>
	)
}

export { ReceiptUploader }

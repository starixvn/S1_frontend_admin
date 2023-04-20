import { useTranslation } from 'react-i18next'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import {
	Card,
	Descriptions,
	Form,
	FormInstance,
	Image,
	Modal,
	Spin,
	Upload,
} from 'antd'
import moment from 'moment/moment'
import { PlusOutlined } from '@ant-design/icons'
import React, { useRef, useState } from 'react'
import { getBase64, normFileForFormImageItem } from 'common/utils/image'
import { findIndex } from 'lodash'
import { useModal, usePasteEffect } from 'common/hooks'
import { RcFile } from 'antd/es/upload'
import { multiEqual } from 'common/utils'
import { PermissionInterface } from 'type'
import {
	DepositReceiptCreateFromEnum,
	DepositStatusEnum,
	IDepositReceiptByTransIdData,
} from 'features/depositOperator/type'
import { timeFormat } from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'

interface IReceiptUploaderProps {
	loading: boolean
	form: FormInstance
	depositReceiptByTransIdList: IDepositReceiptByTransIdData[]
	depositReceiptCreateFromEnum: IEnumTypeData[]
	uploadReceiptPermission?: PermissionInterface
	deleteReceiptPermission?: PermissionInterface
	status: DepositStatusEnum
	timeZoneUtcOffset: number
	onUploadImage: (imageBase64: string) => void
	onDeleteImage: (number: number) => void
}

const ReceiptUploader = ({
	loading,
	form,
	depositReceiptByTransIdList,
	depositReceiptCreateFromEnum,
	status,
	timeZoneUtcOffset,
	uploadReceiptPermission,
	deleteReceiptPermission,
	onUploadImage,
	onDeleteImage,
}: IReceiptUploaderProps) => {
	const { t } = useTranslation()
	// 判斷當前狀態能否使用
	const canEdit =
		multiEqual(status, [DepositStatusEnum.Pending, DepositStatusEnum.OnHold]) &&
		uploadReceiptPermission?.canUse
	const componentRef = useRef(null)
	const formFileList = Form.useWatch('fileList', form)
	// previewState
	const previewModal = useModal()
	const [previewImage, setPreviewImage] = useState('')
	const [previewAlt, setPreviewAlt] = useState('')
	const [previewText, setPreviewText] = useState('')

	// Paste Upload 綁定
	usePasteEffect(async (result, kind) => {
		if (kind === 'file' && canEdit) {
			const base64Image = await getBase64(result as RcFile)
			onUploadImage(base64Image)
		}
	}, componentRef)

	const props: UploadProps = {
		fileList: formFileList || [],
		accept: 'image/*',
		listType: 'picture-card',
		onRemove: async file => {
			const { uid, name } = file
			const deleteNum = depositReceiptByTransIdList.find(
				({ receiptNo }) => receiptNo === Number(uid)
			)?.receiptNo
			const createFrom = name.split('&')[3]
			if (
				(multiEqual(status, [
					DepositStatusEnum.Approved,
					DepositStatusEnum.Canceled,
					DepositStatusEnum.Rejected,
				]) &&
					Number(createFrom) === DepositReceiptCreateFromEnum.BackendUser &&
					deleteReceiptPermission?.canUse) ||
				(!multiEqual(status, [
					DepositStatusEnum.Approved,
					DepositStatusEnum.Canceled,
					DepositStatusEnum.Rejected,
				]) &&
					Number(createFrom) === DepositReceiptCreateFromEnum.BackendUser)
			) {
				await onDeleteImage(Number(deleteNum))
			}
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
				file.name.split('&')[0] ||
					file.url!.substring(file.url!.lastIndexOf('/') + 1)
			)
			setPreviewText(file.name)
			previewModal.onOpen()
		},
		onChange: async ({ file, fileList: newFileList }) => {
			const index = findIndex(newFileList, item => item.uid === file.uid)
			// 複製一個 uploadFile , 和初始List 出來 , 以便調整 status 狀態
			const currentFile = newFileList[index]
			const image = await getBase64(currentFile.originFileObj as RcFile)
			await onUploadImage(image)
		},
	}

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{t('Label_Receipt')}</div>
		</div>
	)

	const footerText = () => {
		const creator = previewText.split('&')[1]
		const createTime = previewText.split('&')[2]
		const createFromNum = previewText.split('&')[3]
		const createFrom = depositReceiptCreateFromEnum?.find(
			({ value }) => value === Number(createFromNum)
		)?.name
		return (
			<Descriptions layout='horizontal' bordered size='small' column={10}>
				<Descriptions.Item
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
					label={t('Label_Creator')}
				>
					{createFrom ?? ''}
					{creator ? `(${creator})` : ''}
				</Descriptions.Item>
				<Descriptions.Item
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
					label={t('Label_CreateTime')}
				>
					{createTime
						? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Descriptions.Item>
			</Descriptions>
		)
	}

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
					footer={footerText()}
					onCancel={previewModal.onCancel}
					forceRender
				>
					<Image
						alt={previewAlt}
						style={{
							width: '100%',
						}}
						src={previewImage}
					/>
				</Modal>
			</Card>
		</Spin>
	)
}

export { ReceiptUploader }

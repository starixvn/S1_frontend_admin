import { FC, useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Typography, Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useTranslation } from 'react-i18next'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'

interface IAddPointBatchModal {
	loading: boolean
	downloading: boolean
	success: boolean
	visible: boolean
	onFinish: (file: UploadFile[]) => void
	onCancel: () => void
	onDownload: () => void
}

const xlsxMimeType =
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const AddPointBatchModal: FC<IAddPointBatchModal> = ({
	loading,
	visible,
	onFinish,
	onCancel,
	onDownload,
	downloading,
	success,
}) => {
	const { t } = useTranslation()
	const [fileList, setFileList] = useState<UploadFile[]>([])
	// UploadProps 定義的 FileList只能是 Array , 所以即使只放一個檔案這裡也要用陣列儲存
	const props: UploadProps = {
		onRemove: () => {
			setFileList([])
		},
		accept: xlsxMimeType,
		beforeUpload: file => {
			setFileList([file])
			return false
		},
		fileList,
	}
	useEffect(() => {
		if (!visible || success) {
			setFileList([])
		}
	}, [visible, success])
	return (
		<Modal
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_AddPointBatch')}</div>
			}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={() => {
				onFinish(fileList)
			}}
			width={350}
		>
			<Row align='middle' justify='center' gutter={[16, 8]}>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Typography.Text>
						{t('Label_Download', { key: t('Label_TemplateFile') })}
					</Typography.Text>
				</Col>
				<Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
					<Button
						type='primary'
						icon={<DownloadOutlined />}
						style={{ width: '100%' }}
						onClick={onDownload}
						loading={downloading}
					>
						{t('Label_TemplateFile')}
					</Button>
				</Col>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Typography.Text>
						{t('Label_Upload', { key: t('Label_File') })}
					</Typography.Text>
				</Col>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Button icon={<UploadOutlined />} block>
						<Upload {...props} maxCount={1}>
							{t('Label_SelectFile')}
						</Upload>
					</Button>
				</Col>
			</Row>
		</Modal>
	)
}

export { AddPointBatchModal }

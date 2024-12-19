import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { Button, Col, Modal, Row, Typography, Upload } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { IVipLevelData } from 'features/vipReview/type'
import BatchLogTable from 'features/vipReview/modal/BatchLogTable'
import { SiteIds } from '../../../app/constants/siteIds'

interface IVipLevelAssignBatchModalProps {
	siteId?: number
	loading: boolean
	success: boolean
	visible: boolean
	batchLog: IVipLevelData[]
	uploadSuccess: boolean
	onFinish: (file: UploadFile[]) => void
	onCancel: () => void
}

const VipLevelAssignBatchModal = ({
	siteId,
	loading,
	success,
	visible,
	batchLog,
	uploadSuccess,
	onFinish,
	onCancel,
}: IVipLevelAssignBatchModalProps) => {
	const { t } = useTranslation()
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const xlsxMimeType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
				<div style={{ textAlign: 'center' }}>
					{t('Label_VipLevelAssignBatch')}
				</div>
			}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={() => {
				onFinish(fileList)
			}}
			width='45%'
		>
			<Row align='middle' justify='center' gutter={[16, 8]}>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Typography.Text>
						{t('Label_Download', { key: t('Label_TemplateFile') })}
					</Typography.Text>
				</Col>
				<Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
					<Link
						to={
							siteId === SiteIds.OneTwoBet
								? '/exampleFile/ChangeVipTemplateFile-new.xlsx'
								: '/exampleFile/ChangeVipTemplateFile.xlsx'
						}
						download='ChangeVipTemplateFile.xlsx'
						target='_blank'
						style={{ color: 'white' }}
					>
						<Button
							style={{ maxWidth: '200px' }}
							type='primary'
							icon={<DownloadOutlined />}
							block
						>
							{t('Label_TemplateFile')}
						</Button>
					</Link>
				</Col>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Typography.Text>
						{t('Label_Upload', { key: t('Label_File') })}
					</Typography.Text>
				</Col>
				<Col style={{ textAlign: 'center' }}>
					<Button icon={<UploadOutlined />} block>
						<Upload {...props} maxCount={1}>
							{t('Label_SelectFile')}
						</Upload>
					</Button>
				</Col>
			</Row>
			{batchLog.length > 0 && !uploadSuccess && (
				<BatchLogTable batchLog={batchLog} />
			)}
		</Modal>
	)
}

export default VipLevelAssignBatchModal

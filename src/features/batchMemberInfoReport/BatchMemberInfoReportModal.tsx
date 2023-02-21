import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import {
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Typography,
	Upload,
	FormInstance,
} from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { IForm } from 'features/batchMemberInfoReport/type'

interface IBatchMemberInfoReportModalProps {
	form: FormInstance<IForm>
	loading: boolean
	visible: boolean
	onFinish: (file: UploadFile[]) => void
	onCancel: () => void
}

const BatchMemberInfoReportModal = ({
	form,
	loading,
	visible,
	onFinish,
	onCancel,
}: IBatchMemberInfoReportModalProps) => {
	const { t } = useTranslation()
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const xlsxMimeType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

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
		if (!visible) {
			setFileList([])
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_BatchMemberInfoReport')}
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
						to='/exampleFile/BatchMemberInfoTempFile.xlsx'
						download='BatchMemberInfoTempFile.xlsx'
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
				<Col span={12} offset={1}>
					<Form layout='vertical' form={form} size='middle'>
						<Form.Item
							name='memo'
							label={t('Label_Memo')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Memo'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Form>
				</Col>
				<Col span={12} offset={1}>
					<Typography.Text>
						{t('Label_Upload', { key: t('Label_File') })}
					</Typography.Text>
				</Col>
				<Col span={12} offset={1}>
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

export default BatchMemberInfoReportModal

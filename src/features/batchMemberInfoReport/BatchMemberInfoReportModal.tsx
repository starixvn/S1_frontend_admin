import { Link } from 'react-router-dom'
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
	FormInstance,
} from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { xlsxMimeType } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentForm'
import { IForm } from 'features/batchMemberInfoReport/type'
import { StyleUpload } from 'features/bankCardManagement/StyleUpload'

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
	const fileList = Form.useWatch('fileList', form)
	const props: UploadProps = {
		onRemove: () => {
			form.setFieldsValue({
				fileList: [],
			})
		},
		accept: xlsxMimeType,
		beforeUpload: file => {
			form.setFieldsValue({
				fileList: [file],
			})
			return false
		},
		fileList,
	}

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
			afterClose={() => {
				form.resetFields()
			}}
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
			</Row>
			<Form layout='vertical' size='middle' form={form}>
				<Row align='middle' justify='center' gutter={16}>
					<Col span={12}>
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
					</Col>
				</Row>
				<Row align='middle' justify='center' gutter={16}>
					<Col span={12}>
						<Typography.Text>
							{t('Label_Upload', { key: t('Label_File') })}
						</Typography.Text>

						<StyleUpload {...props}>
							<Button icon={<UploadOutlined />}>
								{t('Label_Upload', { key: t('Label_File') })}
							</Button>
						</StyleUpload>
						<Form.Item name='fileList' noStyle />
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default BatchMemberInfoReportModal

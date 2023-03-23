import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IAddForm } from 'features/leaderboardExtraPoint/type'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { StyleUpload } from 'features/bankCardManagement/StyleUpload'
import { Button, Col, Modal, Row, Typography, Form, FormInstance } from 'antd'
import { xlsxMimeType } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentForm'

interface ILeaderboardExtraPointBatchModalProps {
	loading: boolean
	visible: boolean
	form: FormInstance<IAddForm>
	onFinish: (file: UploadFile[]) => void
	onCancel: () => void
}

const LeaderboardExtraPointBatchModal = ({
	loading,
	visible,
	form,
	onFinish,
	onCancel,
}: ILeaderboardExtraPointBatchModalProps) => {
	const { t } = useTranslation()
	const fileList = Form.useWatch('fileList', form)
	// UploadProps 定義的 FileList只能是 Array , 所以即使只放一個檔案這裡也要用陣列儲存
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
				<div style={{ textAlign: 'center' }}>{t('Label_AddExtraPoint')}</div>
			}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			afterClose={() => {
				form.resetFields()
			}}
			onOk={() => onFinish(fileList)}
			width='45%'
		>
			<Form layout='vertical' size='middle' form={form}>
				<Row align='middle' justify='center' gutter={[16, 8]}>
					<Col span={24} style={{ textAlign: 'center' }}>
						<Typography.Text>
							{t('Label_Download', { key: t('Label_TemplateFile') })}
						</Typography.Text>
					</Col>
					<Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
						<Link
							to='/exampleFile/LeaderboardExtraPoint.xlsx'
							download='LeaderboardExtraPoint.xlsx'
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

export default LeaderboardExtraPointBatchModal

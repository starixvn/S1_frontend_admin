import { Button, Col, Form, FormInstance, Input, Modal, Row, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { IEditForm } from '../type'
import { FeedbackForm } from './FeedbackForm'

interface ISetFeedbackModalProps {
	open: boolean
	form: FormInstance<IEditForm>
	loading: boolean
	onCancel: () => void
	onFinish: () => void
}

const SetFeedbackModal = ({
	open,
	form,
	loading,
	onCancel,
	onFinish,
}: ISetFeedbackModalProps) => {
	const { t } = useTranslation()

	return (
		<Modal
			title={t('Label_EditFeedback')}
			open={open}
			onCancel={onCancel}
			onOk={() => onFinish()}
			width='65vw'
			confirmLoading={loading}
			// 這裡之所以又要 afterClose 又要destroyOnClose 原因在於這個 modal 內有很多 tinyEditor 的 tab , 關閉時直接 destroy掉整個元件避免一些無法預期的錯誤
			// 且為了正確觸發 form 的初始化，故每次關閉便移除整個元件
			afterClose={() => form.resetFields()}
			destroyOnClose
			footer={[
				<Button key='back' onClick={onCancel}>
					{t('Label_Cancel')}
				</Button>,
				<Button
					key='submit'
					type='primary'
					loading={loading}
					onClick={() => onFinish()}
				>
					{t('Label_Submit')}
				</Button>,
			]}
		>
			<Form form={form} layout='vertical'>
				<Row gutter={16} align='middle'>
					<Col lg={2} md={4} xs={24}>
						<Form.Item
							name='id'
							label={
								<Space align='center' size='middle'>
									{t('Label_Id')}
								</Space>
							}
						>
							<Input disabled />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16} align='middle'>
					<Col lg={6} md={8} xs={12}>
						<Form.Item
							name='userName'
							label={
								<Space align='center' size='middle'>
									{t('Label_MemberId')}
								</Space>
							}
						>
							<Input disabled />
						</Form.Item>
					</Col>
					<Col lg={10} md={10} xs={12}>
						<Form.Item
							name='contactInfo'
							label={
								<Space align='center' size='middle'>
									{t('Label_Contact')}
								</Space>
							}
						>
							<Input disabled />
						</Form.Item>
					</Col>
				</Row>
			</Form>

			{/* 訊息編輯 Tab */}
			<FeedbackForm form={form} />
		</Modal>
	)
}

export default SetFeedbackModal

import { Col, Form, FormInstance, Input, Modal, Row, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	IAddForm,
	ISetEventRestrictionArgs,
} from 'features/eventRestrictionList/type'

interface IAddEventRestrictionModalProps {
	form: FormInstance<IAddForm>
	loading: boolean
	visible: boolean
	onCancel: () => void
	handleCreateEventRestriction: (
		args: ISetEventRestrictionArgs
	) => Promise<void>
}

/**
 * AddEventRestrictionModal 創建資料彈窗
 * @param form 創建資料 form
 * @param loading 加載狀態
 * @param visible 是否開啟彈窗
 * @param onCancel 關閉彈窗函數
 * @param handleCreateEventRestriction 創建資料函數 */
const AddEventRestrictionModal = ({
	form,
	loading,
	visible,
	onCancel,
	handleCreateEventRestriction,
}: IAddEventRestrictionModalProps) => {
	/**  ======= hook ======= */

	const { t } = useTranslation()

	/**  ======= 對內函數 ======= */

	/**
	 * 創建資料，並關閉彈窗。
	 * 送出表單時，先驗證表單是否合規，如不合規阻擋並顯示對應的錯誤文字 */
	const onSubmit = async () => {
		const { userName, reason } = await form.validateFields()
		handleCreateEventRestriction({ userName, reason })
	}

	return (
		<Modal
			confirmLoading={loading}
			title={<div style={{ textAlign: 'center' }}>{t('Label_Add')}</div>}
			open={visible}
			onCancel={onCancel}
			forceRender
			afterClose={() => {
				form.resetFields(['userName', 'reason'])
			}}
			footer={[
				<Button
					key='submit'
					type='primary'
					onClick={onSubmit}
					loading={loading}
				>
					{t('Label_Save')}
				</Button>,
			]}
			width='30vw'
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					userName: '',
					reason: '',
				}}
			>
				<Row align='middle' justify='center' gutter={16}>
					<Col span={24}>
						<Form.Item
							name='userName'
							label={t('Label_UserName')}
							rules={[{ required: true, message: 'UserName is required' }]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' justify='center' gutter={16}>
					<Col span={24}>
						<Form.Item
							name='reason'
							label={t('Label_Reason')}
							rules={[{ required: true, message: 'Reason is required' }]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default AddEventRestrictionModal

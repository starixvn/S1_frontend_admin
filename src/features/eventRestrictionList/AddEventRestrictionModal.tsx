import { Col, Form, FormInstance, Input, Modal, Row, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
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

	/**  ======= useState ======= */

	/** 確認表單有沒有效 */
	const [isFormValid, setIsFormValid] = useState(false)
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
					onClick={() => {
						const { userName, reason } = form.getFieldsValue()
						const args = {
							userName,
							reason,
						}
						handleCreateEventRestriction(args)
						onCancel()
					}}
					// 確認表單都有填寫，如未填寫禁用按鈕
					disabled={!isFormValid}
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
				// 確認表單都有填寫
				onFieldsChange={() => {
					const { userName, reason } = form.getFieldsValue()
					if (userName && reason) {
						setIsFormValid(true)
					} else {
						setIsFormValid(false)
					}
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

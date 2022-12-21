import { Form, Modal, InputNumber, Switch, FormInstance } from 'antd'
import { useTranslation } from 'react-i18next'

interface ICreatePointLevelModalProps {
	loading: boolean
	form: FormInstance
	visible: boolean
	onCancel: () => void
	onFinish: () => void
}

const AddPointLevelFormModal = ({
	loading,
	form,
	visible,
	onCancel,
	onFinish,
}: ICreatePointLevelModalProps) => {
	const { t } = useTranslation()

	return (
		<Modal
			confirmLoading={loading}
			title={t('Label_AddPointLevel')}
			open={visible}
			onCancel={onCancel}
			forceRender
			afterClose={() => {
				// 直接使用 form.resetFields() 會清除到 newPointLevel 故只指定三個
				form.resetFields(['depositCnt', 'withdrawalCnt', 'isKyc'])
			}}
			onOk={onFinish}
		>
			<Form
				form={form}
				layout='vertical'
				wrapperCol={{ span: 24 }}
				initialValues={{
					pointLevel: null,
					depositCnt: null,
					withdrawalCnt: null,
					isKyc: false,
				}}
			>
				<Form.Item label={t('Label_PointLevel')} name='pointLevel'>
					<InputNumber min={0} style={{ width: '100%' }} disabled />
				</Form.Item>

				<Form.Item
					label={t('Label_DepositCount')}
					name='depositCnt'
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_DepositCount'),
							}),
						},
						{
							type: 'number',
							min: 0,
							message: '',
						},
					]}
				>
					<InputNumber
						type='number'
						controls={false}
						min={0}
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item
					label={t('Label_WithdrawalCount')}
					name='withdrawalCnt'
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_WithdrawalCount'),
							}),
						},
					]}
				>
					<InputNumber
						type='number'
						controls={false}
						min={0}
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item
					label={t('Label_isKyc')}
					style={{ margin: 0 }}
					valuePropName='checked'
					name='isKyc'
				>
					<Switch />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default AddPointLevelFormModal

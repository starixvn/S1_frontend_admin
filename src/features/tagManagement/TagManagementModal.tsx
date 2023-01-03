import { ColorResult } from 'react-color'
import { useTranslation } from 'react-i18next'
import { ColorPicker, DEFAULT_COLOR } from 'components'
import { Form, Modal, FormInstance, Input } from 'antd'
import { ICreateForm } from 'features/tagManagement/type'

interface IEditAndCreateTagModalProps {
	loading: boolean
	form: FormInstance<ICreateForm>
	visible: boolean
	color: string
	onChangeColor: (color: ColorResult) => void
	onChangeRawColor: (colorData: string) => void
	onCancel: () => void
	onFinish: () => void
}

const { TextArea } = Input

const TagManagementModal = ({
	loading,
	form,
	visible,
	color,
	onChangeColor,
	onChangeRawColor,
	onCancel,
	onFinish,
}: IEditAndCreateTagModalProps) => {
	const { t } = useTranslation()

	return (
		<Modal
			confirmLoading={loading}
			title={t('Label_AddTag')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			open={visible}
			onCancel={onCancel}
			afterClose={() => {
				form.resetFields(['tagName', 'description'])
				onChangeRawColor(DEFAULT_COLOR)
			}}
			onOk={onFinish}
		>
			<Form
				form={form}
				layout='vertical'
				wrapperCol={{ span: 24 }}
				initialValues={{
					tagName: null,
					description: null,
				}}
			>
				<Form.Item
					label={t('Label_TagName')}
					name='tagName'
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_TagName'),
							}),
						},
					]}
				>
					<Input allowClear style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item label={t('Label_TagColor')}>
					<ColorPicker color={color} onChangeComplete={onChangeColor} />
				</Form.Item>

				<Form.Item label={t('Label_Description')} name='description'>
					<TextArea showCount rows={4} maxLength={100} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default TagManagementModal

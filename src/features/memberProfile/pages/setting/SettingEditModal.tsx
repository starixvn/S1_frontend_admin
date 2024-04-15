import moment from 'moment'
import { DatePicker, Form, Input, Modal } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { ModalState } from 'common/hooks'
import { ISettingForm, SettingEditTypeEnum } from 'features/memberProfile/type'
import { includes } from 'lodash'
import { useTranslation } from 'react-i18next'

interface ISettingEditModalProps {
	isEditModalLoading: boolean
	isEditModalOpen: boolean
	editType: SettingEditTypeEnum | undefined
	editModal: ModalState
	form: FormInstance<ISettingForm>
	onEditModalSubmit: () => void
}

const SettingEditModal = ({
	isEditModalLoading,
	isEditModalOpen,
	editType,
	editModal: { onCancel },
	form,
	onEditModalSubmit,
}: ISettingEditModalProps) => {
	const { t } = useTranslation()

	// * 限制使用者不可填寫空白格
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const noSpacesAllowedValidator = (_: any, value: any) =>
		!includes(value, ' ')
			? Promise.resolve()
			: Promise.reject(new Error(t('Label_NoSpacesAllowed')))

	return (
		<Modal
			forceRender
			open={isEditModalOpen}
			onOk={async () => {
				form.validateFields().then(() => {
					onEditModalSubmit()
				})
			}}
			onCancel={onCancel}
			confirmLoading={isEditModalLoading}
			closable={false}
		>
			<Form
				form={form}
				initialValues={{
					fullName: '',
					email: '',
					phoneNo: '',
					birthDay: moment(),
					reason: '',
					address: {},
				}}
			>
				{editType === SettingEditTypeEnum.FullName && (
					<Form.Item
						name='fullName'
						label={t('Label_FullName')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_FullName'),
								}),
							},
						]}
					>
						<Input />
					</Form.Item>
				)}
				{editType === SettingEditTypeEnum.Email && (
					<Form.Item
						name='email'
						label={t('Label_Email')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Email'),
								}),
							},
							{ type: 'email', message: ' ' },
						]}
					>
						<Input />
					</Form.Item>
				)}
				{editType === SettingEditTypeEnum.PhoneNo && (
					<Form.Item
						name='phoneNo'
						label={t('Label_PhoneNumber')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_PhoneNumber'),
								}),
							},
							{
								pattern: /^\d+$/,
								message: t('Label_PhoneNo_Rule'),
							},
						]}
					>
						<Input type='tel' style={{ width: '100%' }} pattern='[0-9]' />
					</Form.Item>
				)}
				{editType === SettingEditTypeEnum.Birthday && (
					<Form.Item
						name='birthDay'
						label={t('Label_Birthday')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Birthday'),
								}),
							},
						]}
					>
						<DatePicker format='MM-DD-YYYY' style={{ width: '100%' }} />
					</Form.Item>
				)}
				{editType === SettingEditTypeEnum.Address && (
					<>
						<Form.Item
							labelCol={{ span: 5 }}
							name={['address', 'country']}
							label={t('Label_Country')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Country'),
									}),
								},
								{ max: 100, message: ' ' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							labelCol={{ span: 5 }}
							name={['address', 'state']}
							label={t('Label_State')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_State'),
									}),
								},
								{ max: 100, message: ' ' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							labelCol={{ span: 5 }}
							name={['address', 'postCode']}
							label={t('Label_PostCode')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_PostCode'),
									}),
								},
								{ max: 100, message: ' ' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							labelCol={{ span: 5 }}
							name={['address', 'city']}
							label={t('Label_City')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_City'),
									}),
								},
								{ max: 100, message: ' ' },
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							labelCol={{ span: 5 }}
							name={['address', 'line1']}
							label={t('Label_Line1')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Line1'),
									}),
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							labelCol={{ span: 5 }}
							name={['address', 'line2']}
							label={t('Label_Line2')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Line2'),
									}),
								},
							]}
						>
							<Input />
						</Form.Item>
					</>
				)}
				{(editType === SettingEditTypeEnum.LockAccount ||
					editType === SettingEditTypeEnum.UnLockAccount ||
					editType === SettingEditTypeEnum.CloseAccount ||
					editType === SettingEditTypeEnum.KickOutUser) && (
					<Form.Item
						name='reason'
						label={t('Label_Reason')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Reason'),
								}),
							},
						]}
					>
						<Input />
					</Form.Item>
				)}
			</Form>
		</Modal>
	)
}

export default SettingEditModal

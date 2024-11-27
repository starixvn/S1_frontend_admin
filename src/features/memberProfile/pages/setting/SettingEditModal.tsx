import dayjs from 'dayjs'
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { ModalState, useAuth } from 'common/hooks'
import {
	ISettingForm,
	AccountStatusEnum,
	SettingEditTypeEnum,
	VerifyEnum,
} from 'features/memberProfile/type'

import { includes } from 'lodash'
import { useTranslation } from 'react-i18next'
import { suspendTypeList } from 'features/memberProfile/constants'
import { useEffect } from 'react'

interface ISettingEditModalProps {
	isEditModalLoading: boolean
	isVerificationInfoLoading: boolean
	isEditModalOpen: boolean
	editType: SettingEditTypeEnum | undefined
	editModal: ModalState
	form: FormInstance<ISettingForm>
	setVerifyState: (verifyEnum: number) => void
	verifyed: boolean
	onEditModalSubmit: () => void
}

const { Option } = Select

const SettingEditModal = ({
	isEditModalLoading,
	isVerificationInfoLoading,
	isEditModalOpen,
	editType,
	editModal: { onCancel },
	form,
	setVerifyState,
	verifyed,
	onEditModalSubmit,
}: ISettingEditModalProps) => {
	const { t } = useTranslation()
	const { actionPermissions: { readDetailPermission } = {} } = useAuth()

	// * 限制使用者不可填寫空白格
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const noSpacesAllowedValidator = (_: any, value: any) =>
		!includes(value, ' ')
			? Promise.resolve()
			: Promise.reject(new Error(t('Label_NoSpacesAllowed')))

	const isPhoneOrEmailEdit =
		editType === SettingEditTypeEnum.Email ||
		editType === SettingEditTypeEnum.PhoneNo

	const isEmailEdit = editType === SettingEditTypeEnum.Email

	// 驗證電話或郵件完畢後，將驗證完畢的資料填入，正在編輯的欄位
	useEffect(() => {
		if (editType === SettingEditTypeEnum.Email) {
			const verifyEmail = form.getFieldValue('verifyEmail')
			form.setFieldsValue({
				email: verifyEmail,
			})
		} else {
			const verifyPhoneNo = form.getFieldValue('verifyPhoneNo')
			form.setFieldsValue({
				phoneNo: verifyPhoneNo,
			})
		}
	}, [verifyed])

	return (
		<Modal
			forceRender
			open={isEditModalOpen}
			footer={
				// 沒有閱讀權限且必須是電話或信箱修改才顯示驗證按鈕
				!readDetailPermission && isPhoneOrEmailEdit
					? [
							<Button
								key='cancel'
								onClick={async () => {
									onCancel()
									setVerifyState(VerifyEnum.Verifying)
								}}
							>
								{t('Label_Cancel')}
							</Button>,
							<Button
								type='primary'
								disabled={verifyed}
								onClick={async () => {
									await form.validateFields(['verifyEmail'])
									form.validateFields().then(() => {
										onEditModalSubmit()
									})
								}}
							>
								{t(isEmailEdit ? 'Label_verifyEmail' : 'Label_verifyPhoneNo')}
							</Button>,
							<Button
								key='submit'
								type='primary'
								loading={isEditModalLoading}
								disabled={!verifyed || isVerificationInfoLoading}
								onClick={async () => {
									form.validateFields(['email'])
									onEditModalSubmit()
								}}
							>
								{t('Label_OK')}
							</Button>,
					  ]
					: [
							<Button key='cancel' onClick={onCancel}>
								{t('Label_Cancel')}
							</Button>,
							<Button
								key='submit'
								type='primary'
								disabled={isEditModalLoading}
								loading={isEditModalLoading}
								onClick={() => {
									form.validateFields().then(() => {
										onEditModalSubmit()
									})
								}}
							>
								{t('Label_OK')}
							</Button>,
					  ]
			}
			confirmLoading={isEditModalLoading}
			closable={false}
		>
			<Form
				form={form}
				initialValues={{
					fullName: '',
					email: '',
					phoneNo: '',
					birthDay: dayjs(),
					status: AccountStatusEnum.Suspend,
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
					<>
						<Form.Item
							name='email'
							label={t('Label_Email')}
							rules={
								verifyed
									? [
											{
												required: true,
												message: t('Label_Required', {
													key: t('Label_verifyEmail'),
												}),
											},
											{ type: 'email', message: ' ' },
									  ]
									: undefined
							}
						>
							<Input disabled={!verifyed} />
						</Form.Item>
						{!readDetailPermission && (
							<Form.Item
								label={t('Label_verifyEmail')}
								name='verifyEmail'
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_verifyEmail'),
										}),
									},
									{ type: 'email', message: ' ' },
								]}
								style={{ flex: 1 }}
							>
								<Input disabled={verifyed} />
							</Form.Item>
						)}
					</>
				)}
				{editType === SettingEditTypeEnum.PhoneNo && (
					<>
						<Form.Item
							name='phoneNo'
							label={t('Label_PhoneNumber')}
							rules={
								verifyed
									? [
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
									  ]
									: undefined
							}
						>
							<Input
								disabled={!verifyed}
								type='tel'
								style={{ width: '100%' }}
								pattern='[0-9]'
							/>
						</Form.Item>
						{!readDetailPermission && (
							<Form.Item
								label={t('Label_verifyPhoneNo')}
								name='verifyPhoneNo'
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
								style={{ flex: 1 }}
							>
								<Input disabled={verifyed} />
							</Form.Item>
						)}
					</>
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
				{editType === SettingEditTypeEnum.LockAccount && (
					<Form.Item
						name='status'
						label={t('Label_Action')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Suspend'),
								}),
							},
						]}
					>
						<Select placeholder={t('Label_Suspend')}>
							{suspendTypeList.map(({ value, displayName }) => (
								<Option key={value} value={value}>
									{t(displayName)}
								</Option>
							))}
						</Select>
					</Form.Item>
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

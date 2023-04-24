import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Modal, Input, Row, Col, Select } from 'antd'
import {
	IAddForm,
	IMemberTypeData,
} from 'features/memberAdministrationList/type'
import {
	UserTypeEnum,
	CurrencyToAreacode,
	AREA_CODE_OPTIONS,
} from 'features/memberAdministrationList/constants'
import { Currency } from 'common/enum/type'
import React from 'react'
import { LockOutlined } from '@ant-design/icons'

interface IMemberAdministrationModalProps {
	loading: boolean
	form: FormInstance<IAddForm>
	memberTypeEnums: IMemberTypeData[]
	currencyListBySite: Currency[]
	visible: boolean
	onCancel: () => void
	onFinish: () => void
}

const { Option } = Select

const MemberAdministrationModal = ({
	loading,
	form,
	memberTypeEnums,
	currencyListBySite,
	visible,
	onCancel,
	onFinish,
}: IMemberAdministrationModalProps) => {
	const { t } = useTranslation()

	const handleCurrency = (newCurrencyId: number) => {
		if (!CurrencyToAreacode[newCurrencyId]) return

		form.setFieldsValue({
			areaCode: AREA_CODE_OPTIONS[CurrencyToAreacode[newCurrencyId]]?.AreaCode,
		})
	}

	return (
		<Modal
			confirmLoading={loading}
			title={t('Label_RegisterMember')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			open={visible}
			onCancel={onCancel}
			afterClose={() => {
				form.resetFields([
					'userName',
					'userpwd',
					'memberType',
					'email',
					'currencyId',
					'areaCode',
					'phoneNo',
					'affCode',
				])
			}}
			onOk={onFinish}
		>
			<Form
				form={form}
				layout='vertical'
				wrapperCol={{ span: 24 }}
				initialValues={{
					memberType: UserTypeEnum.LiveStreaming,
					currencyId: null,
					areaCode: null,
				}}
			>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Form.Item
							label={t('Label_MemberId')}
							name='userName'
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
					</Col>
					<Col span={12}>
						<Form.Item
							label={t('Label_Password')}
							name='userpwd'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Password'),
									}),
								},
							]}
						>
							<Input.Password
								prefix={<LockOutlined className='site-form-item-icon' />}
								type='password'
								placeholder={t('Label_Password')}
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={t('Label_Email')}
							name='email'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Email'),
									}),
								},
								{
									type: 'email',
									message: t('Label_MailWrongFormat'),
								},
							]}
						>
							<Input allowClear style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='currencyId'
							label={t('Label_Currency')}
							rules={[{ required: true }]}
						>
							<Select
								onChange={handleCurrency}
								placeholder={t('Label_Select') + t('Label_Currency')}
							>
								{currencyListBySite?.map(({ currencyId, isoCode }) => (
									<Option key={currencyId} value={currencyId}>
										{isoCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='memberType'
							label={t('Label_MemberType')}
							rules={[{ required: true }]}
						>
							<Select placeholder={t('Label_Select') + t('Label_MemberType')}>
								{memberTypeEnums?.map(({ value, name }) => (
									<Option key={value} value={value}>
										{name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='areaCode'
							label={t('Label_AccountStatus')}
							rules={[{ required: true }]}
						>
							<Select
								showSearch
								allowClear
								filterOption={(input, option) => {
									const isIncludes: boolean = (
										option!.children as unknown as string
									)
										.toLowerCase()
										.includes(input.toLowerCase())

									return isIncludes
								}}
								placeholder={t('Label_Select') + t('Label_CountryCode')}
							>
								{Object.values(AREA_CODE_OPTIONS)?.map(({ AreaCode, Name }) => (
									<Option key={AreaCode} value={AreaCode}>
										{` ${AreaCode} ${Name} `}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={t('Label_PhoneNumber')}
							name='phoneNo'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_PhoneNumber'),
									}),
								},
							]}
						>
							<Input allowClear style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label={t('Label_AffiliateId')} name='affCode'>
							<Input allowClear style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default MemberAdministrationModal

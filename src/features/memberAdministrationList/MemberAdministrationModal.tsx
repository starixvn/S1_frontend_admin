import { filter, isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Currency } from 'common/enum/type'
import { Form, FormInstance, Modal, Input, Row, Col, Select } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import {
	IAddForm,
	IMemberTypeData,
} from 'features/memberAdministrationList/type'
import {
	CURRENCY_TO_AREA_CODE,
	AREA_CODE_OPTIONS,
	LIMIT_COUNTRY_NUM,
} from 'app/constants/areaCode'
import { InputNumber } from 'components'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'

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
		// 有可能會有沒對應到的情況 ex: USD THUSD
		if (!CURRENCY_TO_AREA_CODE[newCurrencyId]) {
			form.resetFields(['areaCode'])
		}

		form.setFieldsValue({
			areaCode:
				AREA_CODE_OPTIONS[CURRENCY_TO_AREA_CODE[newCurrencyId]]?.AreaCode,
			phoneNo: undefined,
		})
	}

	return (
		<Modal
			confirmLoading={loading}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_RegisterMember')}</div>
			}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			open={visible}
			onCancel={onCancel}
			onOk={onFinish}
			afterClose={() => {
				form.resetFields()
			}}
			destroyOnClose
		>
			<Form form={form} layout='vertical' wrapperCol={{ span: 24 }}>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Form.Item
							label={t('Label_MemberId')}
							name='userName'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_UserName'),
									}),
								},
								{
									pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,18}$/,
									message: t('Label_UserNameLimit'),
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
								{
									pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,15}$/,
									message: t('Label_PasswordLengthLimit'),
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
							label={t('Label_FullName')}
							name='realName'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_FullName'),
									}),
								},
								{
									pattern: /^[^：:＊*，,。．；;]+$/,
									message: t('Label_FullNameLimit'),
								},
							]}
						>
							<Input allowClear style={{ width: '100%' }} />
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
							<Select
								placeholder={t('Label_Select') + t('Label_MemberType')}
								allowClear
							>
								{/* Affiliate Type 只用於搜尋 故在註冊時排除 */}
								{filter(
									memberTypeEnums,
									memberType => memberType.value !== UserTypeEnum.Affiliate
								)?.map(({ value, name }) => (
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
								{
									validator: () => {
										const { areaCode, phoneNo } = form.getFieldsValue()
										// USD KHUSD 目前沒有驗證
										const phoneLengthRegx =
											/^\+60[0-9]{9,10}$|\+62[0-9]{10,13}$|\+86[0-9]{10,11}$|\+91[0-9]{10}$|\+66[0-9]{9}$|\+880[0-9]{10}$/

										// 因這裡後台不做跟前台一樣的選完 currency 才出現 phone Number
										// 所以會先判斷是否有選 account status 才能判斷每個國家的電話長度
										if (isUndefined(areaCode)) {
											return Promise.reject(
												new Error(t('Label_AccountStatusMustSelected'))
											)
										}
										// USD KHUSD 目前沒有對應到 先暫不驗證
										if (!LIMIT_COUNTRY_NUM[areaCode]) {
											return Promise.resolve()
										}
										const limitRange = LIMIT_COUNTRY_NUM[areaCode]
										// 確認是否介於特定長度
										return phoneLengthRegx.test(areaCode + String(phoneNo))
											? Promise.resolve()
											: Promise.reject(
													new Error(
														t('Label_PhoneNumberErrorTip', {
															digitalArea: limitRange,
														})
													)
											  )
									},
								},
							]}
						>
							<InputNumber style={{ width: '100%' }} />
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

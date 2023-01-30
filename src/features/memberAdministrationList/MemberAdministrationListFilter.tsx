import React from 'react'
import TimeZoneSelect from 'components/TimeZoneSelect'
import {
	Button,
	Checkbox,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import {
	IDENTITY_ENUM_OPTIONS,
	IOVATION_LEVEL_ENUM_OPTIONS,
	SHIELD_LEVEL_ENUM_OPTIONS,
	STATUS_ENUM_OPTIONS,
	DATE_TYPE_ENUM_OPTIONS,
	USER_TYPE_ENUM_OPTIONS,
	StatueEnum,
	IdentityEnum,
	IovationLevelEnum,
	ShieldLevelEnum,
	DateTypeEnum,
	UserTypeEnum,
} from './constants'
import { IForm, ITagData, IVipLevelData } from './type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IMemberAdministrationListFilterProps {
	loading: boolean
	form: FormInstance<IForm>
	timeZoneUtcOffset?: number
	currencyListBySite: Currency[]
	allTagEnums: ITagData[]
	vipLevelEnums: IVipLevelData[]
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void
}
const MemberAdministrationListFilter = ({
	loading,
	form,
	timeZoneUtcOffset,
	currencyListBySite,
	allTagEnums,
	vipLevelEnums,
	onTimeZoneChange,
	onSearch,
}: IMemberAdministrationListFilterProps) => {
	const { t } = useTranslation()
	const dateType = Form.useWatch('dateType', form)

	const currencySelector = () => {
		const handleChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyListBySite?.map(({ currencyId }) => currencyId),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds,
				})
			}
		}
		return (
			<Form.Item name='currencyIds' label={t('Label_Currency')}>
				<MultipleSelect
					onChange={handleChangeCurrency}
					placeholder={t('Label_Select') + t('Label_Currency')}
				>
					{(currencyListBySite?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{currencyListBySite?.map(({ currencyId, isoCode }) => (
						<Option key={currencyId} value={currencyId}>
							{isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const statusSelector = () => {
		const handleChangeStatus = (newStatuses: number[]) => {
			if (newStatuses.includes(StatueEnum.All)) {
				form.setFieldsValue({
					statuses: STATUS_ENUM_OPTIONS?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					statuses: newStatuses,
				})
			}
		}

		return (
			<Form.Item name='statuses' label={t('Label_Status')}>
				<MultipleSelect
					onChange={handleChangeStatus}
					placeholder={t('Label_Select') + t('Label_Status')}
				>
					<Option value={StatueEnum.All}>{t('Label_SelectAll')}</Option>

					{STATUS_ENUM_OPTIONS?.map(({ value, displayKey }) => (
						<Option key={value} value={value}>
							{t(displayKey)}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const tagsSelector = () => {
		const handleChangeTags = (newTags: number[]) => {
			if (newTags.includes(0)) {
				form.setFieldsValue({
					tags: allTagEnums?.map(({ id }) => id),
				})
			} else {
				form.setFieldsValue({
					tags: newTags,
				})
			}
		}
		return (
			<>
				<Form.Item
					name='tags'
					label={t('Label_Tags')}
					style={{ width: '100%' }}
				>
					<MultipleSelect
						onChange={handleChangeTags}
						placeholder={t('Label_Select') + t('Label_Tags')}
					>
						{(allTagEnums?.length as number) > 1 && (
							<Option value={0}>{t('Label_SelectAll')}</Option>
						)}

						{allTagEnums?.map(({ id, tagName }) => (
							<Option key={id} value={id}>
								{tagName}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
				<Form.Item
					initialValue={false}
					name='excludeTag'
					valuePropName='checked'
					style={{
						position: 'absolute',
						right: '0',
						top: '-5px',
					}}
				>
					<Checkbox>{t('Label_Exclude')}</Checkbox>
				</Form.Item>
			</>
		)
	}

	const vipLevelSelector = () => {
		const handleChangeVipLevel = (newVipLevels: number[]) => {
			if (newVipLevels.includes(0)) {
				form.setFieldsValue({
					vipLevel: vipLevelEnums?.map(({ level }) => level),
				})
			} else {
				form.setFieldsValue({
					vipLevel: newVipLevels,
				})
			}
		}
		return (
			<Form.Item name='vipLevel' label={t('Label_VipLevel')}>
				<MultipleSelect
					onChange={handleChangeVipLevel}
					placeholder={t('Label_Select') + t('Label_VipLevel')}
				>
					{(vipLevelEnums?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{vipLevelEnums?.map(({ level, levelName }) => (
						<Option key={level} value={level}>
							{levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						initialValues={{
							currencyIds: currencyListBySite.map(
								({ currencyId }) => currencyId
							),
							statuses: STATUS_ENUM_OPTIONS?.map(({ value }) => value),
							identity: IdentityEnum.All,
							userName: null,
							tpUserName: null,
							affiliateName: null,
							loginIp: null,
							email: null,
							phoneNo: null,
							accountName: null,
							bankAccountNumber: null,
							affiliateCode: null,
							tags: [],
							vipLevel: [],
							transId: null,
							shieldLevel: ShieldLevelEnum.All,
							iovationLevel: IovationLevelEnum.All,
							dateType: DateTypeEnum.All,
							exportTransferWallet: 0,
							userType: UserTypeEnum.All,
							deviceId: null,
						}}
						onFinish={() => onSearch({})}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='dateType' label={t('Label_DateType')}>
									<Select placeholder={t('Label_Select') + t('Label_DateType')}>
										{DATE_TYPE_ENUM_OPTIONS?.map(({ value, displayKey }) => (
											<Option key={value} value={value}>
												{t(displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={12} md={24} xs={24}>
								<Form.Item label={t('Label_DateRange')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										<Form.Item
											noStyle
											name='dateRange'
											initialValue={MOMENT_DATE_RANGES.Today}
											rules={[
												{
													required: true,
													message: t('Label_DateRangeRequire'),
												},
											]}
										>
											<RangePicker
												disabled={dateType === DateTypeEnum.All}
												style={{ width: '100%' }}
												showTime
												ranges={MOMENT_RANGE_PICKER_RANGES([
													'Today',
													'Last 7 Day',
													'This Month',
												])}
											/>
										</Form.Item>
										<div>
											<TimeZoneSelect
												value={timeZoneUtcOffset}
												onChange={onTimeZoneChange}
											/>
										</div>
									</Input.Group>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{statusSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='tpUserName' label={t('Label_SabaId')}>
									<Input allowClear placeholder={t('Label_SabaId')} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='affiliateName'
									label={t('Label_AffiliateName')}
								>
									<Input allowClear placeholder={t('Label_AffiliateName')} />
								</Form.Item>
							</Col>
						</Row>

						<Collapse accordion ghost>
							{/* 
							// * forceRender 強制渲染元件，而不是點擊打開後才延遲渲染，以防止 Form.Item 拿不到 key
							*/}
							<Panel header={t('Label_AdvancedSearch')} key='1' forceRender>
								<Row align='middle' gutter={16}>
									<Col lg={6} md={12} xs={12}>
										<Form.Item name='identity' label={t('Label_Identity')}>
											<Select
												placeholder={t('Label_Select') + t('Label_Identity')}
											>
												{IDENTITY_ENUM_OPTIONS?.map(({ value, displayKey }) => (
													<Option key={value} value={value}>
														{t(displayKey)}
													</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item name='loginIp' label={t('Label_LoginIp')}>
											<Input allowClear placeholder={t('Label_LoginIp')} />
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item
											name='email'
											label={t('Label_Email')}
											rules={[
												{
													type: 'email',
													message: ' ',
												},
											]}
										>
											<Input
												type='email'
												allowClear
												placeholder={t('Label_Email')}
											/>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item name='phoneNo' label={t('Label_PhoneNo')}>
											<Input allowClear placeholder={t('Label_PhoneNo')} />
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item name='accountName' label={t('Label_FullName')}>
											<Input allowClear placeholder={t('Label_FullName')} />
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item
											name='bankAccountNumber'
											label={t('Label_BankAccountNumber')}
										>
											<Input
												allowClear
												placeholder={t('Label_BankAccountNumber')}
											/>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item
											name='affiliateCode'
											label={t('Label_SuperiorAffiliateCode')}
										>
											<Input
												allowClear
												placeholder={t('Label_SuperiorAffiliateCode')}
											/>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										{tagsSelector()}
									</Col>
									<Col lg={6} md={12} xs={12}>
										{vipLevelSelector()}
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item name='transId' label={t('Label_TransactionId')}>
											<Input
												allowClear
												placeholder={t('Label_TransactionId')}
											/>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item
											name='shieldLevel'
											label={t('Label_ShieldLevel')}
										>
											<Select
												placeholder={t('Label_Select') + t('Label_ShieldLevel')}
											>
												{SHIELD_LEVEL_ENUM_OPTIONS?.map(
													({ value, displayKey }) => (
														<Option key={value} value={value}>
															{t(displayKey)}
														</Option>
													)
												)}
											</Select>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item
											name='iovationLevel'
											label={t('Label_IovationStatus')}
										>
											<Select
												placeholder={
													t('Label_Select') + t('Label_IovationStatus')
												}
											>
												<Option value={IovationLevelEnum.All}>
													{t('Label_SelectAll')}
												</Option>
												{/* // * IOVATION 為做客戶分析的第三方 */}
												{IOVATION_LEVEL_ENUM_OPTIONS?.map(({ value, name }) => (
													<Option key={value} value={value}>
														{name}
													</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item name='userType' label={t('Label_MemberType')}>
											<Select
												placeholder={t('Label_Select') + t('Label_MemberType')}
											>
												{USER_TYPE_ENUM_OPTIONS?.map(
													({ value, displayKey }) => (
														<Option key={value} value={value}>
															{t(displayKey)}
														</Option>
													)
												)}
											</Select>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item
											name='exportTransferWallet'
											label={t('Label_ExportTransferWallet')}
										>
											<Select
												placeholder={
													t('Label_Select') + t('Label_ExportTransferWallet')
												}
											>
												<Option value={1}>True</Option>
												<Option value={0}>False</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col lg={6} md={12} xs={12}>
										<Form.Item name='deviceId' label={t('Label_DeviceId')}>
											<Input allowClear placeholder={t('Label_DeviceId')} />
										</Form.Item>
									</Col>
								</Row>
							</Panel>
						</Collapse>

						<br />
						<Row justify='end' align='middle'>
							<Col>
								<Button
									loading={loading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
								>
									{t('Label_Search')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default MemberAdministrationListFilter

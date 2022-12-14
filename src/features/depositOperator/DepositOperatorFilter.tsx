import React from 'react'
import moment from 'moment'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
} from 'antd'
import { MOMENT_RANGE_PICKER_RANGES } from 'app/constants/moment'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import {
	IBankCodeData,
	ICalCodeData,
	IVipLevelEnumData,
} from 'common/service/baseDataApi/type'
import { Currency } from 'common/enum/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { onEnumApiMultipleSelectChange } from 'common/utils'
import { IGetPayEnumData } from 'common/service/allDataApi'
import { IForm } from 'features/depositOperator/type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

// * 這頁的初始時間區間為 今日 ~ D+2
const initialDateRange = [
	moment().startOf('day'),
	moment().add(2, 'd').endOf('day'),
]

interface IDepositOperatorFilterProps {
	form: FormInstance<IForm>
	loading: boolean
	enumLoading: boolean
	currencyListBySite: Currency[]
	statusesEnum: IEnumTypeData[]
	payEnumList: IGetPayEnumData[]
	depositTypeEnum: IEnumTypeData[]
	bankCodeList: IBankCodeData[]
	vipLevelEnum: IVipLevelEnumData[]
	calCodeList: ICalCodeData[]
	timeZoneUtcOffset?: number
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const DepositOperatorFilter = ({
	form,
	loading,
	enumLoading,
	currencyListBySite,
	statusesEnum,
	depositTypeEnum,
	payEnumList,
	bankCodeList,
	vipLevelEnum,
	calCodeList,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
}: IDepositOperatorFilterProps) => {
	const { t } = useTranslation()

	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
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
					optionFilterProp='children'
					onChange={newCurrencyIds => {
						onChangeCurrency(newCurrencyIds)
						form.setFieldValue('selectBankCode', [])
					}}
					placeholder={t('Label_Select') + t('Label_Currency')}
				>
					{(currencyListBySite?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{currencyListBySite?.map(item => (
						<Option key={item.currencyId} value={item.currencyId}>
							{item.isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const payIdsSelector = () => {
		const onChangePayIds = (newPayIds: number[]) => {
			if (newPayIds.includes(0)) {
				form.setFieldsValue({
					selectPayIds: payEnumList?.map(({ payId }) => payId),
				})
			} else {
				form.setFieldsValue({
					selectPayIds: newPayIds,
				})
			}
		}
		return (
			<Form.Item name='selectPayIds' label={t('Label_PaymentGateway')}>
				<MultipleSelect
					optionFilterProp='children'
					onChange={onChangePayIds}
					placeholder={t('Label_Select') + t('Label_PaymentGateway')}
				>
					{(payEnumList?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{payEnumList?.map(({ payId, payName }) => (
						<Option key={payId} value={payId}>
							{payName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const bankCodeSelector = () => {
		const onChangeBankCode = (newBankCode: string[]) => {
			if (newBankCode.includes('all')) {
				form.setFieldsValue({
					selectBankCode: bankCodeList?.map(({ sysId }) => sysId),
				})
			} else {
				form.setFieldsValue({
					selectBankCode: newBankCode,
				})
			}
		}
		return (
			<Form.Item name='selectBankCode' label={t('Label_BankCode')}>
				<MultipleSelect
					optionFilterProp='children'
					placeholder={t('Label_Select') + t('Label_BankCode')}
					onChange={onChangeBankCode}
				>
					{(bankCodeList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{bankCodeList?.map(({ sysId, bankName }) => (
						<Option key={sysId} value={sysId}>
							{bankName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const vipLevelSelector = () => {
		const onVipLevelChange = (newVipLevels: Array<number | string>) => {
			if (newVipLevels.includes('all')) {
				form.setFieldsValue({
					levelStatuses: vipLevelEnum?.map(({ level }) => level),
				})
			} else {
				form.setFieldsValue({
					levelStatuses: newVipLevels,
				})
			}
		}

		return (
			<Form.Item name='levelStatuses' label={t('Label_VipLevel')}>
				<MultipleSelect
					optionFilterProp='children'
					onChange={onVipLevelChange}
					placeholder={t('Label_Select') + t('Label_VipLevel')}
				>
					{(vipLevelEnum?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{vipLevelEnum?.map(({ level, levelName }) => (
						<Option key={level} value={level}>
							{levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const calCodeListSelector = () => {
		const onChangeCalCodeList = (newCalCodeList: number[]) => {
			if (newCalCodeList.includes(0)) {
				form.setFieldsValue({
					selectCalCode: calCodeList?.map(({ bankId }) => bankId),
				})
			} else {
				form.setFieldsValue({
					selectCalCode: newCalCodeList,
				})
			}
		}
		return (
			<Form.Item name='selectCalCode' label={t('Label_CalCode')}>
				<MultipleSelect
					optionFilterProp='children'
					placeholder={t('Label_Select') + t('Label_CalCode')}
					onChange={onChangeCalCodeList}
				>
					{(calCodeList?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{calCodeList?.map(({ bankId, calCodeName }) => (
						<Option key={bankId} value={bankId}>
							{calCodeName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Spin spinning={enumLoading}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1'>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							initialValues={{
								currencyIds: [],
								statuses: [],
								selectPayIds: [],
								selectBankCode: [],
								selectCalCode: [],
								depositTypes: [],
								userName: '',
								startAmount: null,
								endAmount: null,
								levelStatuses: [],
								agent: '',
								depositId: '',
							}}
							onFinish={() => onSearch({})}
						>
							<Row align='middle' gutter={16}>
								<Col lg={8} md={24} xs={24}>
									<Form.Item label={t('Label_DateRange')}>
										<Input.Group
											compact
											style={{ width: '100%', display: 'flex' }}
										>
											<Form.Item
												noStyle
												name='dateRange'
												initialValue={initialDateRange}
												rules={[
													{
														required: true,
														message: t('Label_DateRangeRequire'),
													},
												]}
											>
												<RangePicker
													clearIcon={false}
													style={{ width: '100%' }}
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
							</Row>

							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									{currencyIdsSelector()}
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item name='statuses' label={t('Label_Status')}>
										<MultipleSelect
											optionFilterProp='children'
											placeholder={t('Label_Select') + t('Label_Status')}
											onChange={newValues =>
												onEnumApiMultipleSelectChange(
													newValues,
													statusesEnum,
													form,
													'statuses'
												)
											}
										>
											{(statusesEnum?.length as number) > 1 && (
												<Option value='all'>{t('Label_SelectAll')}</Option>
											)}

											{statusesEnum?.map(item => (
												<Option key={item.value} value={item.value}>
													{item.name}
												</Option>
											))}
										</MultipleSelect>
									</Form.Item>
								</Col>

								<Col lg={6} md={12} xs={12}>
									{payIdsSelector()}
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item name='depositTypes' label={t('Label_DepositType')}>
										<MultipleSelect
											optionFilterProp='children'
											placeholder={t('Label_Select') + t('Label_DepositType')}
											onChange={newValues =>
												onEnumApiMultipleSelectChange(
													newValues,
													depositTypeEnum,
													form,
													'depositTypes'
												)
											}
										>
											{(depositTypeEnum?.length as number) > 1 && (
												<Option value='all'>{t('Label_SelectAll')}</Option>
											)}

											{depositTypeEnum?.map(item => (
												<Option key={item.value} value={item.value}>
													{item.name}
												</Option>
											))}
										</MultipleSelect>
									</Form.Item>
								</Col>

								<Col lg={6} md={12} xs={12}>
									{bankCodeSelector()}
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item name='userName' label={t('Label_MemberId')}>
										<Input allowClear />
									</Form.Item>
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item name='depositId' label={t('Label_DepositId')}>
										<Input allowClear />
									</Form.Item>
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item label={t('Label_Amount')}>
										<Input.Group
											compact
											style={{ width: '100%', display: 'flex' }}
										>
											<Form.Item noStyle name='startAmount'>
												<InputNumber
													controls={false}
													type='number'
													style={{ width: '45%', textAlign: 'center' }}
													placeholder={t('Label_Minimum')}
												/>
											</Form.Item>
											<Input
												style={{
													width: '10%',
													borderLeft: 0,
													borderRight: 0,
													pointerEvents: 'none',
													backgroundColor: '#fff',
												}}
												placeholder='~'
												disabled
											/>
											<Form.Item noStyle name='endAmount'>
												<InputNumber
													controls={false}
													type='number'
													style={{
														width: '45%',
														textAlign: 'center',
														borderLeftWidth: 0,
													}}
													placeholder={t('Label_Maximum')}
												/>
											</Form.Item>
										</Input.Group>
									</Form.Item>
								</Col>

								<Col lg={6} md={12} xs={12}>
									{vipLevelSelector()}
								</Col>

								<Col lg={6} md={12} xs={12}>
									<Form.Item name='agent' label={t('Label_Agent')}>
										<Input allowClear />
									</Form.Item>
								</Col>

								<Col lg={6} md={12} xs={12}>
									{calCodeListSelector()}
								</Col>
							</Row>
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
		</Spin>
	)
}

export default DepositOperatorFilter

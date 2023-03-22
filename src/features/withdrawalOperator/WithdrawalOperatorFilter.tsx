import {
	Button,
	Checkbox,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { MOMENT_RANGE_PICKER_RANGES } from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { IEnumTypeData } from 'common/service/enumApi'
import { SearchOutlined } from '@ant-design/icons'
import { MultipleSelect } from 'components/Select'
import { Currency } from 'common/enum/type'
import {
	IBankCodeData,
	ICalCodeData,
	IVipLevelEnumData,
} from 'common/service/baseDataApi/type'
import { IFilterForm } from 'features/withdrawalOperator/type'
import moment from 'moment/moment'
import { isEmpty } from 'lodash'
import { useQueryParams } from 'common/hooks'
import {
	DATE_TYPE_OPTIONS,
	DateTypeEnum,
} from 'features/withdrawalOperator/constants'
import React from 'react'

interface IWithdrawalOperatorFilterProps {
	isAllSite: boolean
	loading: boolean
	form: FormInstance<IFilterForm>
	timeZoneUtcOffset: number
	withdrawalMethodList: IEnumTypeData[]
	withdrawalStatusList: IEnumTypeData[]
	withdrawalTypeList: IEnumTypeData[]
	currencyListBySite: Currency[]
	vipLevelList: IVipLevelEnumData[]
	calCodeList: ICalCodeData[]
	bankCodeList: IBankCodeData[]
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

const { Panel } = Collapse
const { Option } = Select
const { RangePicker } = DatePicker

// * 這頁的初始時間區間為 D-2 ~ 今日
const initialDateRange = [
	moment().subtract(2, 'd').startOf('day'),
	moment().endOf('day'),
]

const WithdrawalOperatorFilter = ({
	isAllSite,
	loading,
	form,
	timeZoneUtcOffset,
	withdrawalStatusList,
	withdrawalMethodList,
	withdrawalTypeList,
	currencyListBySite,
	calCodeList,
	vipLevelList,
	bankCodeList,
	onSearch,
	onTimeZoneChange,
}: IWithdrawalOperatorFilterProps) => {
	const { t } = useTranslation()
	const [queryParams] = useQueryParams()

	const statusSelector = () => {
		const onChangeStatus = (newStatus: Array<number | string>) => {
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					statuses: withdrawalStatusList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					statuses: newStatus,
				})
			}
		}
		return (
			<Form.Item name='statuses' label={t('Label_Status')}>
				<MultipleSelect
					onChange={onChangeStatus}
					placeholder={t('Label_Select')}
				>
					{(withdrawalStatusList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{withdrawalStatusList?.map(({ name, value }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
			// reset 當前所選的 bankCode
			form.resetFields(['selectBankCode', 'selectCalCode'])
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyListBySite?.map(item => item.currencyId),
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
					disabled={isAllSite}
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
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

	const withdrawalTypeSelector = () => {
		const onChangeType = (newType: Array<number | string>) => {
			if (newType.includes('all')) {
				form.setFieldsValue({
					withdrawalTypes: withdrawalTypeList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					withdrawalTypes: newType,
				})
			}
		}
		return (
			<Form.Item name='withdrawalTypes' label={t('Label_Type')}>
				<MultipleSelect onChange={onChangeType} placeholder={t('Label_Select')}>
					{(withdrawalTypeList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{withdrawalTypeList?.map(({ name, value }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const vipLevelSelector = () => {
		const onChangeLevel = (newLevel: Array<number | string>) => {
			if (newLevel.includes('all')) {
				form.setFieldsValue({
					levelStatuses: vipLevelList?.map(({ level }) => level),
				})
			} else {
				form.setFieldsValue({
					levelStatuses: newLevel,
				})
			}
		}
		return (
			<Form.Item name='levelStatuses' label={t('Label_VipLevel')}>
				<MultipleSelect
					disabled={isAllSite}
					onChange={onChangeLevel}
					placeholder={t('Label_Select')}
				>
					{(vipLevelList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{vipLevelList?.map(({ levelName, level }) => (
						<Option key={level} value={level}>
							{levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const calCodeSelector = () => {
		const onChangeCalCode = (newCode: Array<number | string>) => {
			if (newCode.includes('all')) {
				form.setFieldsValue({
					selectCalCode: calCodeList?.map(({ bankId }) => bankId),
				})
			} else {
				form.setFieldsValue({
					selectCalCode: newCode,
				})
			}
		}
		return (
			<Form.Item name='selectCalCode' label={t('Label_CalCode')}>
				<MultipleSelect
					disabled={isAllSite}
					onChange={onChangeCalCode}
					placeholder={`${t('Label_Select')} ${t('Label_CalCode')}`}
				>
					{(calCodeList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
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

	const bankCodeSelector = () => {
		const onChangeBankCode = (newCode: Array<number | string>) => {
			form.resetFields(['selectCalCode'])
			if (newCode.includes('all')) {
				form.setFieldsValue({
					selectBankCode: bankCodeList?.map(({ sysId }) => sysId),
				})
			} else {
				form.setFieldsValue({
					selectBankCode: newCode,
				})
			}
		}
		return (
			<Form.Item name='selectBankCode' label={t('Label_BankCode')}>
				<MultipleSelect
					disabled={isAllSite}
					onChange={onChangeBankCode}
					placeholder={`${t('Label_Select')}  ${t('Label_BankCode')}`}
				>
					{(bankCodeList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{bankCodeList?.map(({ bankName, sysId }) => (
						<Option key={sysId} value={sysId}>
							{bankName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const defaultActiveKey = isEmpty(queryParams) ? 1 : 0

	return (
		<Collapse defaultActiveKey={defaultActiveKey}>
			<Panel header='' key='1' forceRender>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
						initialValues={{
							currencyIds: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
							agent: '',
							withdrawalId: '',
							userName: '',
							selectCalCode: [],
							selectBankCode: [],
							dateType: DateTypeEnum.CreateTime,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item name='dateType' label={t('Label_DateType')}>
									<Select placeholder='select'>
										{DATE_TYPE_OPTIONS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
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

							<Col>
								<Form.Item
									name='isAllSite'
									label='Site'
									valuePropName='checked'
								>
									<Checkbox>{t('Label_AllSite')}</Checkbox>
								</Form.Item>
							</Col>
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{statusSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{withdrawalTypeSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='withdrawalMethod' label={t('Label_Method')}>
									<Select disabled={isAllSite} placeholder={t('Label_Select')}>
										{withdrawalMethodList?.map(({ name, value }) => (
											<Option key={value} value={value}>
												{name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{vipLevelSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input disabled={isAllSite} allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='withdrawalId' label={t('Label_WithdrawalId')}>
									<Input disabled={isAllSite} allowClear />
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
												disabled={isAllSite}
												controls={false}
												type='number'
												style={{ width: '45%', textAlign: 'center' }}
												placeholder='Minimum'
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
												disabled={isAllSite}
												controls={false}
												type='number'
												style={{
													width: '45%',
													textAlign: 'center',
													borderLeftWidth: 0,
												}}
												placeholder='Maximum'
											/>
										</Form.Item>
									</Input.Group>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='agent' label={t('Label_Agent')}>
									<Input disabled={isAllSite} allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{calCodeSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{bankCodeSelector()}
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
	)
}

export { WithdrawalOperatorFilter }

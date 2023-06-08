import { useTranslation } from 'react-i18next'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import { reject } from 'lodash'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import { adjustmentTypeList } from 'features/paymentAdjustment/constants'
import { IFilterForm } from 'features/paymentAdjustment/type'
import { IMemberTypeData } from 'features/memberAdministrationList/type'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'

interface IPaymentAdjustmentFilterProps {
	loading: boolean
	form: FormInstance<IFilterForm>
	timeZoneUtcOffset: number
	memberTypeEnums: IMemberTypeData[]
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
	currencyListBySite: Currency[]
}

const { RangePicker } = DatePicker
const { Panel } = Collapse
const { Option } = Select

const PaymentAdjustmentFilter = ({
	loading,
	form,
	timeZoneUtcOffset,
	memberTypeEnums,
	onSearch,
	onTimeZoneChange,
	currencyListBySite,
}: IPaymentAdjustmentFilterProps) => {
	const { t } = useTranslation()

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

	const adjustmentTypeSelector = () => {
		const handleChangeAdjustmentType = (newTypes: number[]) => {
			if (newTypes.includes(0)) {
				form.setFieldsValue({
					adjustTypes: adjustmentTypeList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					adjustTypes: newTypes,
				})
			}
		}
		return (
			<Form.Item name='adjustTypes' label={t('Label_Type')}>
				<MultipleSelect
					onChange={handleChangeAdjustmentType}
					placeholder={t('Label_Select') + t('Label_Type')}
				>
					{(adjustmentTypeList?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{adjustmentTypeList?.map(({ value, displayName }) => (
						<Option key={value} value={value}>
							{t(displayName)}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const memberTypeSelector = () => {
		const handleChangeMemberType = (newMemberTypes: UserTypeEnum[]) => {
			if (newMemberTypes.includes(0)) {
				form.setFieldsValue({
					memberTypes: memberTypeEnums?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					memberTypes: newMemberTypes,
				})
			}
		}
		return (
			<Form.Item name='memberTypes' label={t('Label_MemberType')}>
				<MultipleSelect
					onChange={handleChangeMemberType}
					placeholder={t('Label_Select') + t('Label_MemberType')}
				>
					{(memberTypeEnums?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{memberTypeEnums?.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
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
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
						initialValues={{
							currencyIds: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
							adjustTypes: adjustmentTypeList?.map(({ value }) => value),
							// 預設排除直播主
							memberTypes: reject(memberTypeEnums, [
								'value',
								UserTypeEnum.LiveStreaming,
							]).map(({ value }) => Number(value)),
						}}
					>
						<Row align='middle' gutter={16}>
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
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{adjustmentTypeSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='sabaId' label={t('Label_SabaId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_TransId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='depositId' label={t('Label_DepositId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{memberTypeSelector()}
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

export { PaymentAdjustmentFilter }

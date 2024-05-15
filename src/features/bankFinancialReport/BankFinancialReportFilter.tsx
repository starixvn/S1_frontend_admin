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
	Spin,
} from 'antd'
import { Currency } from 'common/enum/type'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { LayoutContent } from 'app/pages/layout'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import React from 'react'
import { IEnumTypeData } from 'common/service/enumApi'
import {
	IFilterForm,
	IGetFinancialAccountData,
} from 'features/bankFinancialReport/type'
import { SearchOutlined } from '@ant-design/icons'

interface IBankFinancialReportProps {
	form: FormInstance<IFilterForm>
	filterLoading: boolean
	loading: boolean
	timeZoneUtcOffset: number
	currencyListBySite: Currency[]
	transferChannelList: IEnumTypeData[]
	agentList: string[]
	financialAccountList: IGetFinancialAccountData[]
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const BankFinancialReportFilter = ({
	form,
	filterLoading,
	loading,
	timeZoneUtcOffset,
	currencyListBySite,
	transferChannelList,
	agentList,
	financialAccountList,
	onSearch,
	onTimeZoneChange,
}: IBankFinancialReportProps) => {
	const { t } = useTranslation()
	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
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
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyListBySite.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{currencyListBySite.map(item => (
						<Option key={item.currencyId} value={item.currencyId}>
							{item.isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const transferChannelSelector = () => {
		const handleChangeTransferChannel = (
			newChannel: Array<number | string>
		) => {
			if (newChannel.includes('all')) {
				form.setFieldsValue({
					channel: transferChannelList.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					channel: newChannel,
				})
			}
		}

		return (
			<Form.Item name='channel' label={t('Label_Channel')}>
				<MultipleSelect onChange={handleChangeTransferChannel}>
					{(transferChannelList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{transferChannelList.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const agentSelector = () => {
		const handleChangeAgent = (newAgents: Array<string>) => {
			if (newAgents.includes('all')) {
				form.setFieldsValue({
					agents: agentList.map(agent => agent),
				})
			} else {
				form.setFieldsValue({
					agents: newAgents,
				})
			}
		}

		return (
			<Form.Item name='agents' label={t('Label_Agent')}>
				<MultipleSelect
					onChange={handleChangeAgent}
					filterOption={(input, option) => {
						const isIncludes: boolean = (option!.children as unknown as string)
							.toLowerCase()
							.includes(input.toLowerCase())

						return isIncludes
					}}
				>
					{(agentList.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{agentList.map(agent => (
						<Option key={agent} value={agent}>
							{agent}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const financialAccountSelector = () => {
		const handleChangeFinancialAccount = (
			newAccounts: Array<number | string>
		) => {
			if (newAccounts.includes('all')) {
				form.setFieldsValue({
					financialAccountIds: financialAccountList.map(
						({ financialId }) => financialId
					),
				})
			} else {
				form.setFieldsValue({
					financialAccountIds: newAccounts,
				})
			}
		}

		return (
			<Form.Item name='financialAccountIds' label={t('Label_Account')}>
				<MultipleSelect
					onChange={handleChangeFinancialAccount}
					filterOption={(input, option) => {
						const isIncludes: boolean = (option!.children as unknown as string)
							.toLowerCase()
							.includes(input.toLowerCase())

						return isIncludes
					}}
				>
					{(financialAccountList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{financialAccountList?.map(({ financialId, displayName }) => (
						<Option key={financialId} value={financialId}>
							{displayName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}
	return (
		<Spin spinning={filterLoading}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1'>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={() => onSearch({})}
							initialValues={{
								currencyIds: currencyListBySite?.map(item => item.currencyId),
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={10} md={24} xs={24}>
									<Form.Item label={t('Label_DateRange')}>
										<Input.Group
											compact
											style={{ width: '100%', display: 'flex' }}
										>
											<Form.Item
												noStyle
												name='dateRange'
												initialValue={DATE_RANGES.Today}
												rules={[
													{
														required: true,
														message: t('Label_DateRangeRequire'),
													},
												]}
											>
												<RangePicker
													style={{ width: '100%' }}
													ranges={RANGE_PICKER_RANGES([
														'Today',
														'Yesterday',
														'Last Week',
														'This Month',
														'Last Month',
													])}
													showTime
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
							<Row gutter={16}>
								<Col lg={6} md={12} xs={12}>
									{currencyIdsSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{transferChannelSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{agentSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{financialAccountSelector()}
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

export { BankFinancialReportFilter }

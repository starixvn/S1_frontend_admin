import { LayoutContent } from 'app/pages/layout'
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
import { DATE_RANGES, RANGE_PICKER_PRESETS } from 'app/constants/ranges'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { Currency } from 'common/enum/type'
import {
	IGetReasonListData,
	IGetTransferAccountListData,
	IGetTransferTypeListData,
} from 'features/transferInfoManagement/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { MultipleSelect } from 'components/Select'

interface ITransferInfoManagementFilterProps {
	loading: boolean
	form: FormInstance
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
	timeZoneUtcOffset: number
	currencyListBySite: Currency[]
	transferTypeList: IGetTransferTypeListData[]
	reasonList: IGetReasonListData[]
	transferChannelList: IEnumTypeData[]
	agentList: string[]
	accountList: IGetTransferAccountListData[]
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const TransferInfoManagementFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
	currencyListBySite,
	transferTypeList,
	reasonList,
	transferChannelList,
	agentList,
	accountList,
}: ITransferInfoManagementFilterProps) => {
	const { t } = useTranslation()

	const transferTypesSelect = () => {
		const onChangeTypes = (newType: Array<number | string>) => {
			// 這裡有 status 是 0 , 故設為 all
			if (newType.includes('all')) {
				form.setFieldsValue({
					transferTypes: transferTypeList?.map(type => type.value),
				})
			} else {
				form.setFieldsValue({
					transferTypes: newType,
				})
			}
		}
		return (
			<Form.Item name='transferTypes' label={t('Label_TransferType')}>
				<MultipleSelect
					onChange={onChangeTypes}
					placeholder={t('Label_Select')}
				>
					{transferTypeList?.length > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{transferTypeList?.map(type => (
						<Option key={type.value} value={type.value}>
							{type.name}
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
					<Form form={form} layout='vertical' onFinish={() => onSearch({})}>
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
												showTime
												presets={RANGE_PICKER_PRESETS([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
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
						<Row gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromCurrencyId'
									label={`${t('Label_From')}  ${t('Label_Currency')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Currency')}
										allowClear
									>
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toCurrencyId'
									label={`${t('Label_To')}  ${t('Label_Currency')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Currency')}
										allowClear
									>
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{transferTypesSelect()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='reason' label={t('Label_Reason')}>
									<Select
										placeholder={t('Label_Select') + t('Label_Reason')}
										allowClear
									>
										{reasonList?.map(reason => (
											<Option key={reason.reasonId} value={reason.reasonId}>
												{reason.description}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromAgent'
									label={`${t('Label_From')}  ${t('Label_Agent')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Agent')}
										allowClear
										showSearch
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
										optionFilterProp='children'
									>
										{agentList?.map(agent => (
											<Option key={agent} value={agent}>
												{agent}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toAgent'
									label={`${t('Label_To')}  ${t('Label_Agent')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Agent')}
										allowClear
										showSearch
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
										optionFilterProp='children'
									>
										{agentList?.map(agent => (
											<Option key={agent} value={agent}>
												{agent}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromChannel'
									label={`${t('Label_From')}  ${t('Label_Channel')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Channel')}
										allowClear
									>
										{transferChannelList?.map(channel => (
											<Option key={channel.value} value={channel.value}>
												{channel.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toChannel'
									label={`${t('Label_To')}  ${t('Label_Channel')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Channel')}
										allowClear
									>
										{transferChannelList?.map(channel => (
											<Option key={channel.value} value={channel.value}>
												{channel.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromAccountNo'
									label={`${t('Label_From')}  ${t('Label_AccountNo')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_AccountNo')}
										allowClear
									>
										{accountList?.map(account => (
											<Option key={account.accountNo} value={account.accountNo}>
												{account.displayName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toAccountNo'
									label={`${t('Label_To')}  ${t('Label_AccountNo')}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_AccountNo')}
										allowClear
									>
										{accountList?.map(account => (
											<Option key={account.accountNo} value={account.accountNo}>
												{account.displayName}
											</Option>
										))}
									</Select>
								</Form.Item>
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

export { TransferInfoManagementFilter }

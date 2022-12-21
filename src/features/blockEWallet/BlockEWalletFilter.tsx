import { FC } from 'react'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	Input,
	Row,
	Select,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { FormInstance } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'
import { MultipleSelect } from 'components/Select'
import { selectCurrencyListBySite } from 'common/enum'
import { useAppSelector } from 'app/store'
import { BANK_BLOCK_STATUS } from './constants'
import { IEWalletType } from './type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface IBlockEWalletFilterProps {
	loading: boolean
	form: FormInstance
	eWalletTypes: IEWalletType[]
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onChangeCurrency: (newCurrencyIds: number[]) => void
	onChangeEWalletTypes: (newEWalletIds: number[]) => void
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
}

const BlockEWalletFilter: FC<IBlockEWalletFilterProps> = ({
	loading,
	form,
	eWalletTypes,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onChangeCurrency,
	onChangeEWalletTypes,
	onSearch,
}) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const initialCurrencyIds = currencyListBySite.map(
		currency => currency.currencyId
	)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							dateRange: MOMENT_DATE_RANGES.Today,
							currencyIds: initialCurrencyIds,
							blockStatus: BANK_BLOCK_STATUS[0].value,
							accountNum: '',
							userName: '',
							eWalletIds: [],
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
								<Form.Item name='currencyIds' label={t('Label_Currency')}>
									<MultipleSelect onChange={onChangeCurrency}>
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
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='eWalletIds' label={t('Label_EWalletName')}>
									<MultipleSelect onChange={onChangeEWalletTypes}>
										{(eWalletTypes?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}

										{eWalletTypes?.map(item => (
											<Option key={item.sysId} value={item.sysId}>
												{item.eWalletName}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='blockStatus' label={t('Label_BlockStatus')}>
									<Select placeholder='select'>
										{BANK_BLOCK_STATUS.map(option => (
											<Option key={option.value} value={option.value}>
												{t(option.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='accountNum' label={t('Label_AccountNum')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
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

export default BlockEWalletFilter

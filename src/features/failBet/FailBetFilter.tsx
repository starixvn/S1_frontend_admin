import moment from 'moment/moment'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { selectCurrencyListBySite } from 'common/enum'
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import { RangePickerProps } from 'antd/es/date-picker'
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
import { IGetTpIdData } from 'common/service/allDataApi'
import { IFilterForm } from 'features/failBet/type'

interface FailBetFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	tpIdList: IGetTpIdData[]
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
const { RangePicker } = DatePicker
const { Option } = Select

const FailBetFilter = ({
	form,
	loading,
	timeZoneUtcOffset,
	onTimeZoneChange,
	tpIdList,
	onSearch,
}: FailBetFilterProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: Array<number | string>) => {
			if (newCurrencyIds.includes('all')) {
				form.setFieldsValue({
					currencyIds: currencyListBySite?.map(({ currencyId }) => currencyId),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds as number[],
				})
			}
		}

		return (
			<Form.Item name='currencyIds' label={t('Label_Currency')}>
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyListBySite?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
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

	const tpIdSelector = () => {
		const onChangeTpId = (newTpIds: ('all' | number)[]) => {
			if (newTpIds.includes('all')) {
				form.setFieldsValue({
					tpIds: tpIdList?.map(({ id }) => id),
				})
			} else {
				form.setFieldsValue({
					tpIds: newTpIds as number[],
				})
			}
		}

		return (
			<Form.Item name='tpIds' label={t('Label_Vender')}>
				<MultipleSelect
					onChange={onChangeTpId}
					placeholder={t('Label_Select')}
					showSearch
					filterOption={(input, option) => {
						const isIncludes: boolean = (option!.children as unknown as string)
							.toLowerCase()
							.includes(input.toLowerCase())

						return isIncludes
					}}
				>
					{(tpIdList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{tpIdList?.map(({ id, tpName }) => (
						<Option key={id} value={id}>
							{tpName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const disabledDate: RangePickerProps['disabledDate'] = current => {
		return (
			current > moment().endOf('day') || current < moment().subtract(30, 'day')
		)
	}

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
							transId: '',
							userName: '',
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={12} md={12} xs={24}>
								<Form.Item label={t('Label_ActiveDate')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										<Form.Item
											noStyle
											name='dateRange'
											initialValue={DATE_RANGES.Today}
										>
											<RangePicker
												style={{ width: '100%' }}
												disabledDate={disabledDate}
												ranges={RANGE_PICKER_RANGES([
													'Today',
													'Yesterday',
													'Last Week',
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
								{tpIdSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_TransId')}>
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

export default FailBetFilter

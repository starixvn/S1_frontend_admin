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
import { MultipleSelect } from 'components/Select'
import { Currency } from 'common/enum/type'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { ILeaderBoardCategoryEnumData } from 'features/leaderboardExtraPoint/type'

interface ILeaderboardExtraPointFilterProps {
	loading: boolean
	form: FormInstance
	currencyListBySite: Currency[]
	timeZoneUtcOffset: number
	LeaderBoardCategoryList: ILeaderBoardCategoryEnumData[]
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
const { RangePicker } = DatePicker
const { Option } = Select

const LeaderboardExtraPointFilter = ({
	loading,
	form,
	currencyListBySite,
	timeZoneUtcOffset,
	LeaderBoardCategoryList,
	onTimeZoneChange,
	onSearch,
}: ILeaderboardExtraPointFilterProps) => {
	const { t } = useTranslation()

	const currencySelector = () => {
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

	const categoryIdsSelector = () => {
		const onChangeCategory = (newCategoryIds: number[]) => {
			if (newCategoryIds.includes(0)) {
				form.setFieldsValue({
					categoryIds: LeaderBoardCategoryList?.map(item => item.value),
				})
			} else {
				form.setFieldsValue({
					categoryIds: newCategoryIds,
				})
			}
		}
		return (
			<Form.Item name='categoryIds' label={t('Label_Currency')}>
				<MultipleSelect
					onChange={onChangeCategory}
					placeholder={t('Label_Select')}
				>
					{(LeaderBoardCategoryList?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{LeaderBoardCategoryList?.map(({ value, name }) => (
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
				<Spin spinning={loading}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={onSearch}
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
							<Row gutter={16} align='middle'>
								<Col lg={6} md={12} xs={12}>
									{currencySelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{categoryIdsSelector()}
								</Col>
							</Row>
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
				</Spin>
			</Panel>
		</Collapse>
	)
}

export default LeaderboardExtraPointFilter

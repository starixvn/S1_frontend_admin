import { useTranslation } from 'react-i18next'
import {
	Button,
	Col,
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
import moment from 'moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'
import { IGetPromotionCategoryData } from 'features/bonusManagement/type'

interface IBonusLogFilterProps {
	loading: boolean
	form: FormInstance
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
	timeZoneUtcOffset: number
	categoryList: IGetPromotionCategoryData[]
}

const { RangePicker } = DatePicker
const { Option } = Select

const BonusLogFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
	categoryList,
}: IBonusLogFilterProps) => {
	const { t } = useTranslation()

	return (
		<Form
			layout='vertical'
			size='middle'
			form={form}
			onFinish={() => onSearch({})}
		>
			<Row align='middle' gutter={20} style={{ marginTop: '5px' }}>
				<Col xs={24} md={24} lg={10}>
					<Form.Item label={t('Label_DateRange')}>
						<Input.Group compact style={{ width: '100%', display: 'flex' }}>
							<Form.Item
								noStyle
								name='dateRange'
								initialValue={MOMENT_DATE_RANGES['Last 7 Day']}
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
									onChange={newDateRange =>
										form.setFieldsValue({
											startDate: moment(newDateRange?.[0]),
											endDate: moment(newDateRange?.[1]),
										})
									}
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
				<Col xs={12} md={12} lg={6}>
					<Form.Item
						name='promoCategoryId'
						label={t('Label_PromotionCategory')}
					>
						<Select>
							{categoryList?.map(category => (
								<Option value={category.id} key={category.id}>
									{category.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col xs={12} md={12} lg={6}>
					<Form.Item name='refTransId' label={t('Label_RefTransId')}>
						<Input allowClear />
					</Form.Item>
				</Col>
			</Row>
			<Row justify='end' align='middle' style={{ marginBottom: '5px' }}>
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
	)
}

export { BonusLogFilter }

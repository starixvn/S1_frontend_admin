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
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { IEnumTypeData } from 'common/service/enumApi'
import { MultipleSelect } from 'components/Select'

interface FinancialFilterProps {
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
	typeList: IEnumTypeData[]
}
const { RangePicker } = DatePicker

const FinancialFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
	typeList,
}: FinancialFilterProps) => {
	const { t } = useTranslation()
	const { Option } = Select
	const typeSelector = () => {
		const onChangeType = (newType: Array<number | string>) => {
			if (newType.includes('all')) {
				form.setFieldsValue({
					type: typeList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					type: newType,
				})
			}
		}
		return (
			<MultipleSelect onChange={onChangeType}>
				{(typeList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{typeList.map(({ name, value }) => (
					<Option key={value} value={value}>
						{name}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	return (
		<Form layout='vertical' size='middle' form={form} onFinish={onSearch}>
			<Row align='middle' gutter={16}>
				<Col span={10}>
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
				<Col span={6}>
					<Form.Item
						name='type'
						label={t('Label_Type')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_Type'),
								}),
							},
						]}
					>
						{typeSelector()}
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item name='refTransId' label={' '}>
						<Input placeholder={t('Label_RefTransId')} />
					</Form.Item>
				</Col>
				<Col span={3}>
					<Form.Item label={' '}>
						<Button
							loading={loading}
							icon={<SearchOutlined />}
							htmlType='submit'
							type='primary'
						>
							{t('Label_Search')}
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export { FinancialFilter }

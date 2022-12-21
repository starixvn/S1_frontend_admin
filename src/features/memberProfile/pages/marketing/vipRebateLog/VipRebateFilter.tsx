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
import { useTranslation } from 'react-i18next'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'
import { IsPayoutEnum, isPayoutList } from 'features/memberProfile/constants'
import { MultipleSelect } from 'components/Select'

interface IVipRebateFilterProps {
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
}

const { RangePicker } = DatePicker
const { Option } = Select

const VipRebateFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
}: IVipRebateFilterProps) => {
	const { t } = useTranslation()

	const payoutSelector = () => {
		const onChangePayoutStatus = (newStatus: Array<number | string>) => {
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					payoutStatuses: isPayoutList?.map(item => item.value),
				})
			} else {
				form.setFieldsValue({
					payoutStatuses: newStatus,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangePayoutStatus}
				placeholder={t('Label_Select')}
			>
				{(isPayoutList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{isPayoutList?.map(item => (
					<Option key={Number(item.value)} value={item.value}>
						{t(item.displayName)}
					</Option>
				))}
			</MultipleSelect>
		)
	}
	return (
		<Form
			layout='vertical'
			size='middle'
			form={form}
			onFinish={() => onSearch({})}
			initialValues={{
				payoutStatuses: [IsPayoutEnum.true],
			}}
		>
			<Row align='middle' gutter={20}>
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
				<Col span={4}>
					<Form.Item label={t('Label_PayoutStatus')} name='payoutStatuses'>
						{payoutSelector()}
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

export { VipRebateFilter }

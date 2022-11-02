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
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'
import { IGetPromotionCategoryData } from 'features/bonusManagement/type'
import { MultipleSelect } from 'components/Select'
import { IBonusLogFilterForm } from 'features/memberProfile/type'

interface IBonusLogFilterProps {
	loading: boolean
	form: FormInstance<IBonusLogFilterForm>
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

	const promoCategorySelector = () => {
		const onChangeCategory = (newCategoryIds: Array<number | string>) => {
			if (newCategoryIds.includes('all')) {
				form.setFieldsValue({
					promoCategoryIds: categoryList?.map(item => item.id),
				})
			} else {
				form.setFieldsValue({
					promoCategoryIds: newCategoryIds,
				})
			}
		}

		return (
			<Form.Item name='promoCategoryIds' label={t('Label_PromotionCategory')}>
				<MultipleSelect
					onChange={onChangeCategory}
					placeholder={t('Label_Select')}
				>
					{(categoryList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{categoryList?.map(item => (
						<Option key={item.id} value={item.id}>
							{item.name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

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
					{promoCategorySelector()}
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

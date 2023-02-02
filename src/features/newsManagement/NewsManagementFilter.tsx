import {
	Col,
	Row,
	Form,
	Input,
	Button,
	Select,
	Collapse,
	DatePicker,
	FormInstance,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { IEnumTypeData } from 'common/service/enumApi'
import { dateFormat } from 'common/utils/format'
import { IFilterForm } from 'features/newsManagement/type'

interface INewsManagementFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	statusEnumList: IEnumTypeData[]
	timeZoneUtcOffset: number
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
}

const { Panel } = Collapse
const { Option } = Select
const { RangePicker } = DatePicker

const NewsManagementFilter = ({
	form,
	loading,
	statusEnumList,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
}: INewsManagementFilterProps) => {
	const { t } = useTranslation()

	const statusSelector = () => {
		const handleChangeStatus = (newStatuses: number[]) => {
			if (newStatuses.includes(2)) {
				form.setFieldsValue({
					status: statusEnumList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					status: newStatuses,
				})
			}
		}

		return (
			<Form.Item name='status' label={t('Label_Status')}>
				<MultipleSelect
					placeholder={t('Label_Select') + t('Label_Status')}
					onChange={handleChangeStatus}
				>
					{statusEnumList?.length > 1 && (
						<Option value={2}>{t('Label_SelectAll')}</Option>
					)}
					{statusEnumList?.map(({ name, value }) => (
						<Option key={name} value={value}>
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
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
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
												format={dateFormat}
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
							<Col lg={6} md={12} xs={12}>
								{statusSelector()}
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
			</Panel>
		</Collapse>
	)
}

export { NewsManagementFilter }

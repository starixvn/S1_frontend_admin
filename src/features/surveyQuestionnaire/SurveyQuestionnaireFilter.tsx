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
	Space,
	Spin,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { DATE_RANGES, RANGE_PICKER_PRESETS } from 'app/constants/ranges'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectEnumStatus } from 'common/enum'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { IFilterForm } from 'features/surveyQuestionnaire/type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface ISurveyQuestionnaireFilterProps {
	loading: boolean
	form: FormInstance<IFilterForm>
	timeZoneUtcOffset?: number
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

const SurveyQuestionnaireFilter = ({
	loading,
	form,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
}: ISurveyQuestionnaireFilterProps) => {
	const { t } = useTranslation()
	const enumStatus = useAppSelector(selectEnumStatus)
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const spinning = enumStatus === 'pending' || currencyListBySite === undefined
	return (
		<Spin spinning={spinning}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1'>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							initialValues={{
								currencyId: 0,
							}}
							onFinish={() => onSearch({})}
						>
							<Row align='middle' gutter={16}>
								<Col lg={9} md={12} xs={12}>
									<Form.Item label={t('Label_DateRange')}>
										<Space.Compact style={{ width: '100%', display: 'flex' }}>
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
										</Space.Compact>
									</Form.Item>
								</Col>
								<Col lg={4} md={6} xs={6}>
									<Form.Item name='currencyId' label={t('Label_Currency')}>
										<Select placeholder={t('Label_Select')}>
											<Option value={0}>{t('Label_SelectAll')}</Option>
											{currencyListBySite?.map(({ currencyId, isoCode }) => (
												<Option key={currencyId} value={currencyId}>
													{isoCode}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={4} md={6} xs={6}>
									<Form.Item name='userName' label={t('Label_MemberId')}>
										<Input allowClear />
									</Form.Item>
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
		</Spin>
	)
}

export default SurveyQuestionnaireFilter

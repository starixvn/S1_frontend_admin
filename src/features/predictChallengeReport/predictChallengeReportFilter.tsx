import { Currency } from 'common/enum/type'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import { MultipleSelect } from 'components/Select'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { DATE_RANGES, RANGE_PICKER_PRESETS } from 'app/constants/ranges'
import {
	Button,
	Col,
	Collapse,
	CollapseProps,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Space,
} from 'antd'
import type { IFilterForm } from './type'
import { PREDICT_STATUS_OPTIONS } from './constants'

interface INewReferralReportFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	currencyListBySite: Currency[]
	timeZoneUtcOffset?: number
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

const { RangePicker } = DatePicker
const { Option } = Select

const PredictChallengeReportFilter = ({
	form,
	loading,
	currencyListBySite,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
}: INewReferralReportFilterProps) => {
	const { t } = useTranslation()

	const currencySelector = () => {
		const handleChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyListBySite?.map(({ currencyId }) => currencyId),
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
					placeholder={t('Label_Select') + t('Label_Currency')}
					onChange={handleChangeCurrency}
				>
					{currencyListBySite?.length > 1 && (
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

	const predictStatusSelector = () => {
		const handleChangePredictStatus = (
			predictStatusValues: Array<number | string>
		) => {
			if (predictStatusValues.includes('all')) {
				form.setFieldsValue({
					predictStatusList: PREDICT_STATUS_OPTIONS.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					predictStatusList: predictStatusValues as number[],
				})
			}
		}

		return (
			<Form.Item name='predictStatusList' label={t('Label_Predict_Status')}>
				<MultipleSelect
					placeholder={t('Label_Select') + t('Label_Predict_Status')}
					onChange={handleChangePredictStatus}
				>
					<Option value='all'>{t('Label_SelectAll')}</Option>
					{PREDICT_STATUS_OPTIONS?.map(({ value, displayName }) => (
						<Option key={value} value={value}>
							{t(displayName)}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const collapseItems: CollapseProps['items'] = [
		{
			key: '1',
			label: '',
			children: (
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
						initialValues={{
							currencyIds: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
							predictStatusList: PREDICT_STATUS_OPTIONS.map(
								({ value }) => value
							),
							userName: null,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={12} md={24} xs={24}>
								<Form.Item label={t('Label_KickOff_Time')}>
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
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{predictStatusSelector()}
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
									type='primary'
									htmlType='submit'
									icon={<SearchOutlined />}
								>
									{t('Label_Search')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			),
		},
	]

	return <Collapse defaultActiveKey={1} items={collapseItems} />
}

export default PredictChallengeReportFilter

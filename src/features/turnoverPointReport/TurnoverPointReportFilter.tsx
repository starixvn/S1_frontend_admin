import { FC } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import {
	Col,
	Collapse,
	Form,
	Input,
	Row,
	DatePicker,
	FormInstance,
	Button,
	Select,
	Spin,
} from 'antd'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { LayoutContent } from 'app/pages/layout'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import { dateFormat } from 'common/utils/format'
import { IGetCategoryData } from 'features/betList/type'
import { IVipLevelEnumData } from 'common/service/baseDataApi/type'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface ITurnoverPointReportFilterProps {
	form: FormInstance
	loading: boolean
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
	currencyListBySite: Currency[]
	vipLevelsList: IVipLevelEnumData[]
	onTimeZoneChange: (newUtcOffset: number) => void
	categories: IGetCategoryData[]
}

const TurnoverPointReportFilter: FC<ITurnoverPointReportFilterProps> = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	currencyListBySite,
	vipLevelsList,
	onTimeZoneChange,
	categories,
}) => {
	const { t } = useTranslation()
	const vipLevelSelect = () => {
		const onChangeVipLevel = (newLevel: number[]) => {
			if (newLevel.includes(0)) {
				form.setFieldsValue({
					vipLevels: vipLevelsList?.map(level => level.level),
				})
			} else {
				form.setFieldsValue({
					vipLevels: newLevel,
				})
			}
		}
		return (
			<Form.Item name='vipLevels' label={t('Label_VipLevel')}>
				<MultipleSelect
					onChange={onChangeVipLevel}
					placeholder={t('Label_Select')}
				>
					{vipLevelsList?.length > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}
					{vipLevelsList?.map(vipLevel => (
						<Option key={vipLevel.level} value={vipLevel.level}>
							{vipLevel.levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const categorySelect = () => {
		const onChangeCategory = (newCategory: Array<number | string>) => {
			if (newCategory.includes('ALL')) {
				form.setFieldsValue({
					categories: categories?.map(category => category.categoryId),
				})
			} else {
				form.setFieldsValue({
					categories: newCategory,
				})
			}
		}
		return (
			<Form.Item name='categories' label={t('Label_Category')}>
				<MultipleSelect
					onChange={onChangeCategory}
					placeholder={t('Label_Select')}
				>
					{categories?.length > 1 && (
						<Option value='ALL'>{t('Label_SelectAll')}</Option>
					)}
					{categories?.map(category => (
						<Option key={category.categoryId} value={category.categoryId}>
							{category.categoryName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

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
		<Spin spinning={loading}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1'>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={() => onSearch({})}
							initialValues={{
								currencyIds: currencyListBySite?.map(item => item.currencyId),
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={24} xs={24}>
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
														'Yesterday',
														'Last Week',
														'This Month',
														'Last Month',
													])}
													format={time =>
														moment(time)
															.utcOffset(timeZoneUtcOffset)
															.format(dateFormat)
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
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='currencyIds' label={t('Label_Currency')}>
										<MultipleSelect
											onChange={onChangeCurrency}
											placeholder={t('Label_Select')}
										>
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
									{vipLevelSelect()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{categorySelect()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='userName' label={t('Label_MemberId')}>
										<Input allowClear placeholder={t('Label_MemberId')} />
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='sabaId' label={t('Label_SabaId')}>
										<Input allowClear placeholder={t('Label_SabaId')} />
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
		</Spin>
	)
}

export { TurnoverPointReportFilter }

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
} from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { LayoutContent } from 'app/pages/layout'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { Currency } from 'common/enum/type'
import {
	IGetCategoryData,
	IGetProductsData,
	IGetProvidersData,
	IGetTagsData,
	IGetVipLevels,
} from './type'

interface BetListFilterInterface {
	form: FormInstance
	loading: boolean
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
	onChangeCurrency: (newCurrencyIds: number[]) => void
	currencyList: Currency[]
	providers: IGetProvidersData[]
	products: IGetProductsData[]
	categories: IGetCategoryData[]
	vipLevels: IGetVipLevels[]
	tagList: IGetTagsData[]
	siteId?: number
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const BetListFilter: FC<BetListFilterInterface> = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
	onChangeCurrency,
	currencyList,
	providers,
	products,
	categories,
	siteId,
	vipLevels,
	tagList,
}) => {
	const { t } = useTranslation()

	const vipLevelSelect = () => (
		<Form.Item name='vipLevel' label={t('Label_VipLevel')}>
			<Select placeholder={t('Label_Select')} allowClear>
				{vipLevels
					?.filter(item => item.siteId === siteId)
					.map(item => (
						<Option key={item.level} value={item.level}>
							{item.levelName}
						</Option>
					))}
			</Select>
		</Form.Item>
	)

	const tagListSelect = () => {
		const onChangeTags = (newTags: number[]) => {
			if (newTags.includes(0)) {
				form.setFieldsValue({
					tags: tagList?.map(tag => tag.id),
				})
			} else {
				form.setFieldsValue({
					tags: newTags,
				})
			}
		}
		return (
			<Form.Item name='tags' label={t('Label_Tag')}>
				<MultipleSelect onChange={onChangeTags} placeholder={t('Label_Select')}>
					{tagList?.length > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}
					{tagList?.map(tag => (
						<Option key={tag.id} value={tag.id}>
							{tag.tagName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const disabledDate: RangePickerProps['disabledDate'] = current => {
		return (
			current > moment().endOf('day') || current < moment().subtract(14, 'day')
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
						initialValues={{
							currencyIds: currencyList?.map(item => item.currencyId),
						}}
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
												showTime
												disabledDate={disabledDate}
												ranges={MOMENT_RANGE_PICKER_RANGES([
													'Today',
													'Last 7 Day',
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
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='currencyIds' label={t('Label_Currency')}>
									<MultipleSelect
										onChange={onChangeCurrency}
										placeholder={t('Label_Select')}
									>
										{(currencyList?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}

										{currencyList?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item name='tpId' label={t('Label_Provider')}>
									<Select
										showSearch
										placeholder={t('Label_Select')}
										allowClear
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
									>
										{providers?.map(item => (
											<Option key={item.tpName} value={item.id}>
												{item.tpName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='gameType' label={t('Label_Product')}>
									<Select
										showSearch
										placeholder={t('Label_Select')}
										allowClear
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
									>
										{products?.map(item => (
											<Option key={item.typeName} value={item.type}>
												{item.typeName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='category' label={t('Label_Category')}>
									<Select
										showSearch
										placeholder={t('Label_Select')}
										allowClear
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
									>
										{categories?.map(item => (
											<Option key={item.categoryName} value={item.categoryName}>
												{item.categoryName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='game' label={t('Label_Game')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='title' label={t('Label_Title')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='matchID' label={t('Label_MatchId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='betType' label={t('Label_BetType')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='stake' label={t('Label_StakeRange')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='winLostAmount' label={t('Label_WinLoseRange')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_TransId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='tpUserName' label={t('Label_TpUserName')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='refNo' label={t('Label_RefNo')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								{vipLevelSelect()}
							</Col>
							<Col lg={4} md={12} xs={12}>
								{tagListSelect()}
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

export { BetListFilter }

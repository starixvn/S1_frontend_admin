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
} from 'antd'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { SearchOutlined } from '@ant-design/icons'
import { IGetCategoryData } from 'common/service/allDataApi'
import { MultipleSelect } from 'components/Select'
import { isPayoutList } from 'features/memberProfile/constants'
import { Currency, UserSite } from 'common/enum/type'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { head } from 'lodash'

const { RangePicker } = DatePicker
const { Panel } = Collapse
const { Option } = Select

interface VipRebateReportFilterProps {
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
	categoryList: IGetCategoryData[]
	currencyListBySite: Currency[]
	currencyIdsBySiteIds: Currency[]
	userSiteList: UserSite[]
	currencyListByAllSite: Currency[]
}

const VipRebateReportFilter = ({
	loading,
	form,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
	categoryList,
	currencyListBySite,
	currencyIdsBySiteIds,
	currencyListByAllSite,
	userSiteList,
}: VipRebateReportFilterProps) => {
	const { t } = useTranslation()

	const categorySelectRenderer = () => {
		const onChangeCategory = (newCategories: Array<number | string>) => {
			if (newCategories.includes('all')) {
				form.setFieldsValue({
					categoryIds: categoryList?.map(({ categoryId }) => categoryId),
				})
			} else {
				form.setFieldsValue({
					categoryIds: newCategories,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeCategory}
				placeholder={t('Label_Select')}
			>
				{(categoryList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{categoryList?.map(({ categoryId, categoryName }) => (
					<Option key={categoryId} value={categoryId}>
						{categoryName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const payoutSelectRenderer = () => {
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
				{isPayoutList?.map(({ value, displayName }) => (
					<Option key={Number(value)} value={value}>
						{t(displayName)}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const siteIdsSelector = () => {
		const onChangeSite = (newSiteIds: Array<number | string>) => {
			if (newSiteIds.includes('all')) {
				form.setFieldsValue({
					siteIds: userSiteList?.map(({ siteId }) => siteId),
				})
			} else {
				form.setFieldsValue({
					siteIds: newSiteIds,
				})
			}
			form.setFieldValue('currencyIds', [])
		}

		return (
			<Form.Item
				name='siteIds'
				label={t('Label_Site')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Site'),
						}),
					},
				]}
			>
				<MultipleSelect onChange={onChangeSite} placeholder={t('Label_Select')}>
					{(userSiteList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{userSiteList?.map(item => (
						<Option key={item.siteId} value={item.siteId}>
							{item.siteName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const currencySelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyIdsBySiteIds?.map(item => item.currencyId),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds,
				})
			}
		}
		return (
			<Form.Item
				name='currencyIds'
				label={t('Label_Currency')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Currency'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyIdsBySiteIds?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{currencyIdsBySiteIds?.map(({ currencyId, isoCode }) => (
						<Option key={currencyId} value={currencyId}>
							{isoCode}
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
						onFinish={onSearch}
						initialValues={{
							siteIds: userSiteList.map(item => item.siteId),
							// 預設全選
							currencyIds: currencyListByAllSite?.map(
								({ currencyId }) => currencyId
							),
							baseCurrencyId: head(currencyListBySite)?.currencyId,
							payoutStatuses: isPayoutList?.map(({ value }) => value),
						}}
					>
						<Row align='middle' gutter={16}>
							<Col span={12}>
								<Form.Item label={t('Label_DateRange')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
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
							<Col lg={6} md={12} xs={12}>
								{siteIdsSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='baseCurrencyId'
									label={t('Label_BaseCurrencyShow')}
								>
									<Select placeholder='select'>
										{currencyListBySite?.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='categoryIds' label={t('Label_Category')}>
									{categorySelectRenderer()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='payoutStatuses'
									label={t('Label_PayoutStatus')}
								>
									{payoutSelectRenderer()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>
						<Row justify='end' align='middle'>
							<Col>
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
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default VipRebateReportFilter

import { FC } from 'react'
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
import { LayoutContent } from 'app/pages/layout'
import { Currency, UserSite } from 'common/enum/type'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { MultipleSelect } from 'components/Select'
import {
	EventTypesEnum,
	eventTypesList,
	verificationRewardEventNames,
} from 'features/bonusExport/constants'
import {
	IDrawPrizesEventName,
	IGetBonusEventName,
} from 'features/bonusExport/type'
import { IGetCategoryData, IVipLevelsData } from 'common/service/allDataApi'
import { dateFormat } from 'common/utils/format'

interface IBonusExportFilterProps {
	form: FormInstance
	loading: boolean
	timeZoneUtcOffset?: number
	userSiteList: UserSite[]
	currencyIdsBySiteIds: Currency[]
	currencyListByAllSite: Currency[]
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
	currencyList: Currency[]
	drawPrizesEventNames: IDrawPrizesEventName[]
	vipUpgradeEventNames: IVipLevelsData[]
	vipRebateEventNames: IGetCategoryData[]
	bonusEventNames: IGetBonusEventName[]
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const BonusExportFilter: FC<IBonusExportFilterProps> = ({
	form,
	loading,
	timeZoneUtcOffset,
	userSiteList,
	currencyIdsBySiteIds,
	currencyListByAllSite,
	onSearch,
	onTimeZoneChange,
	currencyList,
	drawPrizesEventNames,
	vipUpgradeEventNames,
	vipRebateEventNames,
	bonusEventNames,
}) => {
	const { t } = useTranslation()
	const eventType = Form.useWatch('eventTypeId', form)

	const bonusSelectRenderer = () => {
		const onChangeEventNames = (newEventNames: string[]) => {
			if (newEventNames.includes('all')) {
				form.setFieldsValue({
					eventNames: bonusEventNames?.map(item => item.promotionTypeName),
				})
			} else {
				form.setFieldsValue({
					eventNames: newEventNames,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeEventNames}
				placeholder={t('Label_Select')}
			>
				{(bonusEventNames?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{bonusEventNames?.map(item => (
					<Option key={item.type} value={item.promotionTypeName}>
						{item.promotionTypeName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const drawPrizesSelectRenderer = () => {
		const onChangeEventNames = (newEventNames: string[]) => {
			if (newEventNames.includes('all')) {
				form.setFieldsValue({
					eventNames: drawPrizesEventNames?.map(item => item.eventName),
				})
			} else {
				form.setFieldsValue({
					eventNames: newEventNames,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeEventNames}
				placeholder={t('Label_Select')}
			>
				{(drawPrizesEventNames?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{drawPrizesEventNames?.map(item => (
					<Option key={item.eventName} value={item.eventName}>
						{item.eventName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const verificationRewardSelectRenderer = () => {
		const onChangeEventNames = (newEventNames: string[]) => {
			if (newEventNames.includes('all')) {
				form.setFieldsValue({
					eventNames: verificationRewardEventNames?.map(item => item.value),
				})
			} else {
				form.setFieldsValue({
					eventNames: newEventNames,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeEventNames}
				placeholder={t('Label_Select')}
			>
				{(verificationRewardEventNames?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{verificationRewardEventNames?.map(item => (
					<Option key={item.value} value={item.value}>
						{t(item.displayKey)}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const vipRebateSelectRenderer = () => {
		const onChangeEventNames = (newEventNames: string[]) => {
			if (newEventNames.includes('all')) {
				form.setFieldsValue({
					eventNames: vipRebateEventNames?.map(item => item.categoryName),
				})
			} else {
				form.setFieldsValue({
					eventNames: newEventNames,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeEventNames}
				placeholder={t('Label_Select')}
			>
				{(vipRebateEventNames?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{vipRebateEventNames?.map(item => (
					<Option key={item.categoryName} value={item.categoryName}>
						{item.categoryName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const vipUpgradeSelectRenderer = () => {
		const onChangeEventNames = (newEventNames: string[]) => {
			if (newEventNames.includes('all')) {
				form.setFieldsValue({
					eventNames: vipUpgradeEventNames?.map(item => item.levelName),
				})
			} else {
				form.setFieldsValue({
					eventNames: newEventNames,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeEventNames}
				placeholder={t('Label_Select')}
			>
				{(vipUpgradeEventNames?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{vipUpgradeEventNames?.map(item => (
					<Option key={item.levelName} value={item.levelName}>
						{item.levelName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const eventNamesRenderer = () => {
		switch (eventType) {
			case EventTypesEnum.Bonus:
				return bonusSelectRenderer()
			case EventTypesEnum.DrawPrizesReport:
				return drawPrizesSelectRenderer()
			case EventTypesEnum.VerificationReward:
				return verificationRewardSelectRenderer()
			case EventTypesEnum.VipRebate:
				return vipRebateSelectRenderer()
			case EventTypesEnum.VipUpgrade:
				return vipUpgradeSelectRenderer()
			case EventTypesEnum.ReferralReward:
				return <Input allowClear />
			case EventTypesEnum.ReferralFreeCredit:
				return <Input allowClear />
			default:
				return <Input placeholder={t('Label_SelectEventType')} disabled />
		}
	}

	// * siteIds 異動時須清空 currencyIds, eventNames 讓使用者重新選擇
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

			form.setFieldsValue({
				currencyIds: [],
				eventNames: [],
			})
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

	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: Array<number | string>) => {
			if (newCurrencyIds.includes('all')) {
				form.setFieldsValue({
					currencyIds: currencyIdsBySiteIds?.map(
						({ currencyId }) => currencyId
					),
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
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{currencyIdsBySiteIds?.map(item => (
						<Option key={item.currencyId} value={item.currencyId}>
							{item.isoCode}
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
						initialValues={{
							siteIds: userSiteList.map(item => item.siteId),
							currencyIds: currencyListByAllSite?.map(
								({ currencyId }) => currencyId
							),
							baseCurrencyId: 0,
							eventTypeId: 0,
							userName: '',
							tpUserName: '',
							bonusCode: '',
							transId: '',
							eventNames: [],
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
												ranges={MOMENT_RANGE_PICKER_RANGES([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
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
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{siteIdsSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{currencyIdsSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='baseCurrencyId'
									label={t('Label_BaseCurrency')}
								>
									<Select placeholder={t('Label_Select')}>
										<Option key={0} value={0}>
											{t('Label_OriginalCurrency')}
										</Option>
										{currencyList?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='eventTypeId' label={t('Label_EventType')}>
									<Select
										placeholder={t('Label_Select')}
										onChange={() => form.resetFields(['eventNames'])}
									>
										<Option key={0} value={0}>
											{t('Label_SelectAll')}
										</Option>
										{eventTypesList?.map(item => (
											<Option key={item.value} value={item.value}>
												{t(item.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='eventNames' label={t('Label_EventName')}>
									{eventNamesRenderer()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='tpUserName' label={t('Label_TpUserName')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='bonusCode' label={t('Label_BonusCode')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_TransactionId')}>
									<Input allowClear />
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
	)
}

export { BonusExportFilter }

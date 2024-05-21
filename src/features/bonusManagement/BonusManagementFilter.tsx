import { FC } from 'react'
import {
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Button,
	Checkbox,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import {
	DevicesEnum,
	devicesList,
	StatusEnum,
	statusList,
} from 'features/bonusManagement/constants'
import { IGetPromotionTypeData } from 'features/bonusManagement/type'
import { SearchOutlined } from '@ant-design/icons'
import { filterOptionByChildren } from 'common/utils'

interface IBonusManagementFilterProps {
	loading: boolean
	form: FormInstance
	currencyListBySite: Currency[]
	promotionList: IGetPromotionTypeData[]
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

const { Panel } = Collapse
const { Option } = Select
const { RangePicker } = DatePicker

const BonusManagementFilter: FC<IBonusManagementFilterProps> = ({
	loading,
	form,
	currencyListBySite,
	onSearch,
	promotionList,
}) => {
	const { t } = useTranslation()
	const currencyIdsSelector = () => {
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
			<Form.Item name='currencyIds' label={t('Label_Currency')}>
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
					filterOption={filterOptionByChildren}
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
		)
	}

	const promotionListSelector = () => {
		const onChangePromotionType = (
			newPromotionTypes: Array<number | string>
		) => {
			if (newPromotionTypes.includes('all')) {
				form.setFieldsValue({
					promotionTypes: promotionList?.map(promotion => promotion.type),
				})
			} else {
				form.setFieldsValue({
					promotionTypes: newPromotionTypes,
				})
			}
		}

		return (
			<Form.Item name='promotionTypes' label={t('Label_PromotionType')}>
				<MultipleSelect
					onChange={onChangePromotionType}
					placeholder={t('Label_Select')}
					filterOption={filterOptionByChildren}
				>
					{(promotionList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{promotionList?.map(promotion => (
						<Option key={promotion.type} value={promotion.type}>
							{promotion.promotionTypeName}
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
							currencyIds: currencyListBySite?.map(
								currency => currency.currencyId
							),
							status: StatusEnum?.All,
							device: DevicesEnum?.All,
							isSpecial: false,
							bonusCode: '',
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={21} xs={21}>
								<Form.Item label={t('Label_Period')}>
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
											/>
										</Form.Item>
									</Input.Group>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='bonusCode'
									label={t('Label_BonusCode')}
									style={{ width: '100%' }}
								>
									<Input allowClear />
								</Form.Item>
								<Form.Item
									name='isSpecial'
									valuePropName='checked'
									style={{
										position: 'absolute',
										right: '0',
										top: '-5px',
									}}
								>
									<Checkbox>{t('Label_IsScratch')}</Checkbox>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='scratchCardCode'
									label={t('Label_ScratchCardCode')}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								{currencyIdsSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{promotionListSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='status' label={t('Label_Status')}>
									<Select placeholder={t('Label_Select')}>
										{statusList?.map(status => (
											<Option key={status.value} value={status.value}>
												{t(status.displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='device' label={t('Label_Device')}>
									<Select placeholder={t('Label_Select')}>
										{devicesList?.map(device => (
											<Option key={device.value} value={device.value}>
												{t(device.displayName)}
											</Option>
										))}
									</Select>
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

export { BonusManagementFilter }

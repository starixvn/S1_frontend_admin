import { FC } from 'react'
import dayjs from 'dayjs'
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
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { LayoutContent } from 'app/pages/layout'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { Currency } from 'common/enum/type'
import { IVipLevelEnumData } from 'common/service/baseDataApi/type'
import { dateFormat } from 'common/utils/format'
import { MultipleSelect } from 'components/Select'
import { StatusEnum, statusesList } from 'features/redemptionListing/constants'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface RedemptionListingFilterInterface {
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
}

const RedemptionListingFilter: FC<RedemptionListingFilterInterface> = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	currencyListBySite,
	vipLevelsList,
	onTimeZoneChange,
}) => {
	const { t } = useTranslation()

	const vipLevelSelect = () => {
		const onChangeVipLevel = (newLevel: number[]) => {
			if (newLevel.includes(0)) {
				form.setFieldsValue({
					vipLevels: vipLevelsList?.map(({ level }) => level),
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
					{vipLevelsList?.map(({ level, levelName }) => (
						<Option key={level} value={level}>
							{levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const statusSelect = () => {
		const onChangeStatus = (newStatus: Array<number | string>) => {
			// 這裡有 status 是 0 , 故設為 all
			if (newStatus.includes('all')) {
				form.setFieldsValue({
					statuses: statusesList
						?.filter(status => status.status !== StatusEnum.Draft)
						.map(status => status.status),
				})
			} else {
				form.setFieldsValue({
					statuses: newStatus,
				})
			}
		}
		return (
			<Form.Item name='statuses' label={t('Label_Status')}>
				<MultipleSelect
					onChange={onChangeStatus}
					placeholder={t('Label_Select')}
				>
					<Option value='all'>{t('Label_SelectAll')}</Option>
					{statusesList
						?.filter(status => status.status !== StatusEnum.Draft)
						.map(status => (
							<Option key={status.status} value={status.status}>
								{t(status.displayKey)}
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
							statuses: [StatusEnum.Pending],
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
												ranges={RANGE_PICKER_RANGES([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
												])}
												format={time =>
													dayjs(time)
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
								{statusSelect()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='transId' label={t('Label_ReferId')}>
									<Input allowClear placeholder={t('Label_ReferId')} />
								</Form.Item>
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
	)
}

export { RedemptionListingFilter }

import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { DATE_RANGES, RANGE_PICKER_PRESETS } from 'app/constants/ranges'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { selectAllSiteEnableCurrencyList } from 'common/enum'
import { IEnumTypeData } from 'common/service/enumApi'
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	Input,
	Row,
	Select,
	Space,
} from 'antd'
import { MultipleSelect } from 'components/Select'
import { Currency, UserSite } from 'common/enum/type'

interface IFpsDeviceReportFilterProps {
	form: FormInstance
	loading: boolean
	userSiteList: UserSite[]
	currencyIdsBySiteIds: Currency[]
	timeZoneUtcOffset: number
	fpsDeviceTypeList: IEnumTypeData[]
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

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const FpsDeviceReportFilter = ({
	form,
	loading,
	userSiteList,
	currencyIdsBySiteIds,
	timeZoneUtcOffset,
	fpsDeviceTypeList,
	onTimeZoneChange,
	onSearch,
}: IFpsDeviceReportFilterProps) => {
	const { t } = useTranslation()
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)

	// * siteIds 異動時須清空 currencyIds
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
			<Panel header='' key={1}>
				<LayoutContent.Card style={{ margin: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							siteIds: userSiteList.map(item => item.siteId),
							// 因為預設 allSite 全選，所以預設值直接先拿全部資料塞值
							currencyIds: currencyListByAllSite?.map(
								({ currencyId }) => currencyId
							),
							deviceType: 0,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={12} md={12} xs={24}>
								<Form.Item label={t('Label_ActiveDate')}>
									<Space.Compact style={{ width: '100%', display: 'flex' }}>
										<Form.Item
											noStyle
											name='dateRange'
											initialValue={DATE_RANGES.Today}
										>
											<RangePicker
												style={{ width: '100%' }}
												presets={RANGE_PICKER_PRESETS([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
												])}
												showTime
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
								{siteIdsSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='deviceType' label={t('Label_DeviceType')}>
									<Select placeholder='select'>
										<Option value={0}>{t('Label_SelectAll')}</Option>
										{fpsDeviceTypeList?.map(({ name, value }) => (
											<Option key={value} value={value}>
												{name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<br />

						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='deviceId' label={t('Label_DeviceId')}>
									<Input allowClear placeholder={t('Label_DeviceId')} />
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

export default FpsDeviceReportFilter

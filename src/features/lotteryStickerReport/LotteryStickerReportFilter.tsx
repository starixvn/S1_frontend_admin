import { FC } from 'react'
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
import { DATE_RANGES, RANGE_PICKER_PRESETS } from 'app/constants/ranges'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { dateFormat } from 'common/utils/format'
import { MultipleSelect } from 'components/Select'
import { selectCurrencyListBySite, selectUserSiteList } from 'common/enum'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

interface ILotteryStickerReportFilterProps {
	form: FormInstance
	loading: boolean

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

const LotteryStickerReportFilter: FC<ILotteryStickerReportFilterProps> = ({
	form,
	loading,
	onSearch,
}) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()
	const userSiteList = useAppSelector(selectUserSiteList)
	const currencyIdsBySiteIds = useAppSelector(selectCurrencyListBySite)

	/**  ======= 對內函數 ======= */

	/** 選擇 currencyIds，如果 siteIds 有異動會清空 currencyIds */
	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: ('all' | number)[]) => {
			if (newCurrencyIds.includes('all')) {
				form.setFieldsValue({
					currencyIds: currencyIdsBySiteIds?.map(
						({ currencyId }) => currencyId
					),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds as number[],
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

	/** 選擇 siteIds，如果 siteIds 有異動會清空 currencyIds */
	const siteIdsSelector = () => {
		const onChangeSite = (newSiteIds: ('all' | number)[]) => {
			if (newSiteIds.includes('all')) {
				form.setFieldsValue({
					siteIds: userSiteList?.map(({ siteId }) => siteId),
				})
			} else {
				form.setFieldsValue({
					siteIds: newSiteIds as number[],
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

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => {
							onSearch({})
						}}
						initialValues={{
							selected: 0,
							userName: '',
							roundId: null,
							siteIds: userSiteList?.map(({ siteId }) => siteId),
							currencyIds: currencyIdsBySiteIds?.map(
								({ currencyId }) => currencyId
							),
						}}
					>
						{/* 日期/渠道/幣別 --- 選擇器 */}
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_PurchaseTime')}>
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
												presets={RANGE_PICKER_PRESETS([
													'Today',
													'Yesterday',
													'Last Week',
													'This Month',
													'Last Month',
												])}
												format={dateFormat}
											/>
										</Form.Item>
									</Input.Group>
								</Form.Item>
							</Col>
							<Col lg={6} md={24} xs={24}>
								{siteIdsSelector()}
							</Col>
							<Col lg={6} md={24} xs={24}>
								{currencyIdsSelector()}
							</Col>
						</Row>

						{/* 姓名/roundId --- 輸入框 */}
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_UserName')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='roundId' label={t('Label_Round')}>
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

export { LotteryStickerReportFilter }

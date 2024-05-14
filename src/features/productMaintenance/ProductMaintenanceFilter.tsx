import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { SearchOutlined } from '@ant-design/icons'
import {
	Col,
	Row,
	Form,
	Input,
	Space,
	Select,
	Button,
	Collapse,
	DatePicker,
	FormInstance,
	Checkbox,
} from 'antd'
import {
	ITpListData,
	IGetProductsData,
	IGetCategoryData,
} from 'common/service/allDataApi'
import { IFilterForm } from 'features/productMaintenance/type'

interface IProductMaintenanceProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	timeZoneUtcOffset: number
	tpList: ITpListData[]
	categoryList: IGetCategoryData[]
	gameTypeList: IGetProductsData[]
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

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const ProductMaintenanceFilter = ({
	form,
	loading,
	timeZoneUtcOffset,
	tpList,
	categoryList,
	gameTypeList,
	onSearch,
	onTimeZoneChange,
}: IProductMaintenanceProps) => {
	const { t } = useTranslation()

	const resetTpGameType = () => {
		form.setFieldsValue({
			tpGameTypeId: 0,
		})
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
						initialValues={{
							tpId: 0,
							tpGameTypeId: 0,
							tpCategoryId: 0,
							isExpired: false,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={24} xs={24}>
								<Form.Item
									// label={t('Label_DateRange')}
									label={
										<Space align='center' size={30}>
											{t('Label_DateRange')}
											<Form.Item
												name='isExpired'
												valuePropName='checked'
												noStyle
											>
												<Checkbox>{t('Label_IsExpired')}</Checkbox>
											</Form.Item>
										</Space>
									}
								>
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
								<Form.Item name='tpId' label={t('Label_Vender')}>
									<Select
										onChange={resetTpGameType}
										placeholder={t('Label_Select')}
										showSearch
										filterOption={(input, option) => {
											const isIncludes: boolean = (
												option!.children as unknown as string
											)
												.toLowerCase()
												.includes(input.toLowerCase())

											return isIncludes
										}}
									>
										<Option value={0}>{t('Label_SelectAll')}</Option>

										{tpList?.map(({ id, tpDisplayName }) => (
											<Option key={id} value={id}>
												{tpDisplayName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='tpGameTypeId' label={t('Label_GameType')}>
									<Select placeholder={t('Label_Select')}>
										<Option value={0}>{t('Label_SelectAll')}</Option>

										{gameTypeList?.map(({ type, typeName }) => (
											<Option key={type} value={type}>
												{typeName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='tpCategoryId' label={t('Label_Category')}>
									<Select placeholder={t('Label_Select')}>
										<Option value={0}>{t('Label_SelectAll')}</Option>

										{categoryList?.map(({ categoryId, categoryName }) => (
											<Option key={categoryId} value={categoryId}>
												{categoryName}
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

export default ProductMaintenanceFilter

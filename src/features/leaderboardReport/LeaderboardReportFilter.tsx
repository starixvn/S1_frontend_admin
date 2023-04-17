import dayjs from 'dayjs'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { SearchOutlined } from '@ant-design/icons'
import type { RangePickerProps } from 'antd/es/date-picker'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Row,
	Select,
} from 'antd'
import {
	IFilterForm,
	ILeaderBoardCategoryEnumData,
} from 'features/leaderboardReport/type'
import { LeaderBoardCategoryEnum } from 'features/leaderboardReport/constants'

interface ILeaderboardReportFilterProps {
	loading: boolean
	form: FormInstance<IFilterForm>
	currencyListBySite: Currency[]
	LeaderBoardCategoryList: ILeaderBoardCategoryEnumData[]
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
}

const { Panel } = Collapse
const { Option } = Select

const LeaderboardReportFilter = ({
	loading,
	form,
	currencyListBySite,
	LeaderBoardCategoryList,
	onSearch,
}: ILeaderboardReportFilterProps) => {
	const { t } = useTranslation()
	const formCategoryId = Form.useWatch('categoryId', form)
	const formCurrencyId = Form.useWatch('currencyId', form)

	const disabledMonth: RangePickerProps['disabledDate'] = current => {
		// 當月之後無法選取
		return current && current > dayjs().endOf('day')
	}

	const handleCategory = (newCategory: number) => {
		if (newCategory !== LeaderBoardCategoryEnum.SelectAll) {
			form.setFieldsValue({
				monthRange: moment(),
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
							// 現在時間
							monthRange: moment(),
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='currencyId'
									label={t('Label_Currency')}
									rules={[{ required: true }]}
								>
									<Select placeholder={t('Label_Currency')}>
										{currencyListBySite?.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='categoryId'
									label={t('Label_Category')}
									rules={[{ required: true }]}
								>
									<Select
										placeholder={t('Label_Category')}
										onChange={handleCategory}
										disabled={!formCurrencyId}
									>
										{(LeaderBoardCategoryList.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}
										{LeaderBoardCategoryList?.map(({ value, name }) => (
											<Option key={value} value={value}>
												{name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_Month')}>
									<Form.Item
										noStyle
										name='monthRange'
										rules={[
											{
												required: true,
												message: t('Label_MonthRequire'),
											},
										]}
									>
										<DatePicker
											style={{ width: '100%' }}
											picker='month'
											disabledDate={disabledMonth}
											disabled={
												formCategoryId !== LeaderBoardCategoryEnum.SelectAll
											}
										/>
									</Form.Item>
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

export default LeaderboardReportFilter

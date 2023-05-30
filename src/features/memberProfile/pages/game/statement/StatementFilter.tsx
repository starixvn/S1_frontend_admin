import {
	Button,
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Spin,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { LeftOutlined, SearchOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction } from 'react'
import { GameStatementTableEnum } from 'features/memberProfile/constants'
import { IGetCategoryData } from 'common/service/allDataApi'
import { IGetGameTypeListData } from 'features/memberProfile/type'
import { MultipleSelect } from 'components/Select'

interface IStatementFilterProps {
	loading: boolean
	filterLoading: boolean
	form: FormInstance
	categoryList: IGetCategoryData[]
	gameTypeList: IGetGameTypeListData[]
	onSearch: () => void
	onTimeZoneChange: (newUtcOffset: number) => void
	timeZoneUtcOffset: number
	tableState: number
	setTableState: Dispatch<SetStateAction<number>>
}

const { Option } = Select
const { RangePicker } = DatePicker

const StatementFilter = ({
	loading,
	filterLoading,
	form,
	categoryList,
	gameTypeList,
	onSearch,
	onTimeZoneChange,
	timeZoneUtcOffset,
	tableState,
	setTableState,
}: IStatementFilterProps) => {
	const { t } = useTranslation()

	const categorySelectRenderer = () => {
		const onChangeCategory = (newCategories: Array<number | string>) => {
			if (newCategories.includes('all')) {
				form.setFieldsValue({
					tpCategoryList: categoryList?.map(item => item.categoryId),
				})
			} else {
				form.setFieldsValue({
					tpCategoryList: newCategories,
				})
			}
			form.resetFields(['gameTypes'])
		}
		return (
			<MultipleSelect
				onChange={onChangeCategory}
				placeholder={t('Label_Select')}
			>
				{(categoryList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{categoryList?.map(item => (
					<Option key={item.categoryId} value={item.categoryId}>
						{item.categoryName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const gameTypeSelectRenderer = () => {
		const onChangeGameType = (newGameType: Array<number | string>) => {
			if (newGameType.includes('all')) {
				form.setFieldsValue({
					gameTypes: gameTypeList?.map(item => item.type),
				})
			} else {
				form.setFieldsValue({
					gameTypes: newGameType,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeGameType}
				placeholder={t('Label_Select')}
			>
				{(gameTypeList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{gameTypeList?.map(item => (
					<Option key={item.type} value={item.type}>
						{item.typeName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	return (
		<Spin spinning={filterLoading}>
			<Form
				layout='vertical'
				size='middle'
				form={form}
				onFinish={() => onSearch()}
				initialValues={{
					tpCategoryList: [],
					gameTypes: [],
				}}
			>
				<Row align='middle' gutter={20}>
					<Col span={10}>
						<Form.Item label={t('Label_DateRange')}>
							<Input.Group compact style={{ width: '100%', display: 'flex' }}>
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
										showTime
										style={{ width: '100%' }}
										ranges={MOMENT_RANGE_PICKER_RANGES([
											'Today',
											'Last 7 Day',
											'This Month',
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
					{tableState !== GameStatementTableEnum.TPBetRecord && (
						<Col style={{ marginLeft: 'auto' }}>
							<Button
								icon={<LeftOutlined />}
								onClick={() => {
									setTableState(prev => prev - 1)
								}}
							>
								{t('Label_Back')}
							</Button>
						</Col>
					)}
				</Row>
				<Row align='middle' gutter={16}>
					<Col lg={8} md={10} xs={10}>
						<Form.Item name='tpCategoryList' label={t('Label_Category')}>
							{categorySelectRenderer()}
						</Form.Item>
					</Col>
					<Col lg={8} md={10} xs={10}>
						<Form.Item name='gameTypes' label={t('Label_GameType')}>
							{gameTypeSelectRenderer()}
						</Form.Item>
					</Col>
					<Col span={3}>
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
		</Spin>
	)
}

export { StatementFilter }

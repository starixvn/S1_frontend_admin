import {
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
} from 'antd'
import {
	IEnumTypeData,
	IEnumTypeResponse,
	useGetEnumTypeQuery,
} from 'common/service/enumApi'
import {
	ActionModeEnum,
	UrlRouterEnum,
} from 'features/bannerManagement/constants'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import BannerModalTabs from 'features/bannerManagement/BannerModal/BannerModalTabs'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { Currency } from 'common/enum/type'
import {
	CategoryIdEnum,
	IAddForm,
	IGetTpBySiteAndCurrencyResponse,
	IGetTpCategoryByTpIdResponse,
	IGetTpListByCategoryResponse,
} from 'features/bannerManagement/type'
import {
	useGetGameIdListQuery,
	useGetTpBySiteAndCurrencyQuery,
	useGetTpCategoryByTpIdQuery,
	useGetTpListByCategoryQuery,
} from 'features/bannerManagement/api'
import { useTranslation } from 'react-i18next'

const { Option } = Select
const { RangePicker } = DatePicker

interface IAddBannerModalFormProps {
	form: FormInstance<IAddForm>
	loading: boolean
	currencyListBySite: Currency[]
	bannerTypeList: IEnumTypeData[]
	showStatusList: IEnumTypeData[]
	bannerActionModeList: IEnumTypeData[]
	languageList: string[]
	siteId?: number
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onChangeTab: (currencyNum: number) => void
}

const BannerModalForm = ({
	form,
	loading,
	currencyListBySite,
	bannerTypeList,
	showStatusList,
	bannerActionModeList,
	languageList,
	siteId,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onChangeTab,
}: IAddBannerModalFormProps) => {
	const { t } = useTranslation()
	const actionMode = Form.useWatch('actionMode', form)
	const tpId = Form.useWatch('tpId', form)
	const urlRouter = Form.useWatch('urlRouter', form)
	const currencyId = Form.useWatch('currencyId', form)
	const categoryId = Form.useWatch('categoryId', form)

	const {
		data: { data: categoryList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetCategoryListLoading,
	} = useGetEnumTypeQuery({ enumName: 'UrlRouterEnum' })

	const {
		data: { data: tpList = [] } = {} as IGetTpBySiteAndCurrencyResponse,
		isLoading: isGetTpListLoading,
	} = useGetTpBySiteAndCurrencyQuery(
		{ siteId, currencyId },
		{ skip: !siteId || !currencyId }
	)

	const {
		data: { data: tpCategoryList = [] } = {} as IGetTpCategoryByTpIdResponse,
		isLoading: isGetGameCategoryListLoading,
	} = useGetTpCategoryByTpIdQuery({ tpId }, { skip: !tpId })

	const {
		data: { data: filterTpList = [] } = {} as IGetTpListByCategoryResponse,
		isLoading: isGetFilterTpListLoading,
	} = useGetTpListByCategoryQuery(
		{
			categoryId: CategoryIdEnum.Casino,
		},
		{
			skip: !urlRouter || !(UrlRouterEnum.slots === Number(urlRouter)),
		}
	)

	const {
		data: { data: gameIdList = [] } = {},
		isLoading: isGetGameIdListLoading,
	} = useGetGameIdListQuery(
		{
			tpId,
			categoryId,
		},
		{ skip: !tpId || !categoryId }
	)

	const onCurrencyChange = async (formCurrency: number) => {
		onChangeTab(formCurrency)
		languageList.forEach(lang => {
			form.resetFields([
				['specific', lang, 'bannerLink'],
				['specific', lang, 'bannerPCUrl'],
				['specific', lang, 'bannerMobileUrl'],
			])
		})
	}

	const handleUrlRouterChange = () => {
		form.resetFields(['filterTpId'])
	}

	const handleTpIdChange = () => {
		form.resetFields(['gameId', 'categoryId'])
	}

	const handleActionModeChange = () => {
		form.resetFields([
			'tpId',
			'bonusCode',
			'urlRouter',
			'filterTpId',
			'categoryId',
			'gameId',
		])
	}

	const handleCategoryIdChange = () => {
		form.resetFields(['gameId'])
	}

	return (
		<Spin
			spinning={
				loading ||
				isGetTpListLoading ||
				isGetGameCategoryListLoading ||
				isGetFilterTpListLoading ||
				isGetCategoryListLoading ||
				isGetGameIdListLoading
			}
		>
			<Form
				layout='vertical'
				size='middle'
				form={form}
				initialValues={{
					sort: 1,
				}}
			>
				<Row align='middle' gutter={16}>
					<Col lg={6} md={12} xs={24}>
						<Form.Item
							name='currencyId'
							label={t('Label_Currency')}
							rules={[{ required: true }]}
						>
							<Select
								placeholder={t('Label_Currency')}
								onChange={onCurrencyChange}
							>
								{currencyListBySite?.map(item => (
									<Option key={item.currencyId} value={item.currencyId}>
										{item.isoCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={24}>
						<Form.Item
							name='bannerName'
							label={t('Label_Name')}
							rules={[{ required: true }]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={24}>
						<Form.Item
							name='bannerType'
							label={t('Label_Type')}
							rules={[{ required: true }]}
						>
							<Select placeholder={t('Label_Type')}>
								{bannerTypeList?.map(({ value, name }) => (
									<Option key={value} value={value}>
										{name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={24}>
						<Form.Item
							name='sort'
							label={t('Label_Sort')}
							rules={[
								{
									required: true,
									message: t('Label_RequiredText'),
								},
								{
									type: 'number',
									min: 0,
									message: '',
								},
							]}
						>
							<InputNumber
								type='number'
								style={{ width: '100%' }}
								controls={false}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row align='middle' gutter={16}>
					<Col lg={6} md={12} xs={24}>
						<Form.Item
							name='showStatus'
							label={t('Label_ShowStatus')}
							rules={[{ required: true }]}
						>
							<Select placeholder={t('Label_ShowStatus')}>
								{showStatusList?.map(({ value, name }) => (
									<Option key={value} value={value}>
										{name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={24}>
						<Form.Item
							name='actionMode'
							label={t('Label_ActionMode')}
							rules={[{ required: true }]}
						>
							<Select
								placeholder={t('Label_ActionMode')}
								onChange={handleActionModeChange}
							>
								{bannerActionModeList?.map(({ value, name }) => (
									<Option key={value} value={value}>
										{name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					{actionMode === ActionModeEnum.GoToLobby && (
						<Col lg={6} md={12} xs={24}>
							<Form.Item
								name='urlRouter'
								label={t('Label_UrlRouter')}
								rules={[{ required: true }]}
							>
								<Select
									placeholder={t('Label_UrlRouter')}
									onChange={handleUrlRouterChange}
								>
									{categoryList?.map(({ value, name }) => (
										<Option key={value} value={value}>
											{name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					)}
					{actionMode === ActionModeEnum.GoToGame && (
						<Col lg={6} md={12} xs={24}>
							<Form.Item
								name='tpId'
								label={t('Label_TpID')}
								rules={[{ required: true }]}
							>
								<Select
									placeholder={t('Label_TpID')}
									onChange={handleTpIdChange}
								>
									{tpList?.map(({ tpId: id, tpName }) => (
										<Option key={id} value={id}>
											{tpName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					)}
					{actionMode === ActionModeEnum.GoToLobby &&
						UrlRouterEnum.slots === Number(urlRouter) && (
							<Col lg={6} md={12} xs={24}>
								<Form.Item
									name='filterTpId'
									label={t('Label_TpID')}
									rules={[{ required: true }]}
								>
									<Select placeholder={t('Label_TpID')}>
										{filterTpList?.map(item => (
											<Option key={item.tpId} value={item.tpId}>
												{item.tpName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						)}

					{actionMode === ActionModeEnum.GoToGame && tpCategoryList.length > 0 && (
						<Col lg={6} md={12} xs={24}>
							<Form.Item
								name='categoryId'
								label={t('Label_Category')}
								rules={[{ required: true }]}
							>
								<Select
									placeholder={t('Label_Category')}
									onChange={handleCategoryIdChange}
								>
									{tpCategoryList?.map(
										({ categoryId: formCategoryId, categoryName }) => (
											<Option key={formCategoryId} value={formCategoryId}>
												{categoryName}
											</Option>
										)
									)}
								</Select>
							</Form.Item>
						</Col>
					)}
					{actionMode === ActionModeEnum.GoToGame && gameIdList.length > 0 && (
						<Col lg={6} md={12} xs={24}>
							<Form.Item
								name='gameId'
								label={t('Label_GameId')}
								rules={[
									{
										validator: (_validator, value) => {
											// * gameId 有可能是 "", 因此不能單純使用 { required: true }
											return value !== undefined
												? Promise.resolve()
												: Promise.reject(
														new Error(
															t('Label_Required', {
																key: t('Label_GameId'),
															})
														)
												  )
										},
									},
								]}
							>
								<Select
									placeholder={t('Label_GameId')}
									showSearch
									allowClear
									filterOption={(input, option) => {
										const isIncludes: boolean = (
											option!.children as unknown as string
										)
											.toLowerCase()
											.includes(input.toLowerCase())

										if (!isIncludes) {
											form.setFieldsValue({
												gameId: input,
											})
										}

										return isIncludes
									}}
								>
									{gameIdList?.map(({ gameId, name }) => (
										<Option key={gameId} value={gameId}>
											{name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					)}
					{actionMode === ActionModeEnum.GoToBonus && (
						<Col lg={6} md={12} xs={24}>
							<Form.Item
								name='bonusCode'
								label={t('Label_BonusCode')}
								rules={[{ required: true }]}
							>
								<Input placeholder={t('Label_BonusCode')} allowClear />
							</Form.Item>
						</Col>
					)}
				</Row>
				<Row align='middle' gutter={16}>
					<Col lg={12} md={12} xs={24}>
						<Form.Item label={t('Label_ActiveDate')}>
							<Input.Group compact style={{ width: '100%', display: 'flex' }}>
								<Form.Item
									noStyle
									name='dateRange'
									initialValue={MOMENT_DATE_RANGES.Today}
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
										showTime
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
				<BannerModalTabs
					form={form}
					languageList={languageList ?? []}
					actionMode={actionMode}
				/>
			</Form>
		</Spin>
	)
}

export default BannerModalForm

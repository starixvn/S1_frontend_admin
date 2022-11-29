import {
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
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
import TimeZoneSelect, { useTimeZone } from 'components/TimeZoneSelect'
import { Currency } from 'common/enum/type'
import {
	IAddForm,
	IGetGameCasinoByTpIdResponse,
	IGetTpListByCategoryResponse,
	IGetTpListResponse,
} from 'features/bannerManagement/type'
import {
	useGetGameCasinoByTpIdQuery,
	useGetTpListByCategoryQuery,
	useGetTpListQuery,
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
	onChangeTab,
}: IAddBannerModalFormProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const actionMode = Form.useWatch('actionMode', form)
	const tpId = Form.useWatch('tpId', form)
	const urlRouter = Form.useWatch('urlRouter', form)

	const {
		data: { data: categoryList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetCategoryListLoading,
	} = useGetEnumTypeQuery({ enumName: 'UrlRouterEnum' })

	const {
		data: { data: tpList = [] } = {} as IGetTpListResponse,
		isLoading: isGetTpListLoading,
	} = useGetTpListQuery(null)

	const {
		data: { data: gameList = [] } = {} as IGetGameCasinoByTpIdResponse,
		isLoading: isGetGameListLoading,
	} = useGetGameCasinoByTpIdQuery({ tpId: tpId === 'null' ? 0 : tpId })

	const {
		data: { data: filterTpList = [] } = {} as IGetTpListByCategoryResponse,
		isLoading: isGetFilterTpListLoading,
	} = useGetTpListByCategoryQuery({
		categoryId: [
			UrlRouterEnum.Sports,
			UrlRouterEnum.Casino,
			UrlRouterEnum.Lottery,
		].includes(Number(urlRouter))
			? urlRouter
			: 0,
	})

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
		form.resetFields(['gameId'])
	}

	return (
		<Spin
			spinning={
				loading ||
				isGetTpListLoading ||
				isGetGameListLoading ||
				isGetFilterTpListLoading ||
				isGetCategoryListLoading
			}
		>
			<Form layout='vertical' size='middle' form={form}>
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
							<Select placeholder={t('Label_ActionMode')}>
								{bannerActionModeList?.map(({ value, name }) => (
									<Option key={value} value={value}>
										{name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					{actionMode === ActionModeEnum.RedirectPagesOfThisSite && (
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
									{tpList?.map(({ id, tpName }) => (
										<Option key={id} value={id}>
											{tpName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					)}
					{actionMode === ActionModeEnum.RedirectPagesOfThisSite &&
						filterTpList.length > 0 && (
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
					{actionMode === ActionModeEnum.GoToGame && gameList.length > 0 && (
						<Col lg={6} md={12} xs={24}>
							<Form.Item
								name='gameId'
								label={t('Label_GameId')}
								rules={[{ required: true }]}
							>
								<Select placeholder={t('Label_GameId')}>
									{gameList?.map(({ gameCasinoId, name }) => (
										<Option key={gameCasinoId} value={gameCasinoId}>
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
											'Last 7 Day',
											'This Month',
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

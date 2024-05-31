import {
	Col,
	Row,
	Form,
	Input,
	Button,
	Select,
	Collapse,
	DatePicker,
	FormInstance,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { MultipleSelect } from 'components/Select'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { selectCurrencyListBySite } from 'common/enum'
import { dateFormat } from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'
import {
	IFilterForm,
	ICryptoNetwork,
	ICryptoCurrency,
} from 'features/blockCryptoWallet/type'

const { Panel } = Collapse
const { Option } = Select
const { RangePicker } = DatePicker

interface IBlockCryptoWalletFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	timeZoneUtcOffset: number
	cryptoNetworkList: ICryptoNetwork[]
	cryptoCurrencyList: ICryptoCurrency[]
	blockStatusEnumList: IEnumTypeData[]
	onSearch: ({
		currentTimeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const BlockCryptoWalletFilter = ({
	form,
	loading,
	cryptoNetworkList,
	timeZoneUtcOffset,
	cryptoCurrencyList,
	blockStatusEnumList,
	onSearch,
	onTimeZoneChange,
}: IBlockCryptoWalletFilterProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const currencySelector = () => {
		const handleChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyId: currencyListBySite?.map(({ currencyId }) => currencyId),
				})
			} else {
				form.setFieldsValue({
					currencyId: newCurrencyIds,
				})
			}
		}

		return (
			<Form.Item name='currencyId' label={t('Label_Currency')}>
				<MultipleSelect
					placeholder={t('Label_Select') + t('Label_Currency')}
					onChange={handleChangeCurrency}
				>
					{currencyListBySite?.length > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}
					{currencyListBySite?.map(({ currencyId, isoCode }) => (
						<Option key={currencyId} value={currencyId}>
							{isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const statusSelector = () => {
		return (
			<Form.Item name='status' label={t('Label_Status')}>
				<Select placeholder={t('Label_Select') + t('Label_Status')}>
					{blockStatusEnumList?.map(({ name, value }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	const cryptoTypeSelector = () => {
		const handleChangeCryptoType = (newCryptoTyps: number[]) => {
			if (newCryptoTyps.includes(0)) {
				form.setFieldsValue({
					cryptoType: cryptoCurrencyList?.map(({ currencyId }) => currencyId),
				})
			} else {
				form.setFieldsValue({
					cryptoType: newCryptoTyps,
				})
			}
		}

		return (
			<Form.Item name='cryptoType' label={t('Label_CryptoType')}>
				<MultipleSelect
					placeholder={t('Label_Select') + t('Label_CryptoType')}
					onChange={handleChangeCryptoType}
				>
					{cryptoCurrencyList?.length > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}
					{cryptoCurrencyList?.map(({ currencyId, currencyName }) => (
						<Option key={currencyId} value={currencyId}>
							{currencyName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const networkSelector = () => {
		const handleChangeNetwork = (newNetworks: number[]) => {
			if (newNetworks.includes(0)) {
				form.setFieldsValue({
					network: cryptoNetworkList?.map(({ networkType }) => networkType),
				})
			} else {
				form.setFieldsValue({
					network: newNetworks,
				})
			}
		}

		return (
			<Form.Item name='network' label={t('Label_Network')}>
				<MultipleSelect
					placeholder={t('Label_Select') + t('Label_Network')}
					onChange={handleChangeNetwork}
				>
					{cryptoNetworkList?.length > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}
					{cryptoNetworkList
						// remove repetitive USDC ERC20 & TRC20 network
						?.filter(({ currencyId }) => currencyId !== 97)
						?.map(({ networkType, network }) => {
							return (
								<Option key={networkType} value={networkType}>
									{network}
								</Option>
							)
						})}
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
							currencyId: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={12} md={24} xs={24}>
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
								{currencySelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{statusSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{cryptoTypeSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								{networkSelector()}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='address' label={t('Label_WalletAddress')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>
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

export { BlockCryptoWalletFilter }

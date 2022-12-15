import { IEnumTypeData } from 'common/service/enumApi'
import { useTranslation } from 'react-i18next'
import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Row,
	Select,
	Spin,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { IGetGlobalStatusData } from 'features/paymentManagement/type'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import { SearchOutlined } from '@ant-design/icons'

interface IPaymentManagementFilterProps {
	filterLoading: boolean
	loading: boolean
	methodList: IEnumTypeData[]
	typeList: IEnumTypeData[]
	globalStatusList: IEnumTypeData[]
	payList: IGetGlobalStatusData[]
	currencyListBySite: Currency[]
	form: FormInstance
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	onSetGlobalStatusClicked: () => void
	onSetCryptoInfoClicked: () => void
}

const { Panel } = Collapse
const { Option } = Select

const PaymentManagementFilter = ({
	filterLoading,
	loading,
	methodList,
	typeList,
	globalStatusList,
	form,
	onSearch,
	payList,
	currencyListBySite,
	onSetCryptoInfoClicked,
	onSetGlobalStatusClicked,
}: IPaymentManagementFilterProps) => {
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

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<Spin spinning={filterLoading}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							form={form}
							layout='vertical'
							size='middle'
							onFinish={() => onSearch({})}
							initialValues={{
								method: 'all',
								payId: 'all',
								type: 'all',
								globalStatus: 'all',
								status: 'all',
								currencyIds: currencyListBySite?.map(
									currency => currency.currencyId
								),
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									{currencyIdsSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='method' label={t('Label_MethodType')}>
										<Select>
											<Option key='all' value='all'>
												{t('Label_All')}
											</Option>
											{methodList?.map(method => (
												<Option key={method.value} value={method.value}>
													{method.name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='payId' label={t('Label_GateWay')}>
										<Select>
											<Option key='all' value='all'>
												{t('Label_All')}
											</Option>
											{payList?.map(pay => (
												<Option key={pay.payId} value={pay.payId}>
													{pay.payName}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='type' label={t('Label_Type')}>
										<Select>
											<Option key='all' value='all'>
												{t('Label_All')}
											</Option>
											{typeList?.map(type => (
												<Option key={type.value} value={type.value}>
													{type.name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item
										name='globalStatus'
										label={t('Label_GlobalStatus')}
									>
										<Select>
											<Option key='all' value='all'>
												{t('Label_All')}
											</Option>
											{globalStatusList?.map(type => (
												<Option key={type.value} value={type.value}>
													{type.name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='status' label={t('Label_Status')}>
										<Select>
											<Option key='all' value='all'>
												{t('Label_All')}
											</Option>
											{globalStatusList?.map(type => (
												<Option key={type.value} value={type.value}>
													{type.name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<br />
							<Row justify='end' align='middle' gutter={16}>
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
								<Col>
									<Button
										type='primary'
										onClick={onSetGlobalStatusClicked}
									>{`${t('Label_Set')} ${t('Label_GlobalStatus')}`}</Button>
								</Col>
								<Col>
									<Button type='primary' onClick={onSetCryptoInfoClicked}>
										{t('Label_CryptoSetting')}
									</Button>
								</Col>
							</Row>
						</Form>
					</LayoutContent.Card>
				</Spin>
			</Panel>
		</Collapse>
	)
}

export { PaymentManagementFilter }

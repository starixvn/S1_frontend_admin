import { FC } from 'react'
import { IEnumTypeData } from 'common/service/enumApi/type'
import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import { selectCurrencyListBySite } from 'common/enum'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'
import { onEnumApiMultipleSelectChange } from 'common/utils'
import { SearchOutlined } from '@ant-design/icons'
import { IBankInfoSysData } from 'common/service/allDataApi/type'

const { Panel } = Collapse
const { Option } = Select

interface TransferAccountManagementFilterProps {
	loading: boolean
	form: FormInstance
	transferChannelEnum: IEnumTypeData[]
	transferAccountStatusEnum: IEnumTypeData[]
	transferAccountPurposeEnum: IEnumTypeData[]
	bankInfoSys: IBankInfoSysData[]
	onChangeCurrency: (newCurrencyIds: number[]) => void
	onChangeSysIds: (newSysIds: number[]) => void
	onSearch: () => void
}

const TransferAccountManagementFilter: FC<
	TransferAccountManagementFilterProps
> = ({
	loading,
	form,
	transferChannelEnum,
	transferAccountStatusEnum,
	transferAccountPurposeEnum,
	bankInfoSys,
	onChangeCurrency,
	onChangeSysIds,
	onSearch,
}) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						initialValues={{
							currencyIds: currencyListBySite.map(
								currency => currency.currencyId
							),
							channels: [],
							status: [],
							purposes: [],
							sysIds: [],
							accountNo: '',
							agent: '',
						}}
						onFinish={onSearch}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='currencyIds' label={t('Label_Currency')}>
									<MultipleSelect
										optionFilterProp='children'
										onChange={newCurrencyIds => {
											onChangeCurrency(newCurrencyIds)
											// * sysIds 會跟著 currencyIds 異動，故清除
											form.setFieldsValue({ sysIds: [] })
										}}
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
								<Form.Item name='sysIds' label={t('Label_Bank')}>
									<MultipleSelect
										optionFilterProp='children'
										onChange={onChangeSysIds}
									>
										{(bankInfoSys?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}

										{bankInfoSys?.map(item => (
											<Option key={item.sysId} value={item.sysId}>
												{item.bankName}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='channels' label={t('Label_Channel')}>
									<MultipleSelect
										optionFilterProp='children'
										onChange={newValues =>
											onEnumApiMultipleSelectChange(
												newValues,
												transferChannelEnum,
												form,
												'channels'
											)
										}
									>
										{(transferChannelEnum?.length as number) > 1 && (
											<Option value='all'>{t('Label_SelectAll')}</Option>
										)}

										{transferChannelEnum?.map(item => (
											<Option key={item.value} value={item.value}>
												{item.name}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='status' label={t('Label_Status')}>
									<MultipleSelect
										optionFilterProp='children'
										onChange={newValues =>
											onEnumApiMultipleSelectChange(
												newValues,
												transferChannelEnum,
												form,
												'status'
											)
										}
									>
										{(transferAccountStatusEnum?.length as number) > 1 && (
											<Option value='all'>{t('Label_SelectAll')}</Option>
										)}

										{transferAccountStatusEnum?.map(item => (
											<Option key={item.value} value={item.value}>
												{item.name}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='purposes' label={t('Label_Purposes')}>
									<MultipleSelect
										optionFilterProp='children'
										onChange={newValues =>
											onEnumApiMultipleSelectChange(
												newValues,
												transferChannelEnum,
												form,
												'purposes'
											)
										}
									>
										{(transferAccountPurposeEnum?.length as number) > 1 && (
											<Option value='all'>{t('Label_SelectAll')}</Option>
										)}

										{transferAccountPurposeEnum?.map(item => (
											<Option key={item.value} value={item.value}>
												{item.name}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='accountNo' label={t('Label_AccountNo')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='agent' label={t('Label_Agent')}>
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

export default TransferAccountManagementFilter

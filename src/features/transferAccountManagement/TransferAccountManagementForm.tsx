import { FC } from 'react'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import {
	Col,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
} from 'antd'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	selectBankInfoSysByCurrencyIds,
	useGetBankInfoSysQuery,
} from 'common/service/allDataApi'
import { onEnumApiMultipleSelectChange } from 'common/utils'
import {
	useGetBankTransferAccountPayListQuery,
	useGetBankTransferAccountReasonsQuery,
} from './api'
import { IAddEditForm } from './type'

const { Option } = Select

interface ITransferAccountManagementFormProps {
	form: FormInstance<IAddEditForm>
	loading: boolean
	agentList: string[]
}

const TransferAccountManagementForm: FC<
	ITransferAccountManagementFormProps
> = ({ form, loading, agentList }) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const formCurrencyId = Form.useWatch('currencyId', form)
	const formChannel = Form.useWatch('channel', form)

	const {
		data: { data: transferAccountStatusEnum = [] } = {},
		isFetching: isGetTransferAccountStatusEnumFetching,
	} = useGetEnumTypeQuery({ enumName: 'TransferAccountStatusEnum' })

	const {
		data: { data: transferAccountPurposeEnum = [] } = {},
		isFetching: isGetTransferAccountPurposeEnumFetching,
	} = useGetEnumTypeQuery({ enumName: 'TransferAccountPurposeEnum' })

	const {
		data: { data: transferChannelEnum = [] } = {},
		isFetching: isGetTransferChannelEnumFetching,
	} = useGetEnumTypeQuery({ enumName: 'TransferChannelEnum' })

	const { bankInfoSys, isFetching: isGetBankInfoSysFetching } =
		useGetBankInfoSysQuery(null, {
			selectFromResult: selectBankInfoSysByCurrencyIds([formCurrencyId]),
		})

	const { data: { data: transferAccountReasons } = {} } =
		useGetBankTransferAccountReasonsQuery(null)

	const { data: { data: transferAccountPayList } = {} } =
		useGetBankTransferAccountPayListQuery(null)

	const enumLoading =
		isGetTransferChannelEnumFetching ||
		isGetTransferAccountStatusEnumFetching ||
		isGetTransferAccountPurposeEnumFetching ||
		isGetBankInfoSysFetching

	return (
		<Spin spinning={enumLoading || loading}>
			<LayoutContent.Card>
				<Form
					layout='vertical'
					size='middle'
					form={form}
					initialValues={{
						currencyId: null,
						sysId: null,
						channel: null,
						status: null,
						purposes: [],
						accountNo: '',
						agent: '',
						accountCode: '',
						displayName: '',
						initialAmount: null,
						maxBalanceAlertAmount: null,
						reason: null,
						remark: '',
						payId: null,
						bankLoginUrl: '',
						bankLoginAccount: '',
						bankLoginPassword: '',
					}}
				>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='currencyId'
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
								<Select placeholder={t('Label_Currency')}>
									{currencyListBySite?.map(({ currencyId, isoCode }) => (
										<Option key={currencyId} value={currencyId}>
											{isoCode}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='sysId'
								label={t('Label_Bank')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Bank'),
										}),
									},
								]}
							>
								<Select placeholder={t('Label_Bank')}>
									{bankInfoSys?.map(({ sysId, bankName }) => (
										<Option key={sysId} value={sysId}>
											{bankName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='channel'
								label={t('Label_Channel')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Channel'),
										}),
									},
								]}
							>
								<Select placeholder={t('Label_Channel')}>
									{transferChannelEnum?.map(({ value, name }) => (
										<Option key={value} value={value}>
											{name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						{formChannel === 3 ? (
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='payId' label={t('Label_Pay')}>
									<Select placeholder={t('Label_Pay')}>
										{transferAccountPayList?.map(({ id, payName }) => (
											<Option key={id} value={id}>
												{payName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						) : (
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='agent' label={t('Label_Agent')}>
									<Select
										showSearch
										allowClear
										style={{ width: '100%' }}
										filterOption={(input, option) => {
											const isIncludes: boolean = (
												option!.children as unknown as string
											)
												.toLowerCase()
												.includes(input.toLowerCase())

											if (!isIncludes) {
												form.setFieldsValue({
													agent: input,
												})
											}

											return isIncludes
										}}
									>
										{agentList?.map(value => (
											<Option key={value} value={value}>
												{value}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						)}
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='status'
								label={t('Label_Status')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Status'),
										}),
									},
								]}
							>
								<Select placeholder={t('Label_Status')}>
									{transferAccountStatusEnum?.map(({ value, name }) => (
										<Option key={value} value={value}>
											{name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='purposes'
								label={t('Label_Purposes')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Purposes'),
										}),
									},
								]}
							>
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
							<Form.Item
								name='accountNo'
								label={t('Label_AccountNo')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AccountNo'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='accountName'
								label={t('Label_AccountName')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AccountName'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						{formCurrencyId === 61 && (
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='accountCode' label={t('Label_IFSC')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						)}
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='displayName'
								label={t('Label_DisplayName')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_DisplayName'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='initialAmount'
								label={t('Label_InitialAmount')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_InitialAmount'),
										}),
									},
								]}
							>
								<InputNumber style={{ width: '100%' }} type='number' />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='maxBalanceAlertAmount'
								label={t('Label_MaxBalanceAlertAmount')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_MaxBalanceAlertAmount'),
										}),
									},
								]}
							>
								<InputNumber style={{ width: '100%' }} type='number' />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='reason' label={t('Label_Reason')}>
								<Select placeholder={t('Label_Reason')} allowClear>
									{transferAccountReasons?.map(({ reasonId, description }) => (
										<Option key={reasonId} value={reasonId}>
											{description}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='remark' label={t('Label_Remark')}>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='bankLoginUrl' label={t('Label_BankLoginUrl')}>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='bankLoginAccount'
								label={t('Label_BankLoginAccount')}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='bankLoginPassword'
								label={t('Label_BankLoginPassword')}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</LayoutContent.Card>
		</Spin>
	)
}

export default TransferAccountManagementForm

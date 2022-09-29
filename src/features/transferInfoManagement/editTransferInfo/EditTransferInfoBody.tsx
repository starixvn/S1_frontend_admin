import {
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
	Spin,
	Typography,
	Upload,
	FormInstance,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
	TransactionTypeEnum,
	TransferChannelEnum,
} from 'features/transferInfoManagement/constants'
import { Currency } from 'common/enum/type'
import { IEnumTypeData } from 'common/service/enumApi'
import {
	IGetBankInfoData,
	IGetTransferAccountListData,
} from 'features/transferInfoManagement/type'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { timeFormat } from 'common/utils/format'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { find } from 'lodash'
import { useEffect, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

interface IEditTransferInfoBodyProps {
	loading: boolean
	form: FormInstance
	currencyListBySite: Currency[]
	transferChannelList: IEnumTypeData[]
	accountList: IGetTransferAccountListData[]
	bankCodeList: IGetBankInfoData[]
	isEditing: boolean
	timeZoneUtcOffset: number
}

const { Option } = Select

const EditTransferInfoBody = ({
	loading,
	form,
	currencyListBySite,
	transferChannelList,
	accountList,
	isEditing,
	timeZoneUtcOffset,
	bankCodeList,
}: IEditTransferInfoBodyProps) => {
	const { t } = useTranslation()
	const transactionType = Form.useWatch('transactionType', form)
	const fromCurrencyId = Form.useWatch('fromCurrencyId', form)
	const toCurrencyId = Form.useWatch('toCurrencyId', form)
	const fromChannel = Form.useWatch('fromChannel', form)
	const toChannel = Form.useWatch('toChannel', form)
	const fromSysId = Form.useWatch('fromSysId', form)
	const toSysId = Form.useWatch('toSysId', form)

	const [fileList, setFileList] = useState<UploadFile[]>([])
	// 加 true 才能拿到 沒有渲染在畫面上的資料
	const {
		createTime,
		creatorName,
		updateTime,
		updatorName,
		receiptUrl: initReceiptUrl,
	} = form.getFieldsValue(true)

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{t('Label_Receipt')}</div>
		</div>
	)

	const props: UploadProps = {
		onPreview: () => false,
		onRemove: () => {
			setFileList([])
			form.setFieldsValue({
				fileList: [],
			})
		},
		accept: 'image/*',
		beforeUpload: file => {
			form.setFieldsValue({
				fileList: [file],
			})
			return false
		},
		onChange: ({ fileList: [file] }) => {
			if (file) {
				setFileList([file])
			} else {
				setFileList([])
			}
		},
		fileList,
	}

	useEffect(() => {
		if (!initReceiptUrl) return
		const initFileList: UploadFile[] = [
			{
				uid: uuidV4(),
				name: initReceiptUrl?.split('/').pop() ?? 'receipt',
				url: initReceiptUrl,
			},
		]
		form.setFieldsValue({
			fileList: initFileList,
		})
		setFileList(initFileList)
	}, [initReceiptUrl])

	return (
		<Spin spinning={loading}>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					fileList: [],
				}}
			>
				{transactionType !== TransactionTypeEnum.Plus && (
					<Card title={t('Label_From')} style={{ marginTop: '20px' }}>
						<Row gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromCurrencyId'
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
									<Select
										placeholder={t('Label_Select') + t('Label_Currency')}
										onChange={() => {
											form.resetFields([
												'fromSysId',
												'fromAccountDisplayName',
												'fromAccountNo',
												'fromAgent',
												'fromPayName',
												'fromPayId',
											])
										}}
									>
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromChannel'
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
									<Select
										placeholder={t('Label_Select') + t('Label_Channel')}
										onChange={() => {
											form.resetFields([
												'fromAccountDisplayName',
												'fromAccountNo',
												'fromAgent',
												'fromPayName',
												'fromPayId',
											])
										}}
									>
										{transferChannelList?.map(channel => (
											<Option key={channel.value} value={channel.value}>
												{channel.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromSysId'
									label={t('Label_BankCode')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_BankCode'),
											}),
										},
									]}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_BankCode')}
										disabled={!fromCurrencyId}
										onChange={() => {
											form.resetFields([
												'fromAccountDisplayName',
												'fromAccountNo',
												'fromAgent',
												'fromPayName',
												'fromPayId',
											])
										}}
									>
										{bankCodeList
											?.filter(bank => bank.currencyId === fromCurrencyId)
											.map(filterBank => (
												<Option key={filterBank.sysId} value={filterBank.sysId}>
													{filterBank.bankName}
												</Option>
											))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromAccountDisplayName'
									label={t('Label_Account')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Account'),
											}),
										},
									]}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Account')}
										onChange={value => {
											const currentAccount = find(
												accountList,
												acc => acc.displayName === value
											)
											if (currentAccount) {
												form.setFieldsValue({
													fromAccountNo: currentAccount.accountNo,
													fromAgent: currentAccount.agent,
													fromPayName: currentAccount.payName,
													fromPayId: currentAccount.payId,
												})
											}
										}}
										// 以上三者都有值時才開放選擇
										disabled={!fromSysId || !fromChannel || !fromCurrencyId}
									>
										{/* 全符合才 show  , 編輯時只顯示 status === 2  */}
										{accountList
											?.filter(
												raw =>
													raw.status === 2 &&
													raw.channel === fromChannel &&
													raw.currencyId === fromCurrencyId &&
													raw.sysId === fromSysId
											)
											.map(account => (
												<Option
													key={account.displayName}
													value={account.displayName}
												>
													{account.displayName}
												</Option>
											))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{fromChannel === TransferChannelEnum.PSP ? (
									<Form.Item name='fromPayName' label={t('Label_Pay')}>
										<Input disabled />
									</Form.Item>
								) : (
									<Form.Item name='fromAgent' label={t('Label_Agent')}>
										<Input disabled />
									</Form.Item>
								)}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='fromAccountNo' label={t('Label_AccountNo')}>
									<Input disabled />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={12}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromAmount'
									label={t('Label_Amount')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Amount'),
											}),
										},
									]}
								>
									<InputNumber
										type='number'
										controls={false}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='fromFee'
									label={t('Label_Fee')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Fee'),
											}),
										},
									]}
								>
									<InputNumber
										type='number'
										controls={false}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Card>
				)}
				{transactionType !== TransactionTypeEnum.Minus && (
					<Card title={t('Label_To')} style={{ marginTop: '20px' }}>
						<Row gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toCurrencyId'
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
									<Select
										placeholder={t('Label_Select') + t('Label_Currency')}
										onChange={() => {
											form.resetFields([
												'toSysId',
												'toAccountDisplayName',
												'toAccountNo',
												'toAgent',
												'toPayName',
												'toPayId',
											])
										}}
									>
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toChannel'
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
									<Select
										placeholder={t('Label_Select') + t('Label_Channel')}
										onChange={() => {
											form.resetFields([
												'toAccountDisplayName',
												'toAccountNo',
												'toAgent',
												'toPayName',
												'toPayId',
											])
										}}
									>
										{transferChannelList?.map(channel => (
											<Option key={channel.value} value={channel.value}>
												{channel.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toSysId'
									label={t('Label_BankCode')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_BankCode'),
											}),
										},
									]}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_BankCode')}
										disabled={!toCurrencyId}
										onChange={() => {
											form.resetFields([
												'toAccountDisplayName',
												'toAccountNo',
												'toAgent',
												'toPayName',
												'toPayId',
											])
										}}
									>
										{bankCodeList
											?.filter(bank => bank.currencyId === toCurrencyId)
											.map(filterBank => (
												<Option key={filterBank.sysId} value={filterBank.sysId}>
													{filterBank.bankName}
												</Option>
											))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toAccountDisplayName'
									label={t('Label_Account')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Account'),
											}),
										},
									]}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_Account')}
										onChange={value => {
											const currentAccount = find(
												accountList,
												acc => acc.displayName === value
											)
											if (currentAccount) {
												form.setFieldsValue({
													toAccountNo: currentAccount.accountNo,
													toAgent: currentAccount.agent,
													toPayName: currentAccount.payName,
													toPayId: currentAccount.payId,
												})
											}
										}}
										disabled={!toSysId || !toChannel || !toCurrencyId}
									>
										{accountList
											?.filter(
												raw =>
													raw.status === 2 &&
													raw.currencyId === toCurrencyId &&
													raw.channel === toChannel &&
													raw.sysId === toSysId
											)
											.map(account => (
												<Option
													key={account.displayName}
													value={account.displayName}
												>
													{account.displayName}
												</Option>
											))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								{toChannel === TransferChannelEnum.PSP ? (
									<Form.Item name='toPayName' label={t('Label_Pay')}>
										<Input disabled />
									</Form.Item>
								) : (
									<Form.Item name='toAgent' label={t('Label_Agent')}>
										<Input disabled />
									</Form.Item>
								)}
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='toAccountNo' label={t('Label_AccountNo')}>
									<Input disabled />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={12}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toAmount'
									label={t('Label_Amount')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Amount'),
											}),
										},
									]}
								>
									<InputNumber
										type='number'
										controls={false}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='toFee'
									label={t('Label_Fee')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Fee'),
											}),
										},
									]}
								>
									<InputNumber
										type='number'
										controls={false}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Card>
				)}
				<Card
					title={t('Label_Upload', { key: t('Label_Receipt') })}
					style={{ marginTop: '20px', marginBottom: '20px' }}
				>
					<Row>
						<Col lg={12} md={24} xs={24}>
							<Upload {...props} listType='picture-card'>
								{fileList?.length >= 1 ? null : uploadButton}
							</Upload>
						</Col>
					</Row>

					{isEditing && (
						<>
							<Row style={{ marginTop: '20px' }} gutter={16}>
								<Space>
									<Typography.Text>
										{`${t('Label_CreateTime')} : ${moment(createTime)
											.utcOffset(timeZoneUtcOffset)
											.format(timeFormat)}`}
									</Typography.Text>
									<Typography.Text>
										{`${t('Label_Creator')} : ${creatorName ?? '-'}`}
									</Typography.Text>
								</Space>
							</Row>
							<Row gutter={16}>
								<Space>
									<Typography.Text>
										{`${t('Label_UpdateTime')} : ${moment(updateTime)
											.utcOffset(timeZoneUtcOffset)
											.format(timeFormat)}`}
									</Typography.Text>
									<Typography.Text>
										{`${t('Label_Update')} : ${updatorName ?? '-'}`}
									</Typography.Text>
								</Space>
							</Row>
						</>
					)}
				</Card>
			</Form>
		</Spin>
	)
}

export { EditTransferInfoBody }

import {
	IGetWithdrawalData,
	IWithdrawalRequestForm,
} from 'features/withdrawalOperator/type'
import { useTranslation } from 'react-i18next'
import {
	Descriptions,
	Form,
	FormInstance,
	Row,
	Select,
	Tag,
	Typography,
} from 'antd'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons'
import moment from 'moment/moment'
import {
	AccountTypeEnum,
	WITHDRAWAL_STATUS_TAGS_COLOR,
	WITHDRAWAL_TYPE_NAMES,
	WithdrawalStatusEnum,
	WithdrawalTypeEnum,
} from 'features/withdrawalOperator/constants'
import { isJSON, multiEqual } from 'common/utils'
import { find, head } from 'lodash'
import { useCopy } from 'common/hooks'
import {
	IBankInfoOffState,
	ICryptoPayData,
	ICryptoWalletData,
	IOnlinePayData,
} from 'common/service/baseDataApi/type'

interface IWithdrawalInfoDescriptionsProps {
	form: FormInstance<IWithdrawalRequestForm>
	timeZoneUtcOffset: number
	withdrawalDetailData?: IGetWithdrawalData
	localBankList: IBankInfoOffState[]
	eWalletList: IOnlinePayData[]
	cryptoPayList: ICryptoPayData[]
	onlinePayList: IOnlinePayData[]
	cryptoWalletList: ICryptoWalletData[]
	onPayInfoClicked: (
		record: IOnlinePayData | ICryptoPayData | IBankInfoOffState
	) => void
}

const { Item } = Descriptions
const { Option } = Select

const WithdrawalRequestInfo = ({
	form,
	timeZoneUtcOffset,
	withdrawalDetailData,
	cryptoWalletList,
	cryptoPayList,
	eWalletList,
	onlinePayList,
	localBankList,
	onPayInfoClicked,
}: IWithdrawalInfoDescriptionsProps) => {
	const { t } = useTranslation()
	const { onCopy } = useCopy()
	const {
		amount = 0,
		statusName,
		status,
		createTime,
		bankName = '',
		accountNo = '',
		accountName,
		ifscCode,
		updateTime,
		flowEndTime,
		transId,
		accountType,
		cryptoCurrency,
		network,
		withdrawalType: responseType,
		withdrawalTypeName,
		payName: responsePayName,
		payId: responsePayId,
		refId,
		eWalletName,
		withdrawalInfo: rawWithdrawalInfo,
		processWayName,
	} = withdrawalDetailData ?? {}

	const withdrawalInfo = isJSON(rawWithdrawalInfo)
		? JSON.parse(rawWithdrawalInfo as string)
		: {}

	const color = WITHDRAWAL_STATUS_TAGS_COLOR[status as WithdrawalStatusEnum]
	const isApproved = status === WithdrawalStatusEnum.Approved
	const isProcess = status === WithdrawalStatusEnum.Process
	const type = Form.useWatch('withdrawalType', form)
	const currentSelId = Form.useWatch('selId', form)

	// crypto 會用到的資料
	const cryptoAmount = isApproved
		? withdrawalInfo?.ExchangeAmount ?? ''
		: withdrawalInfo?.TempExchangeAmount ?? ''

	// accountType
	const isCrypto = accountType === AccountTypeEnum.Crypto
	const isEWallet = accountType === AccountTypeEnum.EWallet

	// 檢查是否有 list 可以使用
	const hasLocalBank = localBankList?.length > 0
	const hasOnlinePayment = onlinePayList?.length > 0
	const hasCryptoPay = cryptoPayList?.length > 0
	const hasCryptoWallet = cryptoWalletList?.length > 0
	const hasEWallet = eWalletList?.length > 0

	// WithdrawalType 下拉選單邏輯寫在這
	const getWithdrawalTypeOptions = () => {
		const result: JSX.Element[] = []
		if (isCrypto) {
			if (hasCryptoPay) {
				result.push(
					<Option
						value={WithdrawalTypeEnum.CryptoPay}
						key={WithdrawalTypeEnum.CryptoPay}
					>
						{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.CryptoPay])}
					</Option>
				)
			}
			if (hasCryptoWallet) {
				result.push(
					<Option
						value={WithdrawalTypeEnum.CryptoWallet}
						key={WithdrawalTypeEnum.CryptoWallet}
					>
						{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.CryptoWallet])}
					</Option>
				)
			}
		} else if (isEWallet) {
			if (hasLocalBank) {
				result.push(
					<Option
						value={WithdrawalTypeEnum.LocalBank}
						key={WithdrawalTypeEnum.LocalBank}
					>
						{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.LocalBank])}
					</Option>
				)
			}
			if (hasEWallet) {
				result.push(
					<Option
						value={WithdrawalTypeEnum.EWalletPayment}
						key={WithdrawalTypeEnum.EWalletPayment}
					>
						{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.EWalletPayment])}
					</Option>
				)
			}
		} else {
			if (hasLocalBank) {
				result.push(
					<Option
						value={WithdrawalTypeEnum.LocalBank}
						key={WithdrawalTypeEnum.LocalBank}
					>
						{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.LocalBank])}
					</Option>
				)
			}
			if (hasOnlinePayment) {
				result.push(
					<Option
						value={WithdrawalTypeEnum.OnlinePayment}
						key={WithdrawalTypeEnum.OnlinePayment}
					>
						{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.OnlinePayment])}
					</Option>
				)
			}
		}
		return result
	}

	const getPaymentOptions = () => {
		if (type === WithdrawalTypeEnum.OnlinePayment) {
			// onlinePayment
			return onlinePayList?.map(({ payId, payName }) => (
				<Option value={payId} key={payId}>
					{payName}
				</Option>
			))
		}

		if (type === WithdrawalTypeEnum.EWalletPayment) {
			if (isEWallet) {
				// ewallet
				return eWalletList?.map(({ payId, payName }) => (
					<Option value={payId} key={payId}>
						{payName}
					</Option>
				))
			}
		}
		// cryptoPay
		return cryptoPayList?.map(({ payId, payName }) => (
			<Option value={payId} key={payId}>
				{payName}
			</Option>
		))
	}
	return (
		<Descriptions
			bordered
			size='small'
			layout='horizontal'
			column={1}
			title={t('MemberProfile.Menu.Finance.Label_WithdrawalInfo')}
		>
			<Item label={t('Label_TransactionNo')}>{transId}</Item>
			<Item label={t('Label_RequestAmount')}>
				<Row justify='space-between'>
					{numFormatToDigits(amount)}
					<Typography.Link
						disabled={!amount}
						onClick={() => onCopy(String(amount))}
					>
						<CopyOutlined style={{ fontSize: '1.5rem' }} />
					</Typography.Link>
				</Row>
			</Item>
			{isCrypto && (
				<Item
					label={
						isApproved ? t('Label_ActualCryptoAmount') : t('Label_CryptoAmount')
					}
				>
					<Row justify='space-between'>
						{cryptoAmount}
						{/* 轉成 Boolean 才做判斷 */}
						{!!cryptoAmount && (
							<Typography.Link
								disabled={!cryptoAmount}
								onClick={() => onCopy(String(cryptoAmount))}
							>
								<CopyOutlined style={{ fontSize: '1.5rem' }} />
							</Typography.Link>
						)}
					</Row>
				</Item>
			)}
			<Item label={t('Label_Status')}>
				<Tag color={color}>{statusName || '-'}</Tag>
			</Item>
			<Item label={t('Label_ProcessWay')}>
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{processWayName ?? '-'}
				</Typography.Text>
			</Item>
			<Item label={t('Label_CreateTime')}>
				{createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				)}
			</Item>
			{/* Crypto  */}
			{isCrypto && (
				<>
					<Item label={t('Label_AccountType')}>{cryptoCurrency}</Item>
					<Item label={t('Label_NetWork')}>{network}</Item>
				</>
			)}
			{/* Ewallet */}
			{isEWallet && (
				<>
					<Item label={t('Label_AccountType')}>{accountType}</Item>
					<Item label={t('Label_NameOfEwallet')}>
						<Row justify='space-between'>
							{eWalletName}
							<Typography.Link
								disabled={!eWalletName}
								onClick={() => onCopy(eWalletName as string)}
							>
								<CopyOutlined style={{ fontSize: '1.5rem' }} />
							</Typography.Link>
						</Row>
					</Item>
				</>
			)}
			{/* else */}
			{!isCrypto && !isEWallet && (
				<Item label={t('Label_NameOfBank')}>
					<Row justify='space-between'>
						{bankName}
						<Typography.Link
							disabled={!bankName}
							onClick={() => onCopy(bankName)}
						>
							<CopyOutlined style={{ fontSize: '1.5rem' }} />
						</Typography.Link>
					</Row>
				</Item>
			)}

			<Item label={t('Label_AccountNo')}>
				<Row justify='space-between'>
					{accountNo}
					<Typography.Link
						disabled={!accountNo}
						onClick={() => onCopy(accountNo)}
					>
						<CopyOutlined style={{ fontSize: '1.5rem' }} />
					</Typography.Link>
				</Row>
			</Item>
			<Item label={t('Label_AccountName')}>{accountName}</Item>
			<Item label={t('Label_RefId')}>{refId || '-'}</Item>
			<Item label={t('Label_IFSCode')}>{ifscCode ?? '-'}</Item>
			<Item label={`${t('Label_UpdateTime')} (+08:00)`}>
				{updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(updateTime).utcOffset(8).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				)}
			</Item>
			<Item label={`${t('Label_FlowEndTime')} (+08:00)`}>
				{flowEndTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(flowEndTime).utcOffset(8).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				)}
			</Item>
			{/* Process 或 Approved 單純渲染response給的資料  */}
			{multiEqual(status, [
				WithdrawalStatusEnum.Process,
				WithdrawalStatusEnum.Approved,
			]) && (
				<>
					<Item label={t('Label_WithdrawalType')}>{withdrawalTypeName}</Item>
					{multiEqual(responseType, [
						WithdrawalTypeEnum.CryptoPay,
						WithdrawalTypeEnum.OnlinePayment,
					]) && (
						<Item label={t('Label_Pay')}>
							<Row justify='space-between' align='middle'>
								{responsePayName}
								<Typography.Link
									onClick={() => {
										if (responseType === WithdrawalTypeEnum.OnlinePayment) {
											const record = find(
												onlinePayList,
												item => item.payId === responsePayId
											)
											if (record !== undefined) {
												onPayInfoClicked(record)
											}
										} else if (responseType === WithdrawalTypeEnum.CryptoPay) {
											const record = find(
												cryptoPayList,
												item => item.payId === responsePayId
											)
											if (record !== undefined) {
												onPayInfoClicked(record)
											}
										}
									}}
									disabled={!responsePayId}
								>
									<InfoCircleOutlined style={{ fontSize: '1rem' }} />
								</Typography.Link>
							</Row>
						</Item>
					)}
				</>
			)}
			{/* Verify 狀態才可以有下拉選擇  */}
			{multiEqual(status, [WithdrawalStatusEnum.Verify]) && (
				<>
					<Item label={t('Label_WithdrawalType')}>
						<Form.Item name='withdrawalType' noStyle>
							<Select
								disabled={isApproved || isProcess}
								placeholder={t('Label_Select') + t('Label_WithdrawalType')}
								style={{ width: 'calc(100% - 64px)' }}
								onChange={value => {
									if (value === WithdrawalTypeEnum.OnlinePayment) {
										form.setFieldsValue({
											selId: head(onlinePayList)?.payId,
										})
									} else if (value === WithdrawalTypeEnum.CryptoPay) {
										form.setFieldsValue({
											selId: head(cryptoPayList)?.payId,
										})
									} else if (value === WithdrawalTypeEnum.EWalletPayment) {
										form.setFieldsValue({
											selId: head(eWalletList)?.payId,
										})
									}
								}}
							>
								{/* 這裡因為 Option 要判斷關聯下拉是否有內容才顯示，故此處寫死 */}
								<Option
									value={WithdrawalTypeEnum.Undefined}
									key={WithdrawalTypeEnum.Undefined}
								>
									{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.Undefined])}
								</Option>
								{getWithdrawalTypeOptions()}
							</Select>
						</Form.Item>
					</Item>
					{multiEqual(type, [
						WithdrawalTypeEnum.CryptoPay,
						WithdrawalTypeEnum.OnlinePayment,
						WithdrawalTypeEnum.EWalletPayment,
					]) && (
						<Item label={t('Label_Select') + t('Label_Pay')}>
							<Row justify='space-between' align='middle'>
								<Form.Item name='selId' noStyle>
									<Select
										disabled={isApproved || isProcess}
										placeholder={t('Label_Select') + t('Label_Pay')}
										style={{ width: 'calc(100% - 64px)' }}
									>
										{getPaymentOptions()}
									</Select>
								</Form.Item>
								<Typography.Link
									onClick={() => {
										if (type === WithdrawalTypeEnum.OnlinePayment) {
											if (isEWallet) {
												// eWallet
												const record = find(
													eWalletList,
													item => item.payId === currentSelId
												)
												if (record !== undefined) {
													onPayInfoClicked(record)
												}
											} else {
												const record = find(
													onlinePayList,
													item => item.payId === currentSelId
												)
												if (record !== undefined) {
													onPayInfoClicked(record)
												}
											}
										} else if (type === WithdrawalTypeEnum.CryptoPay) {
											const record = find(
												cryptoPayList,
												item => item.payId === currentSelId
											)
											if (record !== undefined) {
												onPayInfoClicked(record)
											}
										}
									}}
									disabled={!currentSelId}
								>
									<InfoCircleOutlined style={{ fontSize: '1rem' }} />
								</Typography.Link>
							</Row>
						</Item>
					)}
				</>
			)}
		</Descriptions>
	)
}

export { WithdrawalRequestInfo }

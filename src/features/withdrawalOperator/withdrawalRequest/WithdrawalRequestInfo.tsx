import {
	IGetBankInfoData,
	IGetCryptoPayData,
	IGetOnlinePayData,
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
import { numberFormatter, timeFormat } from 'common/utils/format'
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons'
import moment from 'moment/moment'
import {
	AccountTypeEnum,
	WITHDRAWAL_STATUS_TAGS_COLOR,
	WITHDRAWAL_TYPE_NAMES,
	WithdrawalStatusEnum,
	WithdrawalTypeEnum,
} from 'features/withdrawalOperator/constants'
import { multiEqual } from 'common/utils'
import { find, head } from 'lodash'
import { useEffect } from 'react'
import { useCopy } from 'common/hooks'

interface IWithdrawalInfoDescriptionsProps {
	form: FormInstance<IWithdrawalRequestForm>
	timeZoneUtcOffset: number
	paymentListLoading: boolean
	withdrawalDetailData?: IGetWithdrawalData
	localBankList: IGetBankInfoData[]
	cryptoPayList: IGetCryptoPayData[]
	onlinePayList: IGetOnlinePayData[]
	onPayInfoClicked: (
		record: IGetOnlinePayData | IGetCryptoPayData | IGetBankInfoData
	) => void
}

const { Item } = Descriptions
const { Option } = Select

const WithdrawalRequestInfo = ({
	form,
	timeZoneUtcOffset,
	withdrawalDetailData,
	paymentListLoading,
	cryptoPayList,
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
		withdrawlCnt,
		updateTime,
		flowEndTime,
		transId,
		accountType,
		cryptoCurrency,
		network,
	} = withdrawalDetailData ?? {}

	const color = WITHDRAWAL_STATUS_TAGS_COLOR[status as WithdrawalStatusEnum]
	const isApproved = status === WithdrawalStatusEnum.Approved
	const isProcess = status === WithdrawalStatusEnum.Process
	const type = Form.useWatch('withdrawalType', form)
	const currentSelId = Form.useWatch('selId', form)
	const isCrypto = accountType === AccountTypeEnum.Crypto

	// 檢查是否有 list 可以使用
	const hasLocalBank = localBankList?.length > 0
	const hasOnlinePayment = onlinePayList?.length > 0
	const hasCryptoPay = cryptoPayList?.length > 0

	useEffect(() => {
		if (!paymentListLoading) {
			// 這邊處理特殊情況 , 有些 data 實際上抓不到資料 , 但 DB 給的 type 資料有誤 , 手動導至 undefined
			if (
				(type === WithdrawalTypeEnum.OnlinePayment && !hasOnlinePayment) ||
				(type === WithdrawalTypeEnum.CryptoPay && !hasCryptoPay) ||
				(type === WithdrawalTypeEnum.LocalBank && !hasLocalBank)
			) {
				form.setFieldsValue({
					withdrawalType: WithdrawalTypeEnum.Undefined,
				})
			}
		}
	}, [type, paymentListLoading])

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
					{numberFormatter.format(amount)}
					<Typography.Link
						disabled={!amount}
						onClick={() => onCopy(String(amount))}
					>
						<CopyOutlined style={{ fontSize: '1rem' }} />
					</Typography.Link>
				</Row>
			</Item>
			<Item label={t('Label_Status')}>
				<Tag color={color}>{statusName || '-'}</Tag>
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
			{isCrypto ? (
				<>
					<Item label={t('Label_AccountType')}>{cryptoCurrency}</Item>
					<Item label={t('Label_NetWork')}>{network}</Item>
				</>
			) : (
				<Item label={t('Label_NameOfBank')}>
					<Row justify='space-between'>
						{bankName}
						<Typography.Link
							disabled={!bankName}
							onClick={() => onCopy(bankName)}
						>
							<CopyOutlined style={{ fontSize: '1rem' }} />
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
						<CopyOutlined style={{ fontSize: '1rem' }} />
					</Typography.Link>
				</Row>
			</Item>
			<Item label={t('Label_AccountName')}>{accountName}</Item>
			<Item label={t('Label_IFSCode')}>{ifscCode ?? '-'}</Item>
			<Item label={t('Label_WithdrawalCount')}>{withdrawlCnt}</Item>
			<Item label={`${t('Label_UpdateTime')} (+08:00)`}>
				{updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(createTime).utcOffset(8).format(timeFormat)}
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

			{multiEqual(status, [
				WithdrawalStatusEnum.Approved,
				WithdrawalStatusEnum.Verify,
				WithdrawalStatusEnum.Process,
			]) && (
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
								{hasLocalBank && (
									<Option
										value={WithdrawalTypeEnum.LocalBank}
										key={WithdrawalTypeEnum.LocalBank}
									>
										{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.LocalBank])}
									</Option>
								)}
								{hasOnlinePayment && (
									<Option
										value={WithdrawalTypeEnum.OnlinePayment}
										key={WithdrawalTypeEnum.OnlinePayment}
									>
										{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.OnlinePayment])}
									</Option>
								)}
								{hasCryptoPay && (
									<Option
										value={WithdrawalTypeEnum.CryptoPay}
										key={WithdrawalTypeEnum.CryptoPay}
									>
										{t(WITHDRAWAL_TYPE_NAMES[WithdrawalTypeEnum.CryptoPay])}
									</Option>
								)}
							</Select>
						</Form.Item>
					</Item>
					{multiEqual(type, [
						WithdrawalTypeEnum.CryptoPay,
						WithdrawalTypeEnum.OnlinePayment,
					]) && (
						<Item label={t('Label_Select') + t('Label_Pay')}>
							<Row justify='space-between' align='middle'>
								<Form.Item name='selId' noStyle>
									<Select
										disabled={isApproved || isProcess}
										placeholder={t('Label_Select') + t('Label_Pay')}
										style={{ width: 'calc(100% - 64px)' }}
									>
										{type === WithdrawalTypeEnum.OnlinePayment
											? onlinePayList?.map(({ payId, payName }) => (
													<Option value={payId} key={payId}>
														{payName}
													</Option>
											  ))
											: cryptoPayList?.map(({ payId, payName }) => (
													<Option value={payId} key={payId}>
														{payName}
													</Option>
											  ))}
									</Select>
								</Form.Item>
								<Typography.Link
									onClick={() => {
										if (type === WithdrawalTypeEnum.OnlinePayment) {
											const record = find(
												onlinePayList,
												item => item.payId === currentSelId
											)
											if (record !== undefined) {
												onPayInfoClicked(record)
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

import React, { useState } from 'react'
import moment from 'moment'
import {
	Button,
	DatePicker,
	Descriptions,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
	Tag,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
	DepositStatusEnum,
	IDepositOperatorData,
} from 'features/depositOperator/type'
import { jsonToObject, timeFormat } from 'common/utils/format'

import { ICalCodeData } from 'common/service/baseDataApi/type'
import { DEPOSIT_STATUS_TAGS_COLOR } from 'features/depositOperator/constants'
import {
	CopyOutlined,
	CloseOutlined,
	FormOutlined,
	InfoCircleOutlined,
	CheckOutlined,
} from '@ant-design/icons'
import { red, green } from '@ant-design/colors'
import { DepositTypeEnum, PermissionInterface } from 'type'
import { formatNumber } from 'features/depositOperator/utils'

const { Option } = Select

interface IDepositRequestDepositInfoProps {
	form: FormInstance
	setAmountPermission: PermissionInterface | undefined
	loading: boolean
	timeZoneUtcOffset: number
	depositInfo: IDepositOperatorData
	userActualCryptoAmount: number
	calCodeList: ICalCodeData[]
	onCopy: (value: string) => Promise<void>
	onSetAmountByTransId: () => void
	onOpenBankInfoModal: (accountNo: string | null) => void
	onOpenPaymentInfoModal: (payId: number | undefined) => void
}

const DepositRequestDepositInfo = ({
	form,
	setAmountPermission,
	loading,
	timeZoneUtcOffset,
	depositInfo: {
		transId,
		amount,
		actualDeposit,
		status,
		statusName,
		createTime,
		depositType,
		depositTypeName,
		channelName,
		depositCnt,
		bankCode,
		bankName,
		accountName,
		accountNo,
		refId,
		payName,
		flowEndTime,
		updateTime,
		statementTime,
		fromBankName,
		fromAccountNo,
		depositInfo: originDepositInfo, // json
		bonusDescription,
		oDepositInfo,
	},
	userActualCryptoAmount,
	calCodeList,
	onCopy,
	onSetAmountByTransId,
	onOpenBankInfoModal,
	onOpenPaymentInfoModal,
}: IDepositRequestDepositInfoProps) => {
	const { t } = useTranslation()
	const [editable, setEditable] = useState<'actualDeposit' | undefined>()
	const afterAmount = Form.useWatch('amount', form)
	const color = DEPOSIT_STATUS_TAGS_COLOR[status as DepositStatusEnum]
	const isApproved = status === DepositStatusEnum.Approved
	const isPending = status === DepositStatusEnum.Pending
	const isRejected = status === DepositStatusEnum.Rejected
	const isSetAmountDisabled = afterAmount === amount
	const isLocalBank = depositType === DepositTypeEnum.LocalBanking
	const isCryptoWallet = depositType === DepositTypeEnum.CryptoWallet
	const thirdPartyDepositType =
		depositType === DepositTypeEnum.OnlineBanking ||
		depositType === DepositTypeEnum.MobilePay ||
		depositType === DepositTypeEnum.BankAutoChannel ||
		depositType === DepositTypeEnum.CryptoPay ||
		depositType === DepositTypeEnum.LoadCard ||
		depositType === DepositTypeEnum.QRPay ||
		depositType === DepositTypeEnum.QuickTransfer

	const depositInfo = jsonToObject(originDepositInfo) ?? {}

	return (
		<Spin spinning={loading}>
			<Descriptions
				title={t('Label_DepositInfo')}
				bordered
				column={1}
				labelStyle={{ width: '160px' }}
				size='small'
			>
				<Descriptions.Item label={t('Label_TransactionNo')}>
					{transId || '-'}
				</Descriptions.Item>

				<Descriptions.Item label={t('Label_RequestAmount')}>
					{(amount && formatNumber(amount)) || '-'}
				</Descriptions.Item>

				{isCryptoWallet && (
					<>
						<Descriptions.Item label={t('Label_ActualAmount')}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<Form.Item noStyle name='actualAmount'>
									{formatNumber(actualDeposit)}
								</Form.Item>
								<Button
									type='link'
									icon={<CopyOutlined style={{ fontSize: '1.5rem' }} />}
									onClick={() => onCopy(String(actualDeposit))}
								/>
							</div>
						</Descriptions.Item>

						<Descriptions.Item label={t('Label_ActualCryptoAmount')}>
							<Input.Group compact>
								<Form.Item noStyle name='actualCryptoAmount'>
									<InputNumber
										controls={false}
										disabled={
											!setAmountPermission?.canUse ||
											editable !== 'actualDeposit'
										}
										style={{ width: 'calc(100% - 64px)' }}
										// InputNumber 要 formatter 取千分位 + 逗號，因為要 formatter 成字串，故這裡無法限制 type = "number"
										formatter={value => {
											const [integer, decimal] = `${value}`.split('.')
											const formattedInteger = integer.replace(
												/\B(?=(\d{3})+(?!\d))/g,
												','
											)
											return decimal
												? `${formattedInteger}.${decimal}`
												: formattedInteger
										}}
										// 把 + 過逗號的值再 parser 回來
										parser={value => value!.replace(/\$\s?|(,*)/g, '')}
									/>
								</Form.Item>
								{editable === 'actualDeposit' ? (
									<>
										<Button
											disabled={isSetAmountDisabled}
											onClick={() => {
												onSetAmountByTransId()
												setEditable(undefined)
											}}
											type='link'
											icon={<CheckOutlined style={{ color: green.primary }} />}
										/>

										<Button
											onClick={() => {
												form.setFieldsValue({
													actualCryptoAmount: depositInfo.exchangeAmount,
												})
												setEditable(undefined)
											}}
											type='link'
											icon={<CloseOutlined style={{ color: red.primary }} />}
										/>
									</>
								) : (
									<>
										<Button
											disabled={!setAmountPermission?.canUse}
											onClick={() => setEditable('actualDeposit')}
											type='link'
											icon={<FormOutlined style={{ fontSize: '1.5rem' }} />}
										/>
										<Button
											type='link'
											icon={<CopyOutlined style={{ fontSize: '1.5rem' }} />}
											onClick={() =>
												onCopy(
													String(
														userActualCryptoAmount !== 0
															? userActualCryptoAmount
															: depositInfo.actualExchangeAmount ??
																	depositInfo.exchangeAmount
													)
												)
											}
										/>
									</>
								)}
							</Input.Group>
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_CryptoAmount')}>
							{formatNumber(Number(depositInfo.exchangeAmount))}
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_ExchangeRate')}>
							{depositInfo.exchangeRate || '-'}
						</Descriptions.Item>
					</>
				)}

				{!isCryptoWallet && (
					<Descriptions.Item label={t('Label_ActualDeposit')}>
						<Input.Group compact>
							<Form.Item noStyle name='actualDeposit'>
								<InputNumber
									controls={false}
									disabled={
										!setAmountPermission?.canUse || editable !== 'actualDeposit'
									}
									style={{ width: 'calc(100% - 64px)' }}
									// InputNumber 要 formatter 取千分位 + 逗號，因為要 formatter 成字串，故這裡無法限制 type = "number"
									formatter={value => {
										const [integer, decimal] = `${value}`.split('.')
										const formattedInteger = integer.replace(
											/\B(?=(\d{3})+(?!\d))/g,
											','
										)
										return decimal
											? `${formattedInteger}.${decimal}`
											: formattedInteger
									}}
									// 把 + 過逗號的值再 parser 回來
									parser={value => value!.replace(/\$\s?|(,*)/g, '')}
								/>
							</Form.Item>
							{editable === 'actualDeposit' ? (
								<>
									<Button
										disabled={isSetAmountDisabled}
										onClick={() => {
											onSetAmountByTransId()
											setEditable(undefined)
										}}
										type='link'
										icon={<CheckOutlined style={{ color: green.primary }} />}
									/>
									<Button
										onClick={() => {
											form.setFieldsValue({ actualDeposit })
											setEditable(undefined)
										}}
										type='link'
										icon={<CloseOutlined style={{ color: red.primary }} />}
									/>
								</>
							) : (
								<>
									<Button
										disabled={
											!setAmountPermission?.canUse ||
											thirdPartyDepositType ||
											isApproved ||
											isRejected
										}
										onClick={() => setEditable('actualDeposit')}
										type='link'
										icon={<FormOutlined style={{ fontSize: '1.5rem' }} />}
									/>
									<Button
										type='link'
										icon={<CopyOutlined style={{ fontSize: '1.5rem' }} />}
										onClick={() => onCopy(String(amount))}
									/>
								</>
							)}
						</Input.Group>
					</Descriptions.Item>
				)}

				<Descriptions.Item label={t('Label_DepositBonus')}>
					{bonusDescription || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Status')}>
					<Tag color={color}>{statusName || '-'}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_CreateTime')}>
					{createTime &&
						moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_DepositType')}>
					{depositTypeName || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Channel')}>
					{channelName || '-'}
				</Descriptions.Item>

				{isLocalBank && (
					<>
						<Descriptions.Item label={t('Label_FromAccountNo')}>
							{fromAccountNo || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_FromBankName')}>
							{fromBankName || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_ToBankCode')}>
							{bankCode || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_ToBankName')}>
							<Row align='middle' justify='space-between'>
								{bankName || '-'}
								<Button
									disabled={!bankName}
									type='link'
									style={{ padding: '0px' }}
									icon={<CopyOutlined style={{ fontSize: '1.5rem' }} />}
									onClick={() => onCopy(String(bankName))}
								/>
							</Row>
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_ToAccountName')}>
							<Row align='middle' justify='space-between'>
								{accountName || '-'}
								<Button
									disabled={!accountName}
									type='link'
									style={{ padding: '0px' }}
									icon={<CopyOutlined style={{ fontSize: '1.5rem' }} />}
									onClick={() => onCopy(String(accountName))}
								/>
							</Row>
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_ToAccountNo')}>
							<Row align='middle' justify='space-between'>
								{accountNo || '-'}
								<Button
									type='link'
									style={{ padding: '0px' }}
									icon={<InfoCircleOutlined style={{ fontSize: '1.5rem' }} />}
									onClick={() => onOpenBankInfoModal(accountNo)}
								/>
							</Row>
						</Descriptions.Item>
						{/* approved 狀態和 pending 狀態才能修改 */}
						<Descriptions.Item label={t('Label_CalCode')}>
							<Form.Item noStyle name='bankId'>
								<Select
									disabled={!isApproved && !isPending}
									showSearch
									filterOption={(input, option) => {
										const isIncludes: boolean = (
											option!.children as unknown as string
										)
											.toLowerCase()
											.includes(input.toLowerCase())

										return isIncludes
									}}
									placeholder={t('Label_Select') + t('Label_CalCode')}
									style={{ width: 'calc(100% - 30px)' }}
								>
									{calCodeList?.map(({ bankId, calCodeName }) => (
										<Option key={bankId} value={bankId}>
											{calCodeName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Descriptions.Item>
					</>
				)}

				{isCryptoWallet ? (
					<>
						<Descriptions.Item label={t('Label_ToCryptoAccount')}>
							{accountName || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_FrontDisplayName')}>
							{depositInfo.frontendDisplayName || '-'}
						</Descriptions.Item>
					</>
				) : (
					<>
						<Descriptions.Item label={t('Label_RefId')}>
							{refId || oDepositInfo?.code || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={t('Label_Payment')}>
							<Row align='middle' justify='space-between'>
								{payName || '-'}
								{thirdPartyDepositType && (
									<Button
										type='link'
										style={{ padding: '0px' }}
										onClick={() => onOpenPaymentInfoModal(depositInfo?.payId)}
									>
										<InfoCircleOutlined style={{ fontSize: '18px' }} />
									</Button>
								)}
							</Row>
						</Descriptions.Item>
					</>
				)}
				{isCryptoWallet && (
					<Descriptions.Item label={t('Label_DepositCount')}>
						{depositCnt ?? '-'}
					</Descriptions.Item>
				)}
				<Descriptions.Item label={t('Label_FlowEndTime')}>
					{flowEndTime &&
						moment(flowEndTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_UpdateTime')}>
					{updateTime &&
						moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_StatementTime')}>
					{isLocalBank && isApproved ? (
						<Form.Item noStyle name='statementTime'>
							<DatePicker
								style={{ width: 'calc(100% - 64px)' }}
								showTime
								allowClear={false}
							/>
						</Form.Item>
					) : (
						statementTime &&
						moment(statementTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					)}
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default DepositRequestDepositInfo

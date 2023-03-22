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

const { Option } = Select

interface IDepositRequestDepositInfoProps {
	form: FormInstance
	setAmountPermission: PermissionInterface | undefined
	loading: boolean
	timeZoneUtcOffset: number
	depositInfo: IDepositOperatorData
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
		status,
		statusName,
		createTime,
		depositType,
		depositTypeName,
		channelName,
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
	},
	calCodeList,
	onCopy,
	onSetAmountByTransId,
	onOpenBankInfoModal,
	onOpenPaymentInfoModal,
}: IDepositRequestDepositInfoProps) => {
	const { t } = useTranslation()
	const [editable, setEditable] = useState<'amount' | undefined>()
	const afterAmount = Form.useWatch('amount', form)
	const color = DEPOSIT_STATUS_TAGS_COLOR[status as DepositStatusEnum]
	const isApproved = status === DepositStatusEnum.Approved
	const isEditAmount = !(
		status === DepositStatusEnum.Rejected ||
		status === DepositStatusEnum.Approved ||
		status === DepositStatusEnum.Canceled
	)
	const isSetAmountDisabled = afterAmount === amount
	const isLocalBank = depositType === DepositTypeEnum.LocalBanking
	const isShowPaymentInfoModalButton =
		depositType === DepositTypeEnum.OnlineBanking ||
		depositType === DepositTypeEnum.MobilePay ||
		depositType === DepositTypeEnum.BankAutoChannel ||
		depositType === DepositTypeEnum.CryptoPay ||
		depositType === DepositTypeEnum.LoadCard ||
		depositType === DepositTypeEnum.QRPay

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
					<Input.Group compact>
						<Form.Item noStyle name='amount'>
							<InputNumber
								controls={false}
								disabled={!setAmountPermission?.canUse || editable !== 'amount'}
								style={{ width: 'calc(100% - 64px)' }}
								// InputNumber 要 formatter 取千分位 + 逗號，因為要 formatter 成字串，故這裡無法限制 type = "number"
								formatter={value =>
									`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
								}
								// 把 + 過逗號的值再 parser 回來
								parser={value => value!.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>

						{editable === 'amount' ? (
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
											amount,
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
									type='link'
									icon={<CopyOutlined style={{ fontSize: '1.5rem' }} />}
									onClick={() => onCopy(String(amount))}
								/>
								<Button
									disabled={!setAmountPermission?.canUse}
									onClick={() => setEditable('amount')}
									type='link'
									icon={<FormOutlined style={{ fontSize: '1.5rem' }} />}
								/>
							</>
						)}
					</Input.Group>
				</Descriptions.Item>
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
						<Descriptions.Item label={t('Label_CalCode')}>
							<Form.Item noStyle name='bankId'>
								<Select
									disabled={!isApproved}
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

				<Descriptions.Item label={t('Label_RefId')}>
					{refId || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Payment')}>
					<Row align='middle' justify='space-between'>
						{payName || '-'}
						{isShowPaymentInfoModalButton && (
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

import {
	Button,
	Card,
	Form,
	FormInstance,
	InputNumber,
	Select,
	Space,
	Typography,
} from 'antd'
import {
	IGetBankInfoData,
	IGetCryptoPayData,
	IGetOnlinePayData,
	IWithdrawalRequestForm,
} from 'features/withdrawalOperator/type'
import { useTranslation } from 'react-i18next'
import {
	InfoCircleOutlined,
	MinusCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons'
import { find, isEqual, reduce } from 'lodash'
import { useMemo } from 'react'
import { WithdrawalStatusEnum } from 'features/withdrawalOperator/constants'
import { multiEqual } from 'common/utils'

interface IBankSettingFormProps {
	form: FormInstance<IWithdrawalRequestForm>
	localBankList: IGetBankInfoData[]
	status: number
	amount: number
	onPayInfoClicked: (
		record: IGetOnlinePayData | IGetCryptoPayData | IGetBankInfoData
	) => void
}

const { Option } = Select
const BankSettingForm = ({
	form,
	localBankList,
	status,
	amount,
	onPayInfoClicked,
}: IBankSettingFormProps) => {
	const { t } = useTranslation()
	const currentValue = Form.useWatch('withdrawalAccountingModels', form)
	// 判斷能否使用
	const canUse = multiEqual(status, [
		WithdrawalStatusEnum.Verify,
		WithdrawalStatusEnum.Approved,
	])

	// 計算當前的 amount 加總
	const hashAmount = useMemo(() => {
		return reduce(
			currentValue,
			(sum, cur) => {
				const { amount: withdrawalAmount = 0 } = cur ?? {}
				return sum + withdrawalAmount
			},
			0
		)
	}, [currentValue])

	return (
		<Card
			style={{ width: '100%', marginTop: '30px' }}
			title={
				<>
					<Typography.Text>{`${t(
						'Label_AlreadyAccountingAmount'
					)} : `}</Typography.Text>
					<Typography.Text
						type={isEqual(amount, hashAmount) ? 'success' : 'danger'}
					>
						{hashAmount}
					</Typography.Text>
				</>
			}
			size='small'
		>
			<Form
				layout='vertical'
				form={form}
				// 只有 Verify , Approved 狀態可以編輯
				disabled={!canUse}
			>
				<Form.List name='withdrawalAccountingModels'>
					{(fields, { add, remove }) => (
						<>
							{fields?.map(({ key, name, ...restField }) => (
								<Space
									key={key}
									style={{ display: 'flex', marginBottom: 6 }}
									align='baseline'
								>
									<Form.Item
										{...restField}
										// 因為這裡回傳的是 object[] , 避免後端資料吃不到 object Key , 還是保留大駝峰命名
										name={[name, 'bankId']}
										// 僅有第一列會顯示 Label
										label={name === 0 ? t('Label_BankAccountNo') : null}
										rules={[
											{ required: true, message: t('Label_RequiredText') },
										]}
										style={{ width: '250px' }}
									>
										<Select style={{ width: '100%' }}>
											{localBankList?.map(({ displayName, bankId }) => (
												<Option value={bankId} key={bankId}>
													{displayName}
												</Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item
										{...restField}
										name={[name, 'amount']}
										label={name === 0 ? t('Label_Amount') : null}
										rules={[
											{
												required: true,
												message: t('Label_RequiredText'),
											},
											{
												type: 'number',
												min: 0,
												message: t('Label_GreaterThanZero'),
											},
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											placeholder={t('Label_Amount')}
											// 新增這行是為了避免 Antd Input 元件在 type = 'number' 因為 滾動滾輪造成數字改變
											// 這是來自 Antd 元件的 bug , 解決方法只能使用 type = 'text' , 但 string 不符合這裡要的 type
											// @ts-ignore
											onWheel={() => document.activeElement.blur()}
										/>
									</Form.Item>
									<Form.Item
										{...restField}
										name={[name, 'chargeFee']}
										label={name === 0 ? t('Label_ChargeFee') : null}
										rules={[
											{
												required: true,
												message: t('Label_RequiredText'),
											},
											{
												type: 'number',
												min: 0,
												message: t('Label_GreaterThanZero'),
											},
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											placeholder={t('Label_ChargeFee')}
											// 新增這行是為了避免 Antd Input 元件在 type = 'number' 因為 滾動滾輪造成數字改變
											// 這是來自 Antd 元件的 bug , 解決方法只能使用 type = 'text' , 但 string 不符合這裡要的 type
											// @ts-ignore
											onWheel={() => document.activeElement.blur()}
										/>
									</Form.Item>
									<Form.Item label={name === 0 ? ' ' : null}>
										<Typography.Link
											type='danger'
											onClick={() => remove(name)}
											// disabled Form 吃不到 Typography , 故手動 disabled
											disabled={!canUse}
										>
											{/* 為了讓第一筆 的刪除符號可以在正確位置 , 所以在 label 動了手腳  */}
											<MinusCircleOutlined />
										</Typography.Link>
									</Form.Item>
									<Form.Item label={name === 0 ? ' ' : null}>
										<Typography.Link
											// 沒選 bankId 時 disabled
											disabled={
												currentValue && currentValue[name]?.bankId === undefined
											}
											onClick={() => {
												const currentBankId = form.getFieldValue([
													'withdrawalAccountingModels',
													name,
													'bankId',
												])
												const record = find(
													localBankList,
													({ bankId }) => bankId === currentBankId
												)
												if (record) {
													onPayInfoClicked(record)
												}
											}}
										>
											<InfoCircleOutlined />
										</Typography.Link>
									</Form.Item>
								</Space>
							))}
							{multiEqual(status, [
								WithdrawalStatusEnum.Verify,
								WithdrawalStatusEnum.Approved,
							]) && (
								<Form.Item>
									<Button
										type='dashed'
										onClick={() => add()}
										block
										icon={<PlusOutlined />}
									>
										{t('Label_AddBank')}
									</Button>
								</Form.Item>
							)}
						</>
					)}
				</Form.List>
			</Form>
		</Card>
	)
}

export { BankSettingForm }

import {
	Card,
	Col,
	Form,
	FormInstance,
	InputNumber,
	Row,
	Select,
	Typography,
} from 'antd'
import { IWithdrawalRequestForm } from 'features/withdrawalOperator/type'
import { useTranslation } from 'react-i18next'
import { multiEqual } from 'common/utils'
import { WithdrawalStatusEnum } from 'features/withdrawalOperator/constants'
import { find } from 'lodash'
import { InfoCircleOutlined } from '@ant-design/icons'
import {
	IBankInfoOffState,
	ICryptoPayData,
	ICryptoWalletData,
	IOnlinePayData,
} from 'common/service/baseDataApi/type'

interface ICryptoWalletSettingFormProps {
	form: FormInstance<IWithdrawalRequestForm>
	cryptoWalletList: ICryptoWalletData[]
	status: number
	onPayInfoClicked: (
		record: IOnlinePayData | ICryptoPayData | IBankInfoOffState
	) => void
}

const { Option } = Select

const CryptoWalletSettingForm = ({
	form,
	cryptoWalletList,
	status,
	onPayInfoClicked,
}: ICryptoWalletSettingFormProps) => {
	const { t } = useTranslation()
	const canUse = multiEqual(status, [
		WithdrawalStatusEnum.Verify,
		WithdrawalStatusEnum.Approved,
	])
	const currentSelId = Form.useWatch('cryptoWallet', form)
	return (
		<Card
			size='small'
			style={{ width: '100%', marginTop: '30px' }}
			title={t('Label_CryptoSetting')}
		>
			<Form
				layout='vertical'
				form={form}
				disabled={!canUse}
				style={{ width: '95%', marginTop: '20px' }}
			>
				<Row align='middle' gutter={16}>
					<Col span={15}>
						<Form.Item
							name='cryptoWallet'
							label={t('Label_Select') + t('Label_CryptoWallet')}
							rules={[{ required: canUse, message: t('Label_RequiredText') }]}
						>
							<Select disabled={!canUse} placeholder={t('Label_CryptoWallet')}>
								{cryptoWalletList?.map(({ bankId, displayName }) => (
									<Option value={bankId} key={bankId}>
										{displayName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item name='gasFee' label={t('Label_GasFee')} initialValue={0}>
							<InputNumber
								type='number'
								controls={false}
								style={{ width: '100%' }}
								placeholder={t('Label_GasFee')}
								// 新增這行是為了避免 Antd Input 元件在 type = 'number' 因為 滾動滾輪造成數字改變
								// 這是來自 Antd 元件的 bug , 解決方法只能使用 type = 'text' , 但 string 不符合這裡要的 type
								// @ts-ignore
								onWheel={() => document.activeElement.blur()}
							/>
						</Form.Item>
					</Col>
					<Col span={3}>
						<Form.Item label=' '>
							<Typography.Link
								onClick={() => {
									const record = find(
										cryptoWalletList,
										item => item.bankId === currentSelId
									)
									if (record !== undefined) {
										onPayInfoClicked(record)
									}
								}}
								disabled={!currentSelId}
							>
								<InfoCircleOutlined />
							</Typography.Link>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Card>
	)
}

export { CryptoWalletSettingForm }

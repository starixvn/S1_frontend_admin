import {
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	PaymentEnum,
	UsedCardEnum,
} from 'features/withdrawalSubmission/constants'
import {
	IDepositForm,
	IGetBankInfoListData,
} from 'features/depositSubmission/type'
import { IEnumTypeData } from 'common/service/enumApi'
import DepositSubmissionUploader from 'features/depositSubmission/DepositSubmissionUploader'
import { find, isNumber } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useModal } from 'common/hooks'

interface IDepositSubmissionFormProps {
	form: FormInstance<IDepositForm>
	loading: boolean
	bankInfoList: IGetBankInfoListData[]
	statusList: IEnumTypeData[]
}

const { Option } = Select

const DepositSubmissionForm = ({
	form,
	loading,
	bankInfoList,
	statusList,
}: IDepositSubmissionFormProps) => {
	const { t } = useTranslation()
	const previewModal = useModal()
	const settingStatus = Form.useWatch('settingStatus', form)
	const accountNum = Form.useWatch('accountNo', form)

	const handleResetInfo = () => {
		form.resetFields(['accountNo', 'bankName', 'accountName'])
	}

	const handleAccountNumChange = (value: string) => {
		const targetBankInfo = bankInfoList.find(
			({ accountNo: bankInfoAccountNo }) => bankInfoAccountNo === value
		)
		form.setFieldsValue({
			bankName: targetBankInfo?.bankName,
			accountName: targetBankInfo?.accountName,
		})
	}

	const accountNoSelector = () => {
		const filterBankInfoList = isNumber(settingStatus)
			? bankInfoList.filter(
					({ settingStatus: status }) =>
						Number(status) === Number(settingStatus)
			  )
			: bankInfoList
		return (
			<Select
				placeholder={t('Label_Select')}
				onChange={value => handleAccountNumChange(value)}
			>
				{filterBankInfoList?.map(({ accountNo: num }) => (
					<Option key={num} value={num}>
						{num}
					</Option>
				))}
			</Select>
		)
	}

	const { minAmount, maxAmount: originMaxAmount } =
		find(bankInfoList, { accountNo: accountNum }) ?? {}
	// * maxAmount = 0 時給 undefined 不設限
	const maxAmount = originMaxAmount === 0 ? undefined : originMaxAmount

	return (
		<Spin spinning={loading}>
			<LayoutContent.Card style={{ marginTop: '20px', paddingTop: '25px' }}>
				<Form
					layout='vertical'
					size='middle'
					form={form}
					initialValues={{
						isExistBankCard: UsedCardEnum.MemberCard,
						paymentId: PaymentEnum.LocalBank,
						memo: '',
					}}
				>
					<Row gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='settingStatus'
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
								<Select
									placeholder={t('Label_Select')}
									onChange={handleResetInfo}
								>
									{statusList.map(({ value, name }) => (
										<Option key={value} value={value}>
											{name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='accountNo'
								label={t('Label_AccountNum')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AccountNum'),
										}),
									},
								]}
							>
								{accountNoSelector()}
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='bankName' label={t('Label_BankName')}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='accountName'
								label={t('Label_AccountHolderName')}
							>
								<Input disabled />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='amount'
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
									controls={false}
									style={{ width: '100%' }}
									min={minAmount}
									max={maxAmount}
									type='number'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='dateTime'
								label={t('Label_SubmittedDateTime')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_SubmittedDateTime'),
										}),
									},
								]}
							>
								<DatePicker showTime style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='referenceNo'
								label={t('Label_ReferenceNo')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_ReferenceNo'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='memo'
								label={t('Label_Memo')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Memo'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<DepositSubmissionUploader
					form={form}
					visible={previewModal.visible}
					onClick={previewModal.onOpen}
					onCancel={previewModal.onCancel}
				/>
			</LayoutContent.Card>
		</Spin>
	)
}

export default DepositSubmissionForm

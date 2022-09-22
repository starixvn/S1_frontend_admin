import { LayoutContent } from 'app/pages/layout'
import {
	IGetReasonListData,
	IGetWithdrawalAdjustmentData,
} from 'features/withdrawalAdjustment/type'
import {
	Col,
	Divider,
	Form,
	FormInstance,
	InputNumber,
	Row,
	Select,
	Spin,
	Typography,
	Input,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import {
	AdjustmentTypeEnum,
	adjustmentTypeList,
} from 'features/withdrawalAdjustment/constants'
import { head } from 'lodash'

interface IWithdrawalAdjustmentFormProps {
	loading: boolean
	withdrawalAdjustment: IGetWithdrawalAdjustmentData
	withdrawalAdjustmentReasonList: IGetReasonListData[]
	form: FormInstance
}

const { Option } = Select
const { TextArea } = Input

const WithdrawalAdjustmentForm = ({
	loading,
	withdrawalAdjustment,
	withdrawalAdjustmentReasonList,
	form,
}: IWithdrawalAdjustmentFormProps) => {
	const { t } = useTranslation()
	const { balance, differenceAmount, eligibleWithdrawalAmount } =
		withdrawalAdjustment ?? {}

	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
				<Row style={{ marginTop: '20px' }}>
					<Typography.Title level={5}>{`${t('Label_BalanceAmount')} : ${
						balance ? numberFormatter.format(balance) : '-'
					}`}</Typography.Title>
				</Row>
				<Row>
					<Typography.Title level={5}>{`${t('Label_DifferenceAmount')} : ${
						differenceAmount ? numberFormatter.format(differenceAmount) : '-'
					}`}</Typography.Title>
				</Row>
				<Row>
					<Typography.Title level={5}>{`${t(
						'Label_EligibleWithdrawalAmount'
					)} : ${
						eligibleWithdrawalAmount
							? numberFormatter.format(eligibleWithdrawalAmount)
							: '-'
					}`}</Typography.Title>
				</Row>
				<Divider />

				<Form
					form={form}
					layout='vertical'
					initialValues={{
						adjustType: AdjustmentTypeEnum?.Default,
						reasonId: head(withdrawalAdjustmentReasonList)?.value,
					}}
				>
					<Row>
						<Col lg={8} md={24} xs={24}>
							<Form.Item
								name='adjustType'
								label={t('Label_AdjustmentType')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AdjustmentType'),
										}),
									},
								]}
							>
								<Select>
									{adjustmentTypeList?.map(type => (
										<Option key={type.value} value={type.value}>
											{t(type.displayName)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={8} md={24} xs={24}>
							<Form.Item
								name='reasonId'
								label={t('Label_AdjustmentReason')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AdjustmentReason'),
										}),
									},
								]}
							>
								<Select>
									{withdrawalAdjustmentReasonList?.map(reason => (
										<Option value={reason.value} key={reason.value}>
											{reason.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={8} md={24} xs={24}>
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
									{
										type: 'number',
										min: 0,
									},
								]}
							>
								<InputNumber
									style={{ width: '100%' }}
									type='number'
									controls={false}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col lg={8} md={24} xs={24}>
							<Form.Item name='memo' label={t('Label_Memo')}>
								<TextArea />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</LayoutContent.Card>
		</Spin>
	)
}

export { WithdrawalAdjustmentForm }

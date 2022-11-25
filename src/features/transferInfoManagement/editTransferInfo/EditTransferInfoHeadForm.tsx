import { useTranslation } from 'react-i18next'
import {
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Spin,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import moment from 'moment'
import {
	IGetReasonListData,
	IGetTransferTypeListData,
} from 'features/transferInfoManagement/type'

interface IEditTransferInfoFilterProps {
	loading: boolean
	form: FormInstance
	reasonList: IGetReasonListData[]
	transferTypeList: IGetTransferTypeListData[]
	transactionTypeList: IGetTransferTypeListData[]
}

const { Option } = Select
const EditTransferInfoHeadForm = ({
	loading,
	form,
	reasonList,
	transferTypeList,
	transactionTypeList,
}: IEditTransferInfoFilterProps) => {
	const { t } = useTranslation()
	return (
		<Spin spinning={loading}>
			<LayoutContent.Card style={{ marginTop: 0 }}>
				<Form form={form} layout='vertical'>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='transDate'
								label={t('Label_TransDate')}
								initialValue={moment()}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_TransDate'),
										}),
									},
								]}
							>
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='transferType'
								label={t('Label_TransferType')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_TransferType'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select') + t('Label_TransferType')}
								>
									{transferTypeList?.map(type => (
										<Option key={type.value} value={type.value}>
											{type.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='transactionType'
								label={t('Label_TransactionType')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_TransactionType'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select') + t('Label_TransactionType')}
								>
									{transactionTypeList?.map(type => (
										<Option key={type.value} value={type.value}>
											{type.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='reason'
								label={t('Label_Reason')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Reason'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select') + t('Label_Reason')}
									allowClear
								>
									{reasonList?.map(reason => (
										<Option key={reason.reasonId} value={reason.reasonId}>
											{reason.description}
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
					</Row>
				</Form>
			</LayoutContent.Card>
		</Spin>
	)
}

export { EditTransferInfoHeadForm }

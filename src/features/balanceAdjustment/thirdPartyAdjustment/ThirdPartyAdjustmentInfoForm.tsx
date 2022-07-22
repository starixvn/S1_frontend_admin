import { FC } from 'react'
import { head } from 'lodash'
import {
	Col,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { FormInstance } from 'antd/es/form/Form'
import { IAdjustmentData } from './type'
import { adjustmentTypeList } from './constants'

const { Option } = Select

interface IThirdPartyAdjustmentInfoFormProps {
	form: FormInstance
	loading: boolean
	balance?: number
	adjustmentReasonList: IAdjustmentData[]
}

const ThirdPartyAdjustmentInfoForm: FC<IThirdPartyAdjustmentInfoFormProps> = ({
	form,
	loading,
	balance,
	adjustmentReasonList,
}) => {
	const { t } = useTranslation()

	return (
		<LayoutContent.Card>
			<Spin spinning={loading}>
				<Typography.Title level={4}>
					{`${t('Label_BalanceAmount')}: ${balance}`}
				</Typography.Title>
				<Form
					form={form}
					layout='vertical'
					size='middle'
					initialValues={{
						adjustmentType: head(adjustmentTypeList)?.id,
						reasonId: null,
						amount: null,
						memo: '',
					}}
				>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='adjustmentType'
								label={t('Label_AdjustmentType')}
							>
								<Select placeholder='select'>
									{adjustmentTypeList.map(item => (
										<Option key={item.id} value={item.id}>
											{t(item.displayKey)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='reasonId' label={t('Label_AdjustmentReason')}>
								<Select placeholder='select'>
									{adjustmentReasonList?.map(item => (
										<Option key={item.id} value={item.id}>
											{item.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row align='middle' gutter={16}>
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
								<InputNumber style={{ width: '100%' }} type='number' />
							</Form.Item>
						</Col>
					</Row>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='memo' label={t('Label_Memo')}>
								<Input allowClear maxLength={200} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		</LayoutContent.Card>
	)
}

export default ThirdPartyAdjustmentInfoForm

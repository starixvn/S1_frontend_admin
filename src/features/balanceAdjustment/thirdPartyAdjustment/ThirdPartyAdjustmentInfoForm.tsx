import { FC } from 'react'
import { head } from 'lodash'
import {
	Col,
	Descriptions,
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
import { numberFormatter } from 'common/utils/format'
import { IAdjustmentData, ITpBySiteData, ITpWalletData } from './type'
import { adjustmentTypeList } from './constants'

const { Option } = Select

interface IThirdPartyAdjustmentInfoFormProps {
	form: FormInstance
	loading: boolean
	balance?: number
	tpWalletList: ITpWalletData[]
	adjustmentReasonList: IAdjustmentData[]
	tpListBySiteId: ITpBySiteData[]
}

const ThirdPartyAdjustmentInfoForm: FC<IThirdPartyAdjustmentInfoFormProps> = ({
	form,
	loading,
	balance,
	tpWalletList,
	adjustmentReasonList,
	tpListBySiteId,
}) => {
	const { t } = useTranslation()
	const reasonId = Form.useWatch('reasonId', form)

	return (
		<LayoutContent.Card>
			<Spin spinning={loading}>
				<Typography.Title level={4}>
					{`${t('Label_BalanceAmount')}: ${
						balance ? numberFormatter.format(balance) : ''
					}`}
				</Typography.Title>

				<Row align='middle'>
					<Col lg={12} md={24} xs={24}>
						<Descriptions layout='vertical' bordered size='small'>
							{tpWalletList?.map(tpWallet => (
								<Descriptions.Item label={tpWallet.tpName}>
									{numberFormatter.format(tpWallet.balance)}
								</Descriptions.Item>
							))}
						</Descriptions>
					</Col>
				</Row>

				<br />

				<Form
					form={form}
					layout='vertical'
					size='middle'
					initialValues={{
						tpId: undefined,
						adjustmentType: head(adjustmentTypeList)?.id,
						reasonId: null,
						amount: null,
						memo: '',
						transId: '',
					}}
				>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='tpId' label={t('Label_3RDParty')}>
								<Select placeholder='select'>
									{tpListBySiteId?.map(item => (
										<Option key={item.tpId} value={item.tpId}>
											{item.tpName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

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
					{reasonId === 9 && (
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='transId'
									label={t('Label_DepositId')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_DepositId'),
											}),
										},
									]}
								>
									<Input allowClear placeholder={t('Label_DepositId')} />
								</Form.Item>
							</Col>
						</Row>
					)}
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

import { Card, Col, Form, FormInstance, Select, Typography } from 'antd'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'
import { ISlotTpData } from 'common/service/allDataApi'
import { IEditForm } from 'features/rebateExcludeGame/type'

interface ITpSelectorProps {
	form: FormInstance<IEditForm>
	slotTpList: ISlotTpData[]
}

const { Option } = Select

const TpSelector = ({ form, slotTpList }: ITpSelectorProps) => {
	const { t } = useTranslation()

	return (
		<Col lg={6} md={12} xs={12}>
			<Typography.Title level={5} type='warning'>
				{t('Label_Step1_SelectTpMessage')}
			</Typography.Title>
			<Card title={t('Label_TpName')}>
				<Form.Item
					name='selectedTp'
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_TpName'),
							}),
						},
					]}
				>
					<MultipleSelect
						onChange={(newTp: number[]) => {
							form.setFieldsValue({
								selectedTp: newTp,
							})
						}}
						placeholder={`${t('Label_Search')} & ${t('Label_Select')}`}
						showSearch
						allowClear
						filterOption={(input, option) => {
							return (option!.children as unknown as string)
								.toLowerCase()
								.includes(input.toLowerCase())
						}}
					>
						{slotTpList?.map(({ tpId, tpName }) => (
							<Option key={tpId} value={tpId}>
								{tpName}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
			</Card>
		</Col>
	)
}

export { TpSelector }

import { Col, Collapse, Form, FormInstance, Input, Row, Select } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { ISlotTpData } from 'common/service/allDataApi'
import { MultipleSelect } from 'components/Select'

interface IMainFormProps {
	form: FormInstance
	tpList: ISlotTpData[]
	isEdit: boolean
}

const { Panel } = Collapse
const { Option } = Select

// 主表單，控制要設定的 userName 跟選擇 TP
const BasicInfoForm = ({ form, tpList, isEdit }: IMainFormProps) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						initialValues={{
							userName: '',
							selectedTp: [],
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='userName'
									label={t('Label_MemberId')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_MemberId'),
											}),
										},
									]}
								>
									<Input allowClear disabled={isEdit} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='selectedTp'
									label={t('Label_TpName')}
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
										allowClear={false}
										filterOption={(input, option) => {
											const isIncludes: boolean = (
												option!.children as unknown as string
											)
												.toLowerCase()
												.includes(input.toLowerCase())

											return isIncludes
										}}
									>
										{tpList?.map(({ tpId, tpName }) => (
											<Option key={tpId} value={tpId}>
												{tpName}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { BasicInfoForm }

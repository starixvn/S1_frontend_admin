import { Col, Form, FormInstance, Row, Select, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { ITpListData } from 'common/service/allDataApi'

interface IBasicLiveStreamingFormProps {
	form: FormInstance
	tpList: ITpListData[]
	onVenderChange: (newTpIds: number[]) => void
}

const { Option } = Select

const BasicLiveStreamingForm = ({
	form,
	tpList,
	onVenderChange,
}: IBasicLiveStreamingFormProps) => {
	const { t } = useTranslation()

	return (
		<Card>
			<Form
				layout='vertical'
				autoComplete='off'
				form={form}
				initialValues={{
					tpId: [],
				}}
			>
				<Row align='middle' gutter={[16, 16]}>
					<Col span={12}>
						<Form.Item
							name='tpId'
							label={t('Label_Vender')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Vender'),
									}),
								},
							]}
						>
							<MultipleSelect
								onChange={onVenderChange}
								placeholder={`${t('Label_Select')} ${t('Label_Vender')}`}
								showSearch
								allowClear
								filterOption={(input, option) => {
									const isIncludes: boolean = (
										option!.children as unknown as string
									)
										.toLowerCase()
										.includes(input.toLowerCase())

									return isIncludes
								}}
							>
								{tpList?.map(({ id, tpDisplayName }) => (
									<Option key={id} value={id}>
										{tpDisplayName}
									</Option>
								))}
							</MultipleSelect>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Card>
	)
}

export default BasicLiveStreamingForm

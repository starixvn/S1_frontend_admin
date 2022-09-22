import { FC } from 'react'
import { Button, Col, Form, FormInstance, Input, Row, Select } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { MethodTypeEnum } from '../constants'
import { IMethodType } from '../type'

const { Option } = Select

interface IThirdPartyAdjustmentSearchFormProps {
	form: FormInstance
	loading: boolean
	methodType: MethodTypeEnum
	filteredMethodTypes: IMethodType[]
	onMethodTypeChange: (type: MethodTypeEnum) => void
	onSearch: () => void
}

const ThirdPartyAdjustmentSearchForm: FC<
	IThirdPartyAdjustmentSearchFormProps
> = ({
	form,
	loading,
	methodType,
	filteredMethodTypes,
	onMethodTypeChange,
	onSearch,
}) => {
	const { t } = useTranslation()

	return (
		<LayoutContent.Card>
			<Form
				form={form}
				layout='vertical'
				size='middle'
				initialValues={{
					userName: '',
				}}
				onFinish={() => onSearch()}
			>
				<Row align='top' gutter={16}>
					<Col lg={6} md={24} xs={24}>
						<Form.Item label={t('Label_MethodType')}>
							<Select value={methodType} onChange={onMethodTypeChange}>
								{filteredMethodTypes.map(type => (
									<Option key={type.value} value={type.value}>
										{t(type.displayKey)}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>

					<Col lg={6} md={12} xs={12}>
						<Form.Item name='userName' label={t('Label_MemberId')}>
							<Input allowClear placeholder={t('Label_MemberId')} />
						</Form.Item>
					</Col>

					<Col lg={6} md={12} xs={12}>
						<Form.Item name='sabaId' label={t('Label_SabaId')}>
							<Input allowClear placeholder={t('Label_SabaId')} />
						</Form.Item>
					</Col>
				</Row>
				<br />
				<Row justify='end' align='middle'>
					<Col>
						<Button
							loading={loading}
							icon={<SearchOutlined />}
							htmlType='submit'
							type='primary'
						>
							{t('Label_GetBalance')}
						</Button>
					</Col>
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export default ThirdPartyAdjustmentSearchForm

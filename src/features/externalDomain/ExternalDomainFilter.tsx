import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Row,
	Select,
	Spin,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { MultipleSelect } from 'components/Select'
import { Currency } from 'common/enum/type'
import { IFilterForm } from 'features/externalDomain/type'

const { Panel } = Collapse
const { Option } = Select

interface IExternalDomainFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	currencyListBySite: Currency[]
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const ExternalDomainFilter = ({
	form,
	loading,
	currencyListBySite,
	onSearch,
}: IExternalDomainFilterProps) => {
	const { t } = useTranslation()

	const onChangeCurrency = (newCurrencyIds: Array<number | string>) => {
		if (newCurrencyIds.includes('all')) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(({ currencyId }) => currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}
	return (
		<Spin spinning={loading}>
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1' style={{ marginTop: 0 }}>
					<LayoutContent.Card>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={onSearch}
							initialValues={{
								currencyIds: currencyListBySite?.map(
									({ currencyId }) => currencyId
								),
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='currencyIds' label={t('Label_Currency')}>
										<MultipleSelect
											onChange={onChangeCurrency}
											placeholder={t('Label_Select')}
										>
											{(currencyListBySite?.length as number) > 1 && (
												<Option value='all'>{t('Label_SelectAll')}</Option>
											)}
											{currencyListBySite?.map(({ currencyId, isoCode }) => (
												<Option key={currencyId} value={currencyId}>
													{isoCode}
												</Option>
											))}
										</MultipleSelect>
									</Form.Item>
								</Col>
							</Row>
							<Row justify='end' align='middle'>
								<Col>
									<Button
										loading={loading}
										icon={<SearchOutlined />}
										htmlType='submit'
										type='primary'
									>
										{t('Label_Search')}
									</Button>
								</Col>
							</Row>
						</Form>
					</LayoutContent.Card>
				</Panel>
			</Collapse>
		</Spin>
	)
}

export default ExternalDomainFilter

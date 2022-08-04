import { FC } from 'react'
import { Button, Col, Collapse, Form, FormInstance, Row, Select } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { SearchOutlined } from '@ant-design/icons'

interface ILineDepositChannelFilterProps {
	form: FormInstance
	currencyListBySite: Currency[]
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	loading: boolean
}

const { Option } = Select
const { Panel } = Collapse

const LineDepositChannelFilter: FC<ILineDepositChannelFilterProps> = ({
	form,
	currencyListBySite,
	onSearch,
	loading,
}) => {
	const { t } = useTranslation()

	const onChangeCurrency = (newCurrencyIds: number[]) => {
		if (newCurrencyIds.includes(0)) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(item => item.currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							currencyIds: currencyListBySite?.map(item => item.currencyId),
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
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}
										{currencyListBySite?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</MultipleSelect>
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
									{t('Label_Search')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { LineDepositChannelFilter }

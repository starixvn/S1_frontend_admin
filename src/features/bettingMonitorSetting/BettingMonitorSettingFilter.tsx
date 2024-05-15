import { Button, Col, Collapse, Form, FormInstance, Row, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Currency } from 'common/enum/type'
import {
	IFilterForm,
	IGetTpGameTypeData,
	IGetTpListData,
} from 'features/bettingMonitorSetting/type'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { MultipleSelect } from 'components/Select'

const { Panel } = Collapse
const { Option } = Select

interface IBettingMonitorFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	currencyListBySite: Currency[]
	tpList: IGetTpListData[]
	tpGameList: IGetTpGameTypeData[]
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const BettingMonitorSettingFilter = ({
	form,
	loading,
	currencyListBySite,
	tpList,
	tpGameList,
	onSearch,
}: IBettingMonitorFilterProps) => {
	const { t } = useTranslation()
	const currencySelector = () => {
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
			<MultipleSelect
				onChange={onChangeCurrency}
				placeholder={t('Label_Select')}
			>
				{(currencyListBySite?.length as number) > 1 && (
					<Option value={0}>{t('Label_SelectAll')}</Option>
				)}

				{currencyListBySite?.map(({ currencyId, isoCode }) => (
					<Option key={currencyId} value={currencyId}>
						{isoCode}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const tpIdsSelector = () => {
		const onChangeTpIds = (newTpIds: Array<number | string>) => {
			if (newTpIds.includes('all')) {
				form.setFieldsValue({
					tpIds: tpList?.map(item => item.id),
				})
			} else {
				form.setFieldsValue({
					tpIds: newTpIds,
				})
			}
		}

		const resetTpGameType = () => {
			form.setFieldsValue({
				tpGameTypes: [],
			})
		}
		return (
			<MultipleSelect
				onChange={newTpIds => {
					onChangeTpIds(newTpIds)
					resetTpGameType()
				}}
				placeholder={t('Label_Select')}
				showSearch
				filterOption={(input, option) => {
					const isIncludes: boolean = (option!.children as unknown as string)
						.toLowerCase()
						.includes(input.toLowerCase())

					return isIncludes
				}}
			>
				{(tpList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{tpList?.map(({ tpName, id }) => (
					<Option key={id} value={id}>
						{tpName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const tpGameTypesSelector = () => {
		const onChangeGameTypeId = (newTpGameTypes: Array<number | string>) => {
			if (newTpGameTypes.includes('all')) {
				form.setFieldsValue({
					tpGameTypes: tpGameList?.map(item => item.type),
				})
			} else {
				form.setFieldsValue({
					tpGameTypes: newTpGameTypes,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeGameTypeId}
				placeholder={t('Label_Select')}
			>
				{(tpGameList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{tpGameList?.map(({ typeName, type }) => (
					<Option key={type} value={type}>
						{typeName}
					</Option>
				))}
			</MultipleSelect>
		)
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
							currencyIds: currencyListBySite?.map(
								({ currencyId }) => currencyId
							),
							tpIds: [],
							tpGameTypes: [],
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='currencyIds'
									label={t('Label_Currency')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Currency'),
											}),
										},
									]}
								>
									{currencySelector()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='tpIds'
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
									{tpIdsSelector()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='tpGameTypes'
									label={t('Label_Product')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Product'),
											}),
										},
									]}
								>
									{tpGameTypesSelector()}
								</Form.Item>
							</Col>
						</Row>
						<Row justify='end' align='middle'>
							<Col>
								<Form.Item label={' '}>
									<Button
										loading={loading}
										icon={<SearchOutlined />}
										htmlType='submit'
										type='primary'
									>
										{t('Label_Search')}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default BettingMonitorSettingFilter

import { Button, Col, Collapse, Form, FormInstance, Row, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import { MultipleSelect } from 'components/Select'
import { IFilterForm } from 'features/videoManagement/type'
import { Currency } from 'common/enum/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { useTranslation } from 'react-i18next'

const { Panel } = Collapse
const { Option } = Select

interface IVideoManagementFilterProps {
	loading: boolean
	form: FormInstance<IFilterForm>
	currencyListBySite: Currency[]
	LangTypeList: IEnumTypeData[]
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const VideoManagementFilter = ({
	loading,
	form,
	currencyListBySite,
	LangTypeList,
	onSearch,
}: IVideoManagementFilterProps) => {
	const { t } = useTranslation()

	const currencyIdsSelector = () => {
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
			form.resetFields(['langIds'])
		}

		return (
			<Form.Item name='currencyIds' label={t('Label_Currency')}>
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyListBySite?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{currencyListBySite?.map(item => (
						<Option key={item.currencyId} value={item.currencyId}>
							{item.isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const languageSelector = () => {
		const onChangeLanguage = (newLangIds: Array<number | string>) => {
			if (newLangIds.includes('all')) {
				form.setFieldsValue({
					langIds: LangTypeList.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					langIds: newLangIds,
				})
			}
		}

		return (
			<Form.Item name='langIds' label={t('Label_Language')}>
				<MultipleSelect
					onChange={onChangeLanguage}
					placeholder={t('Label_Select')}
				>
					{(LangTypeList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{LangTypeList?.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						form={form}
						layout='vertical'
						size='middle'
						onFinish={() => onSearch({})}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								{currencyIdsSelector()}
							</Col>
							<Col lg={8} md={24} xs={24}>
								{languageSelector()}
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
	)
}

export default VideoManagementFilter

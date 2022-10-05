import { LayoutContent } from 'app/pages/layout'
import { Button, Col, Collapse, Form, FormInstance, Row, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { IGetFuncKeysListData } from 'features/reasonManagement/type'

interface IReasonManagementFilterProps {
	loading: boolean
	form: FormInstance
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	funcKeysList: IGetFuncKeysListData[]
}

const { Panel } = Collapse
const { Option } = Select

const ReasonManagementFilter = ({
	loading,
	form,
	onSearch,
	funcKeysList,
}: IReasonManagementFilterProps) => {
	const { t } = useTranslation()

	const funcKeyRenderer = () => {
		const onChangeFuncKeys = (newFuncKey: string[]) => {
			if (newFuncKey.includes('all')) {
				form.setFieldsValue({
					funcKeys: funcKeysList?.map(key => key.funcKey),
				})
			} else {
				form.setFieldsValue({
					funcKeys: newFuncKey,
				})
			}
		}
		return (
			<Form.Item name='funcKeys' label={t('Label_FuncKey')}>
				<MultipleSelect
					onChange={onChangeFuncKeys}
					placeholder={t('Label_Select')}
				>
					{funcKeysList?.length > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{funcKeysList?.map(key => (
						<Option key={key.funcKey} value={key.funcKey}>
							{key.funcKey}
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
							<Col lg={8} md={12} xs={24}>
								{funcKeyRenderer()}
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

export { ReasonManagementFilter }

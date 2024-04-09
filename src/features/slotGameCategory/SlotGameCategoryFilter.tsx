import { FC } from 'react'
import { IGetTpListData } from 'features/slotGameCategory/type'
import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	SlotGameStatusEnum,
	slotGameStatusList,
} from 'features/slotGameCategory/constants'
import { SearchOutlined } from '@ant-design/icons'

interface ISlotGameCategoryFilterProps {
	loading: boolean
	tpList: IGetTpListData[]
	form: FormInstance
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const { Panel } = Collapse
const { Option } = Select

const SlotGameCategoryFilter: FC<ISlotGameCategoryFilterProps> = ({
	loading,
	tpList,
	form,
	onSearch,
}) => {
	const { t } = useTranslation()

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
							status: SlotGameStatusEnum.ALL,
							name: '',
							gameId: '',
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
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
									<Select
										placeholder={t('Label_Select')}
										showSearch
										filterOption={(input, option) => {
											const isIncludes: boolean = (
												option!.children as unknown as string
											)
												.toLowerCase()
												.includes(input.toLowerCase())

											return isIncludes
										}}
									>
										{tpList?.map(tp => (
											<Option key={tp.tpId} value={tp.tpId}>
												{tp.tpName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='status' label={t('Label_Status')}>
									<Select placeholder={t('Label_Select')}>
										{slotGameStatusList?.map(status => (
											<Option key={status.value} value={status.value}>
												{t(status.displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='name' label={t('Label_GameName')}>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='gameId' label={t('Label_GameId')}>
									<Input allowClear />
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

export { SlotGameCategoryFilter }

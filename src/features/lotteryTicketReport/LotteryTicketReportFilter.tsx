import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import {
	Col,
	Collapse,
	Form,
	Input,
	Row,
	FormInstance,
	Button,
	Select,
} from 'antd'
import { useAppSelector } from 'app/store'
import { MultipleSelect } from 'components/Select'
import { LayoutContent } from 'app/pages/layout'
import { selectCurrencyListBySite, selectUserSiteList } from 'common/enum'

const { Panel } = Collapse
const { Option } = Select

interface ILotteryTicketReportFilterProps {
	form: FormInstance
	loading: boolean
	onSearch: () => void
}

const LotteryTicketReportFilter: FC<ILotteryTicketReportFilterProps> = ({
	form,
	loading,
	onSearch,
}) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()
	const currencyIdsBySiteIds = useAppSelector(selectCurrencyListBySite)
	const userSiteList = useAppSelector(selectUserSiteList)

	/**  ======= 對內函數 ======= */

	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: ('all' | number)[]) => {
			if (newCurrencyIds.includes('all')) {
				form.setFieldsValue({
					currencyIds: currencyIdsBySiteIds?.map(
						({ currencyId }) => currencyId
					),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds as number[],
				})
			}
		}
		return (
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
				<MultipleSelect
					onChange={onChangeCurrency}
					placeholder={t('Label_Select')}
				>
					{(currencyIdsBySiteIds?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{currencyIdsBySiteIds?.map(item => (
						<Option key={item.currencyId} value={item.currencyId}>
							{item.isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const onChangeSiteId = (siteId: number) => {
		form.setFieldsValue({ siteId })
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={onSearch}
						initialValues={{
							userName: '',
							roundId: 1,
							ticketNumber: '',
							siteId: 1,
							currencyIds: currencyIdsBySiteIds?.map(item => item.currencyId),
						}}
					>
						{/* 姓名 /roundId / ticketNumber --- 輸入框 */}
						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_UserName')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='ticketNo' label={t('Label_TicketNumber')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='roundId'
									label={t('Label_Round')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Round'),
											}),
										},
									]}
								>
									<Input allowClear />
								</Form.Item>
							</Col>

							{/* siteId --- Selector */}
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='siteId'
									label={t('Label_Site')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Site'),
											}),
										},
									]}
								>
									<Select placeholder='select' onChange={onChangeSiteId}>
										{userSiteList?.map(({ siteId, siteName }) => (
											<Option key={siteId} value={siteId}>
												{siteName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							{/* currencyIds --- Selector */}
							<Col lg={6} md={24} xs={24}>
								{currencyIdsSelector()}
							</Col>
						</Row>

						{/* submit button */}
						<Row justify='end' align='middle' gutter={16}>
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
export { LotteryTicketReportFilter }

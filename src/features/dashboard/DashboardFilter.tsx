import { Button, Col, Form, Row, Select, Skeleton } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { FC } from 'react'

import { useTranslation } from 'react-i18next'
import { fetchDashBoardGetDataAsync } from './thunk'

const { Option } = Select

const useDashboardFilterAction = () => {
	const [form] = Form.useForm()
	const dispatch = useAppDispatch()
	const userSite = useAppSelector(state => state.allEnum.userSite)

	const { loading: allEnumLoading } = useAppSelector(state => state.allEnum)
	const { loading: dashboardLoading } = useAppSelector(state => state.dashboard)
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const handleSearch = (formValues: any) => {
		const { currencyId, baseCurrencyId } = formValues

		dispatch(
			fetchDashBoardGetDataAsync({
				siteId: userSite?.siteId,
				currencyId,
				baseCurrencyId,
			})
		)
	}

	return {
		form,
		allEnumLoading,
		dashboardLoading,
		currencyListBySite,
		handleSearch,
	}
}

const DashboardFilter: FC = () => {
	const { t } = useTranslation()

	const {
		form,
		allEnumLoading,
		dashboardLoading,
		currencyListBySite,
		handleSearch,
	} = useDashboardFilterAction()

	const loading = allEnumLoading || currencyListBySite === undefined

	return (
		<LayoutContent.Card>
			{loading ? (
				<Skeleton />
			) : (
				<Form
					layout='vertical'
					form={form}
					onFinish={handleSearch}
					initialValues={{
						currencyId: 0,
						baseCurrencyId: currencyListBySite?.[0]?.currencyId ?? null,
					}}
				>
					<Row gutter={24} align='middle'>
						<Col md={6} xs={12}>
							<Form.Item name='currencyId' label={t('Label_Currency')}>
								<Select loading={allEnumLoading} placeholder='select'>
									<Option value={0}>{t('Label_SelectAll')}</Option>

									{currencyListBySite?.map(item => (
										<Option key={item.currencyId} value={item.currencyId}>
											{item.isoCode}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col md={6} xs={12}>
							<Form.Item name='baseCurrencyId' label={t('BaseCurrency')}>
								<Select loading={allEnumLoading} placeholder='select'>
									{currencyListBySite?.map(item => (
										<Option key={item.currencyId} value={item.currencyId}>
											{item.isoCode}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row justify='end' align='middle'>
						<Col>
							<Form.Item>
								<Button
									icon={<SearchOutlined />}
									loading={dashboardLoading}
									htmlType='submit'
									type='primary'
								>
									{t('Label_Search')}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			)}
		</LayoutContent.Card>
	)
}

export { DashboardFilter }

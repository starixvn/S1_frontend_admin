import { Button, Col, Form, FormInstance, Row, Select, Skeleton } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectEnumStatus } from 'common/enum'
import { FC } from 'react'

import { useTranslation } from 'react-i18next'
import { fetchDashBoardGetDataAsync } from './thunk'

const { Option } = Select

const useDashboardFilterAction = () => {
	const dispatch = useAppDispatch()
	const userSite = useAppSelector(state => state.allEnum.userSite)

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

	return {}
}

const DashboardFilter: FC<{
	form: FormInstance<any>
	loading: boolean
	onSearch: (formValues: any) => void
}> = ({ form, loading, onSearch }) => {
	const { t } = useTranslation()
	const enumStatus = useAppSelector(selectEnumStatus)
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	return (
		<LayoutContent.Card>
			{enumStatus === 'pending' || currencyListBySite === undefined ? (
				<Skeleton />
			) : (
				<Form
					layout='vertical'
					form={form}
					onFinish={onSearch}
					initialValues={{
						currencyId: 0,
						baseCurrencyId: currencyListBySite?.[0]?.currencyId ?? null,
					}}
				>
					<Row gutter={16} align='middle'>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='currencyId' label={t('Label_Currency')}>
								<Select placeholder='select'>
									<Option value={0}>{t('Label_SelectAll')}</Option>

									{currencyListBySite?.map(item => (
										<Option key={item.currencyId} value={item.currencyId}>
											{item.isoCode}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='baseCurrencyId' label={t('BaseCurrency')}>
								<Select placeholder='select'>
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
									loading={loading}
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

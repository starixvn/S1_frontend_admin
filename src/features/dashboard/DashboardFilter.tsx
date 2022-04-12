import { Button, Col, Row } from 'antd'
import { Select } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { FC } from 'react'
import { Currency } from 'common/enum/type'
import { useTranslation } from 'react-i18next'

const { Option } = Select

interface DashboardFilterInterface {
	loading: boolean
	currency: Currency | undefined
	baseCurrency: Currency | undefined
	handleCurrencyChange: (currencyId: number) => void
	handleBaseCurrencyChange: (currencyId: number) => void
	handleSearch: () => () => void
}

const DashboardFilter: FC<DashboardFilterInterface> = ({
	loading,
	currency,
	baseCurrency,
	handleCurrencyChange,
	handleBaseCurrencyChange,
	handleSearch,
}) => {
	const { t } = useTranslation()

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	return (
		<LayoutContent.Card>
			<Row justify='start' gutter={8}>
				<Col span={6}>
					<Select
						loading={loading}
						value={currency?.currencyId}
						onChange={handleCurrencyChange}
					>
						{currencyListBySite.map(item => (
							<Option key={item.currencyId} value={item.currencyId}>
								{item.isoCode}
							</Option>
						))}
					</Select>
				</Col>

				<Col span={6}>
					<Select
						loading={loading}
						value={baseCurrency?.currencyId}
						onChange={handleBaseCurrencyChange}
					>
						{currencyListBySite.map(item => (
							<Option key={item.currencyId} value={item.currencyId}>
								{item.isoCode}
							</Option>
						))}
					</Select>
				</Col>
			</Row>

			<br />

			<Row justify='end'>
				<Col>
					<Button
						loading={loading}
						onClick={handleSearch()}
						type='primary'
						icon={<SearchOutlined />}
					>
						{t('Label_Search')}
					</Button>
				</Col>
			</Row>
		</LayoutContent.Card>
	)
}

export { DashboardFilter }

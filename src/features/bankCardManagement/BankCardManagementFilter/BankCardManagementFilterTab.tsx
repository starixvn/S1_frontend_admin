import { Dispatch, FC, SetStateAction } from 'react'
import { FormInstance, Tabs } from 'antd'
import { Currency } from 'common/enum/type'
import { BankCardManagementFilterCell } from 'features/bankCardManagement/BankCardManagementFilter/BankCardManagementFilterCell'
import { useQueryParams } from 'common/hooks'
import { isEmpty } from 'lodash'

interface IBankCardManagementFilterProps {
	form: FormInstance
	currencyListBySite: Currency[]
	setCurrentCurrency: Dispatch<SetStateAction<number>>
	currentCurrency: number
}

const { TabPane } = Tabs

const BankCardManagementFilterTab: FC<IBankCardManagementFilterProps> = ({
	currencyListBySite,
	form,
	setCurrentCurrency,
	currentCurrency,
}) => {
	const [queryParams, setQueryParams] = useQueryParams()
	const handleTabsChange = (currency: string) => {
		if (!isEmpty(queryParams)) {
			setQueryParams({})
		}
		form.resetFields()
		setCurrentCurrency(Number(currency))
	}

	return (
		<Tabs
			type='card'
			activeKey={String(currentCurrency)}
			destroyInactiveTabPane
			tabBarStyle={{ margin: 0 }}
			onChange={(value: string) => handleTabsChange(value)}
		>
			{currencyListBySite?.map(currency => {
				const { isoCode, currencyId } = currency
				return (
					<TabPane tab={isoCode} key={currencyId}>
						<BankCardManagementFilterCell form={form} />
					</TabPane>
				)
			})}
		</Tabs>
	)
}

export { BankCardManagementFilterTab }

import { FormInstance, Tabs } from 'antd'
import { Dispatch, SetStateAction, useContext } from 'react'
import { useQueryParams } from 'common/hooks'
import { isEmpty } from 'lodash'
import { HotGameContext } from 'features/hotGameManagement/hotGameContext'
import { HotGameManagementFilterCell } from 'features/hotGameManagement/hotGameManagementFilter/HotGameManagementFilterCell'

interface IHotGameManagementFilterTabProps {
	form: FormInstance
	currentCurrency: number
	setCurrentCurrency: Dispatch<SetStateAction<number>>
}

const HotGameManagementFilterTab = ({
	form,
	currentCurrency,
	setCurrentCurrency,
}: IHotGameManagementFilterTabProps) => {
	const [queryParams, setQueryParams] = useQueryParams()
	const { currencyListBySite, isSortMode } = useContext(HotGameContext)
	const handleTabsChange = (currency: string) => {
		if (!isEmpty(queryParams)) {
			setQueryParams({})
		}
		form.resetFields()
		setCurrentCurrency(Number(currency))
	}

	const items = currencyListBySite?.map(currency => {
		const { isoCode, currencyId } = currency
		return {
			label: isoCode,
			key: String(currencyId),
			disabled: isSortMode,
			children: <HotGameManagementFilterCell form={form} />,
		}
	})

	return (
		<Tabs
			type='card'
			activeKey={String(currentCurrency)}
			destroyInactiveTabPane
			tabBarStyle={{ margin: 0 }}
			onChange={(value: string) => handleTabsChange(value)}
			items={items}
		/>
	)
}

export { HotGameManagementFilterTab }

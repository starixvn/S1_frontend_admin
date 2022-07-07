import { FC, useState } from 'react'
import { Collapse } from 'antd'
import GiftTabs from './GiftTabs'

const { Panel } = Collapse

interface IGiftListingFilterProps {
	loading: boolean
	onSearch: (values: any) => void
	currencyId: number
	setCurrencyId: (newCurrencyId: number) => void
}

const GiftListingFilter: FC<IGiftListingFilterProps> = ({
	loading,
	onSearch,
	currencyId,
	setCurrencyId,
}) => {
	const [tabActiveKey, setTabActiveKey] = useState<string>(String(currencyId))

	const handleTabsChange = (currencyIdKey: string) => {
		setTabActiveKey(currencyIdKey)
		setCurrencyId(Number(currencyIdKey))
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<GiftTabs
					loading={loading}
					tabActiveKey={tabActiveKey}
					onTabsChange={handleTabsChange}
					onSearch={onSearch}
				/>
			</Panel>
		</Collapse>
	)
}

export default GiftListingFilter

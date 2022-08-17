import { FC } from 'react'
import { Tabs } from 'antd'
import { useAppSelector } from 'app/store'
import { selectRewardsCurrencyListBySite } from 'common/enum'
import GiftTabPane from './GiftTabPane'

interface IGiftTabsProps {
	loading: boolean
	tabActiveKey: string
	onTabsChange: (currencyIdKey: string) => void
	onSearch: (values: any) => void
}

const GiftTabs: FC<IGiftTabsProps> = ({
	loading,
	tabActiveKey,
	onTabsChange,
	onSearch,
}) => {
	const currencyListBySite = useAppSelector(selectRewardsCurrencyListBySite)

	return (
		<Tabs onChange={onTabsChange} type='card' activeKey={tabActiveKey}>
			{currencyListBySite.map(({ currencyId, isoCode }) => (
				<GiftTabPane
					key={currencyId}
					loading={loading}
					tab={isoCode}
					currencyId={currencyId}
					tabActiveKey={tabActiveKey}
					onSearch={onSearch}
				/>
			))}
		</Tabs>
	)
}

export default GiftTabs

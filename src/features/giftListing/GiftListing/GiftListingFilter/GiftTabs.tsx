import { FC } from 'react'
import { Tabs } from 'antd'
import { useAppSelector } from 'app/store'
import { selectRewardsCurrencyListBySite } from 'common/enum'
import { GiftTabPane } from 'features/giftListing/GiftListing/GiftListingFilter/GiftTabPane'

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

	const items = currencyListBySite?.map(({ currencyId, isoCode }) => {
		return {
			label: isoCode,
			key: String(currencyId),
			children: (
				<GiftTabPane
					loading={loading}
					tab={isoCode}
					currencyId={currencyId}
					tabActiveKey={tabActiveKey}
					onSearch={onSearch}
				/>
			),
		}
	})
	return (
		<Tabs
			onChange={onTabsChange}
			type='card'
			activeKey={tabActiveKey}
			items={items}
		/>
	)
}

export default GiftTabs

import React, { FC, useContext } from 'react'
import { Tabs } from 'antd'
import { Currency } from 'common/enum/type'
import { LayoutContent } from 'app/pages/layout'
import { BonusDetailSubForm } from 'features/bonusManagement/editBonusDetail/BonusDetailSubForm'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'

interface IBonusDetailTabProps {
	loading: boolean
	currencyListBySite: Currency[]
}
const { TabPane } = Tabs

const BonusDetailTab: FC<IBonusDetailTabProps> = ({
	loading,
	currencyListBySite,
}) => {
	const { form, setCurrentTabActive, setCurrentCurrency } =
		useContext(EditBonusContext)
	const handleTabsChange = (currentCurrency: any) => {
		const current = JSON.parse(currentCurrency) as Currency
		const { isoCode } = current
		const initActive = form?.getFieldValue(['specific', isoCode, 'active'])
		// 切Tab 後初始化 該頁 Active 預設的狀態
		if (setCurrentTabActive) {
			setCurrentTabActive(Boolean(initActive))
		}
		// 提供當前正確的 currency 供 api 獲取 langCode
		if (setCurrentCurrency) {
			setCurrentCurrency(current)
		}
	}

	return (
		<LayoutContent.Card>
			<Tabs defaultActiveKey='1' type='card' onChange={handleTabsChange}>
				{currencyListBySite?.map(currency => {
					return (
						<TabPane tab={currency.isoCode} key={JSON.stringify(currency)}>
							<BonusDetailSubForm loading={loading} currency={currency} />
						</TabPane>
					)
				})}
			</Tabs>
		</LayoutContent.Card>
	)
}

export { BonusDetailTab }

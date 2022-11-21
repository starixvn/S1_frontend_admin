import { FormInstance, Tabs } from 'antd'
import { selectCurrencyListBySite } from 'common/enum'
import BannerManagementTabPanel from 'features/bannerManagement/BannerManagementFilter/BannerManagementTabPanel'
import { IEnumTypeData } from 'common/service/enumApi'
import { IFilterForm } from 'features/bannerManagement/type'
import { useAppSelector } from 'app/store'

interface IBannerManagementTabsProps {
	filterForm: FormInstance<IFilterForm>
	loading: boolean
	bannerTypeList: IEnumTypeData[]
	tabActiveKey: string
	onTabsChange: (currencyIdKey: string) => void
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const BannerManagementTabs = ({
	filterForm,
	loading,
	bannerTypeList,
	tabActiveKey,
	onTabsChange,
	onSearch,
}: IBannerManagementTabsProps) => {
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const items = currencyListBySite?.map(({ currencyId, isoCode }) => {
		return {
			label: isoCode,
			key: String(currencyId),
			children: (
				<BannerManagementTabPanel
					filterForm={filterForm}
					loading={loading}
					bannerTypeList={bannerTypeList}
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

export default BannerManagementTabs

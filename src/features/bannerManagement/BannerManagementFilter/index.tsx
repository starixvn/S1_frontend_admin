import { Collapse, FormInstance } from 'antd'
import BannerManagementTabs from 'features/bannerManagement/BannerManagementFilter/BannerManagementTabs'
import { IEnumTypeData } from 'common/service/enumApi'
import { IFilterForm } from 'features/bannerManagement/type'
import { useState } from 'react'
import { BANNER_STATUS_OPTIONS } from 'features/bannerManagement/constants'

interface IBannerManagementFilterProps {
	filterForm: FormInstance<IFilterForm>
	loading: boolean
	currencyId: number
	bannerTypeList: IEnumTypeData[]
	setCurrencyId: (newCurrencyId: number) => void
	setQueryParams: (args: {}) => void
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const { Panel } = Collapse

const BannerManagementFilter = ({
	filterForm,
	loading,
	currencyId,
	bannerTypeList,
	setCurrencyId,
	setQueryParams,
	onSearch,
}: IBannerManagementFilterProps) => {
	const [tabActiveKey, setTabActiveKey] = useState<string>(String(currencyId))

	const handleTabsChange = (currencyIdKey: string) => {
		setTabActiveKey(currencyIdKey)
		setCurrencyId(Number(currencyIdKey))
		setQueryParams({})
		filterForm.setFieldsValue({
			bannerTypes: bannerTypeList.map(({ value }) => value),
			statuses: BANNER_STATUS_OPTIONS.map(({ value }) => value),
		})
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<BannerManagementTabs
					filterForm={filterForm}
					loading={loading}
					bannerTypeList={bannerTypeList}
					tabActiveKey={tabActiveKey}
					onTabsChange={handleTabsChange}
					onSearch={onSearch}
				/>
			</Panel>
		</Collapse>
	)
}

export default BannerManagementFilter

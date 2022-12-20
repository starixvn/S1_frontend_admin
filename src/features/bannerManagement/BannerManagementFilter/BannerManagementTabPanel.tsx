import { FormInstance, TabPaneProps } from 'antd'
import { IEnumTypeData } from 'common/service/enumApi'
import BannerManagementForm from 'features/bannerManagement/BannerManagementFilter/BannerManagementForm'
import { IFilterForm } from 'features/bannerManagement/type'

interface IBannerManagementTabPanelProps extends TabPaneProps {
	filterForm: FormInstance<IFilterForm>
	loading: boolean
	bannerTypeList: IEnumTypeData[]
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const BannerManagementTabPanel = ({
	filterForm,
	loading,
	bannerTypeList,
	onSearch,
}: IBannerManagementTabPanelProps) => {
	return (
		<BannerManagementForm
			form={filterForm}
			loading={loading}
			bannerTypeList={bannerTypeList}
			onSearch={onSearch}
		/>
	)
}

export default BannerManagementTabPanel

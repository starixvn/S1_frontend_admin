import { createContext } from 'react'
import {
	IGetBankInfoData,
	IGetEnumData,
	IGetPointLevelListData,
} from 'features/bankCardManagement/type'
import { IVipLevelsData } from 'common/service/allDataApi'

interface IFilterContextProps {
	loading: boolean
	isSearchLoading: boolean
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	purposeList: IGetEnumData[]
	agentList: string[]
	vipLevelList: IVipLevelsData[]
	statusEnumList: IGetEnumData[]
	bankInfoList: IGetBankInfoData[]
	pointLevelList: IGetPointLevelListData[]
}

const onSearch = () => {}

const initValue = {
	loading: false,
	isSearchLoading: false,
	onSearch,
	purposeList: [],
	agentList: [],
	vipLevelList: [],
	statusEnumList: [],
	bankInfoList: [],
	pointLevelList: [],
}

export const FilterContext = createContext<IFilterContextProps>(initValue)

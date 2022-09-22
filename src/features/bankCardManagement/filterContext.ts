import { createContext } from 'react'
import { IGetBankInfoData } from 'features/bankCardManagement/type'
import { IVipLevelsData } from 'common/service/allDataApi'
import { IEnumTypeData } from 'common/service/enumApi'

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
	purposeList: IEnumTypeData[]
	agentList: string[]
	vipLevelList: IVipLevelsData[]
	statusEnumList: IEnumTypeData[]
	bankInfoList: IGetBankInfoData[]
	supportChannelList: IEnumTypeData[]
	pointLevelList: number[]
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
	supportChannelList: [],
}

export const FilterContext = createContext<IFilterContextProps>(initValue)

import { createContext } from 'react'
import {
	IGetBankInfoData,
	ISelectListPaymentAgentData,
} from 'features/bankCardManagement/type'
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
	paymentAgentSelectList: ISelectListPaymentAgentData[]
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
	paymentAgentSelectList: [],
	vipLevelList: [],
	statusEnumList: [],
	bankInfoList: [],
	pointLevelList: [],
	supportChannelList: [],
}

export const FilterContext = createContext<IFilterContextProps>(initValue)

import { createContext } from 'react'
import { Currency } from 'common/enum/type'
import {
	ICommonTpData,
	IHotGameTopCategoryData,
	ITpGameTypeData,
} from 'features/hotGameManagement/type'

interface IHotGameContextProps {
	loading: boolean
	filterLoading: boolean
	tpGameTypeLoading: boolean
	commonTpList: ICommonTpData[]
	tpGameTypeList: ITpGameTypeData[]
	topCategoryList: IHotGameTopCategoryData[]
	currencyListBySite: Currency[]
	isSortMode: boolean
	onSearch: ({
		current,
		pageSize,
		currencyId,
	}: {
		current?: number
		pageSize?: number
		currencyId?: number
	}) => void
}

const onSearch = () => {}

const init = {
	loading: false,
	filterLoading: false,
	tpGameTypeLoading: false,
	isSortMode: false,
	commonTpList: [],
	tpGameTypeList: [],
	topCategoryList: [],
	currencyListBySite: [],
	onSearch,
}

export const HotGameContext = createContext<IHotGameContextProps>(init)

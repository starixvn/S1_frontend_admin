import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import _ from 'lodash'
import { fetchAllEnumAsync } from './thunk'
import { Currency, UserSite } from './type'

export interface EnumState {
	loading: boolean | undefined
	userSite?: UserSite
	userSiteList: UserSite[]
	allCurrencyList: Currency[]
}

const initialState: EnumState = {
	loading: undefined,
	userSite: undefined,
	userSiteList: [],
	allCurrencyList: [],
}

const enumSlice = createSlice({
	name: 'enum',
	initialState,
	reducers: {
		selectUserSite: (state, action) => {
			state.userSite = action.payload
		},
	},
	extraReducers: builder =>
		builder
			.addCase(fetchAllEnumAsync.pending, state => {
				state.loading = true
			})
			.addCase(fetchAllEnumAsync.fulfilled, (state, action) => {
				const { userSiteList, allCurrencyList } = action.payload as EnumState
				state.loading = false
				state.userSiteList = userSiteList
				state.allCurrencyList = allCurrencyList
			}),
})

export const selectCurrencyListBySite = (state: RootState) => {
	const { allCurrencyList, userSite } = state.allEnum

	if (userSite === undefined) return undefined

	// Returns the currency of the site
	return _.filter(allCurrencyList, currency =>
		_.some(
			userSite?.iCurrencyList,
			iCurrency => iCurrency === currency.currencyId
		)
	)
}

export const { selectUserSite } = enumSlice.actions

export default enumSlice.reducer

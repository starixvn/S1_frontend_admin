import { IAxiosResponse } from '../axiosBaseQuery'
import { rootApi } from '../rootApi/api'

export const permissionApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getLanguageList: builder.query<
			IAxiosResponse<string[]>,
			{ siteId?: number; currencyId: number }
		>({
			query: data => ({
				url: 'Permission/GetLanguageList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useGetLanguageListQuery, useLazyGetLanguageListQuery } =
	permissionApi

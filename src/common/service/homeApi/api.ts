import { IAxiosResponse } from '../axiosBaseQuery'
import { rootApi } from '../rootApi/api'

export const homeApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		checkBrand: builder.query<IAxiosResponse<number>, void>({
			query: data => ({
				url: 'Home/CheckBrand',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		changeBrand: builder.mutation<IAxiosResponse<number>, { siteId: number }>({
			query: data => ({
				url: 'Home/ChangeBrand',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useCheckBrandQuery, useChangeBrandMutation } = homeApi

import { rootApi } from 'common/service/rootApi/api'
import {
	IGetSpecialPasswordArg,
	IGetSpecialPasswordResponse,
	ISetSpecialPasswordArgs,
} from 'features/specialPasswordManagement/type'

export const specialPasswordApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPassword: builder.query<
			IGetSpecialPasswordResponse,
			IGetSpecialPasswordArg
		>({
			query: data => ({
				url: 'AdjustmentPassword/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setPassword: builder.mutation<void, ISetSpecialPasswordArgs>({
			query: data => ({
				url: 'AdjustmentPassword/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const { useGetPasswordQuery, useSetPasswordMutation } =
	specialPasswordApi

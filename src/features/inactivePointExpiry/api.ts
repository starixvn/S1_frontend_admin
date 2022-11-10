import { rootApi } from 'common/service/rootApi/api'
import {
	IGetInactivePointExpirySettingArg,
	IGetInactivePointExpirySettingResponse,
	ISetInactivePointExpirySettingArgs,
} from './type'

export const inactivePointExpiryApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getInactivePointExpirySetting: builder.query<
			IGetInactivePointExpirySettingResponse,
			IGetInactivePointExpirySettingArg
		>({
			query: data => ({
				url: `PointSetting/GetInactivePointExpirySetting`,
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setInactivePointExpirySetting: builder.mutation<
			void,
			ISetInactivePointExpirySettingArgs
		>({
			query: data => ({
				url: `PointSetting/SetInactivePointExpirySetting`,
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetInactivePointExpirySettingQuery,
	useSetInactivePointExpirySettingMutation,
} = inactivePointExpiryApi

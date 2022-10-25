import { rootApi } from '../rootApi/api'
import { IEnumTypeResponse, IGetEnumTypeArgs } from './type'

export const enumApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getEnumType: builder.query<IEnumTypeResponse, IGetEnumTypeArgs>({
			query: data => ({
				url: 'Enum/GetEnumType',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useGetEnumTypeQuery } = enumApi

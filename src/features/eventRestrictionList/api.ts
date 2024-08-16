import { rootApi } from 'common/service/rootApi/api'
import type {
	IGetEventRestrictionListArgs,
	ISetEventRestrictionArgs,
	IDelEventRestrictionArgs,
	TGetEventRestrictionListResponse,
} from 'features/eventRestrictionList/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const externalDomainApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getEventRestrictionList: builder.query<
			TGetEventRestrictionListResponse,
			IGetEventRestrictionListArgs
		>({
			query: data => ({
				url: 'LotteryEvent/GetEventRestrictionList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setEventRestriction: builder.mutation<
			IAxiosResponse<null>,
			ISetEventRestrictionArgs
		>({
			query: data => ({
				url: 'LotteryEvent/SetEventRestriction',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		delEventRestriction: builder.mutation<
			IAxiosResponse<null>,
			IDelEventRestrictionArgs
		>({
			query: data => ({
				url: 'LotteryEvent/DelEventRestriction',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetEventRestrictionListQuery,
	useSetEventRestrictionMutation,
	useDelEventRestrictionMutation,
} = externalDomainApi

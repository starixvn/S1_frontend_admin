import { rootApi } from 'common/service/rootApi/api'
import {
	IGetEventRestrictionListArgs,
	ISetEventRestrictionArgs,
	IDelEventRestrictionArgs,
	IGetEventRestrictionListResponse,
	ISetEventRestrictionResponse,
	IDelEventRestrictionResponse,
} from 'features/eventRestrictionList/type'

export const externalDomainApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getEventRestrictionList: builder.query<
			IGetEventRestrictionListResponse,
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
			ISetEventRestrictionResponse,
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
			IDelEventRestrictionResponse,
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

import { rootApi } from 'common/service/rootApi/api'
import {
	ICreateHotEventArgs,
	IDeleteHotEventArgs,
	IGetHotEventDetailArgs,
	IGetHotEventDetailResponse,
	IGetHotEventListArgs,
	IGetHotEventListResponse,
	IGetSportLeaguesResponse,
	IGetSportLeaguesTitleResponse,
	IGetSportTeamsArgs,
	IGetSportTeamsResponse,
	ISetHotEventArgs,
	ISetHotEventStatusArgs,
} from 'features/hotEventManagement/type'

export const hotEventManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getHotEventList: builder.query<
			IGetHotEventListResponse,
			IGetHotEventListArgs
		>({
			query: data => ({
				url: 'HotEvent/GetDataList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getHotEventDetail: builder.query<
			IGetHotEventDetailResponse,
			IGetHotEventDetailArgs
		>({
			query: data => ({
				url: 'HotEvent/GetDetail',
				method: 'POST',
				data,
			}),
		}),
		createHotEvent: builder.mutation<void, ICreateHotEventArgs>({
			query: data => ({
				url: 'HotEvent/CreateData',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setHotEvent: builder.mutation<void, ISetHotEventArgs>({
			query: data => ({
				url: 'HotEvent/SetData',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setHotEventStatus: builder.mutation<void, ISetHotEventStatusArgs>({
			query: data => ({
				url: 'HotEvent/SetStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteHotEvent: builder.mutation<void, IDeleteHotEventArgs>({
			query: data => ({
				url: 'HotEvent/DeleteData',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getSportLeagueTitle: builder.query<IGetSportLeaguesTitleResponse, null>({
			query: () => ({
				url: 'HotEvent/GetSportLeagueTitle',
				method: 'POST',
			}),
		}),
		getSportLeagues: builder.query<IGetSportLeaguesResponse, null>({
			query: () => ({
				url: 'HotEvent/GetSportLeagues',
				method: 'POST',
			}),
		}),
		getSportTeams: builder.query<IGetSportTeamsResponse, IGetSportTeamsArgs>({
			query: data => ({
				url: 'HotEvent/GetSportTeams',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetHotEventDetailQuery,
	useLazyGetHotEventListQuery,
	useGetSportLeaguesQuery,
	useLazyGetSportTeamsQuery,
	useGetSportLeagueTitleQuery,
	useCreateHotEventMutation,
	useSetHotEventStatusMutation,
	useSetHotEventMutation,
	useDeleteHotEventMutation,
} = hotEventManagementApi

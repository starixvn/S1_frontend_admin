import { rootApi } from 'common/service/rootApi/api'
import {
	IGetBetLimitArgs,
	IBetLimitResponse,
	IGetByCustIdArgs,
	IGetByCustIdResponse,
	IDeleteBetLimitArgs,
	ISetBetLimitArgs,
	IGetCustDetailsArgs,
	ICustInfoDetailsResponse,
	ITpCategoryListResponse,
	IGetTpCategoryListArgs,
} from 'features/betLimit/type'

const betLimitApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBetLimitList: builder.query<IBetLimitResponse, IGetBetLimitArgs>({
			query: data => ({
				url: 'TpBetLimit/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getByCustId: builder.query<IGetByCustIdResponse, IGetByCustIdArgs>({
			query: data => ({
				url: 'TpBetLimit/GetByCustId',
				method: 'POST',
				data,
			}),
		}),
		setBetLimit: builder.mutation<void, ISetBetLimitArgs>({
			query: data => ({
				url: 'TpBetLimit/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteBetLimit: builder.mutation<void, IDeleteBetLimitArgs>({
			query: data => ({
				url: 'TpBetLimit/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getCustInfoDetails: builder.query<
			ICustInfoDetailsResponse,
			IGetCustDetailsArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetCustInfoDetails',
				method: 'POST',
				data,
			}),
		}),
		getTpCategoryList: builder.query<
			ITpCategoryListResponse,
			IGetTpCategoryListArgs
		>({
			query: data => ({
				url: 'TpBetLimit/GetTpCategoryList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetBetLimitListQuery,
	useLazyGetByCustIdQuery,
	useSetBetLimitMutation,
	useDeleteBetLimitMutation,
	useLazyGetCustInfoDetailsQuery,
	useLazyGetTpCategoryListQuery,
} = betLimitApi

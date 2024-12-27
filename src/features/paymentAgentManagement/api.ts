import type {
	IGetPaymentAgentListArgs,
	IGetPaymentAgentUserArgs,
	IPaymentAgentUserResponse,
	ISetPaymentAgentArgs,
	ISetPaymentAgentStatusArgs,
	ISetPaymentAgentUserArgs,
	ISetPaymentAgentUserStatusArgs,
	PaymentAgentResponse,
} from './type'
import { rootApi } from '../../common/service/rootApi/api'

export const paymentAgentApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getPaymentAgentList: builder.query<
			PaymentAgentResponse,
			IGetPaymentAgentListArgs
		>({
			query: data => ({
				url: 'PaymentAgent/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		setPaymentAgentStatus: builder.mutation<void, ISetPaymentAgentStatusArgs>({
			query: data => ({
				url: 'PaymentAgent/SetStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setPaymentAgent: builder.mutation<void, ISetPaymentAgentArgs>({
			query: data => ({
				url: 'PaymentAgent/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		setPaymentAgentUser: builder.mutation<void, ISetPaymentAgentUserArgs>({
			query: data => ({
				url: 'PaymentAgent/SetUser',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST2'],
		}),
		setPaymentAgentUserStatus: builder.mutation<
			void,
			ISetPaymentAgentUserStatusArgs
		>({
			query: data => ({
				url: 'PaymentAgent/SetUserStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST2'],
		}),
		getPaymentAgentUserList: builder.query<
			IPaymentAgentUserResponse,
			IGetPaymentAgentUserArgs
		>({
			query: data => ({
				url: 'PaymentAgent/GetUserList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST2'],
		}),
		// 沒用到通知 anise 刪除
		getPaymentAgentUser: builder.query<
			PaymentAgentResponse,
			IGetPaymentAgentUserArgs
		>({
			query: data => ({
				url: 'PaymentAgent/GetUser',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useLazyGetPaymentAgentListQuery,
	useSetPaymentAgentStatusMutation,
	useSetPaymentAgentMutation,
	useSetPaymentAgentUserMutation,
	useSetPaymentAgentUserStatusMutation,
	useGetPaymentAgentUserListQuery,
	useGetPaymentAgentUserQuery,
} = paymentAgentApi

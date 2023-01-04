import { rootApi } from 'common/service/rootApi/api'
import {
	IDeleteMessageArgs,
	IExportMessageResultArgs,
	IMessageData,
	IGetMessageDetailArgs,
	IMessageDetailData,
	IGetMessageListArgs,
	IUpdateMessageArgs,
	ILangCodesData,
} from 'features/smsGenerator/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const smsGenerator = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMessageList: builder.query<
			IAxiosResponse<IMessageData[]>,
			IGetMessageListArgs
		>({
			query: data => ({
				url: 'PersonalMessage/GetBatchMessageList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getMessageDetail: builder.query<
			IAxiosResponse<IMessageDetailData>,
			IGetMessageDetailArgs
		>({
			query: data => ({
				url: 'PersonalMessage/GetBatchMessage',
				method: 'POST',
				data,
			}),
		}),
		getLangCodes: builder.query<
			IAxiosResponse<ILangCodesData>,
			{ siteId?: number }
		>({
			query: data => ({
				url: 'PersonalMessage/GetServerInfo',
				method: 'POST',
				data,
			}),
		}),
		updateMessage: builder.mutation<IAxiosResponse<void>, IUpdateMessageArgs>({
			query: data => ({
				url: 'PersonalMessage/UpdateBatchMessage',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteMessage: builder.mutation<IAxiosResponse<void>, IDeleteMessageArgs>({
			query: data => ({
				url: 'PersonalMessage/DeleteBatchMessage',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		sendMessage: builder.mutation<IAxiosResponse<void>, FormData>({
			query: data => ({
				url: 'PersonalMessage/SendMessageBatch',
				method: 'POST',
				data,
				// FormData content-type
				headers: {
					'content-type':
						'multipart/form-data; boundary=<calculated when request is sent>',
				},
			}),
			invalidatesTags: ['POST'],
		}),
		exportMessageResult: builder.mutation<Blob, IExportMessageResultArgs>({
			query: data => ({
				url: 'PersonalMessage/ExportSendMessageBatchResultReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetMessageListQuery,
	useGetLangCodesQuery,
	useGetMessageDetailQuery,
	useUpdateMessageMutation,
	useDeleteMessageMutation,
	useSendMessageMutation,
	useExportMessageResultMutation,
} = smsGenerator

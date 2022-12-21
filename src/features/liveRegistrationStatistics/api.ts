import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IExportRegistrationManagementArgs,
	IGetRegistrationManagementListArgs,
	IRegistrationManagementNoteResponse,
	IRegistrationManagementResponse,
	ISetRegistrationManagementArgs,
} from './type'

export const liveRegistrationStatisticsApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// * 取得註冊會員與狀態清單
		getRegistrationManagementList: builder.query<
			IRegistrationManagementResponse,
			IGetRegistrationManagementListArgs
		>({
			query: data => ({
				url: 'RegistrationManagement/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 更新會員狀態
		setRegistrationManagement: builder.mutation<
			IAxiosResponse<void>,
			ISetRegistrationManagementArgs
		>({
			query: data => ({
				url: 'RegistrationManagement/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 匯出註冊會員與狀態清單
		exportRegistrationManagement: builder.mutation<
			Blob,
			IExportRegistrationManagementArgs
		>({
			query: data => ({
				url: 'RegistrationManagement/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		// * 寫入客服致電紀錄
		callingRecordRegistrationManagement: builder.mutation<
			any,
			{
				siteId: number
				custId: number
			}
		>({
			query: data => ({
				url: 'RegistrationManagement/CallingRecord',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 取得註記資料
		getRegistrationManagementNotes: builder.query<
			IRegistrationManagementNoteResponse,
			{
				custId: number | undefined
			}
		>({
			query: data => ({
				url: 'RegistrationManagement/Note/Get',
				method: 'POST',
				data,
			}),
			providesTags: ['NOTE_POST'],
		}),
		// *  新增註記資料
		addRegistrationManagementNote: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				note: string
			}
		>({
			query: data => ({
				url: 'RegistrationManagement/Note/Add',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['NOTE_POST'],
		}),
		// *  刪除註記資料
		deleteRegistrationManagementNote: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				id: number
			}
		>({
			query: data => ({
				url: 'RegistrationManagement/Note/Delete',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['NOTE_POST'],
		}),
		// *  更新註記資料
		editRegistrationManagementNote: builder.mutation<
			IAxiosResponse<void>,
			{
				custId: number
				id: number
				note: string
			}
		>({
			query: data => ({
				url: 'RegistrationManagement/Note/Edit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['NOTE_POST'],
		}),
	}),
})

export const {
	useLazyGetRegistrationManagementListQuery,
	useGetRegistrationManagementNotesQuery,
	useSetRegistrationManagementMutation,
	useExportRegistrationManagementMutation,
	useAddRegistrationManagementNoteMutation,
	useDeleteRegistrationManagementNoteMutation,
	useEditRegistrationManagementNoteMutation,
	useCallingRecordRegistrationManagementMutation,
} = liveRegistrationStatisticsApi

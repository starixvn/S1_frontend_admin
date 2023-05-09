import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import {
	IGetMemberListArgs,
	IMemberResponse,
	IVipLevelData,
	ITagData,
	IExportMemberArgs,
	IGetRegisterMemberArgs,
} from './type'

export const memberAdministrationListApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMemberList: builder.query<IMemberResponse, IGetMemberListArgs>({
			query: data => ({
				url: 'Member/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getAllTag: builder.query<IAxiosResponse<ITagData[]>, void>({
			query: () => ({
				url: 'TagManagement/GetAllTag',
				method: 'POST',
			}),
		}),
		getVipLevelSettings: builder.query<
			IAxiosResponse<IVipLevelData[]>,
			{ siteId?: number }
		>({
			query: data => ({
				url: 'VipLevel/GetSetting',
				method: 'POST',
				data,
			}),
		}),
		exportMember: builder.mutation<Blob, IExportMemberArgs>({
			query: data => ({
				url: 'Member/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getRegisterMember: builder.mutation<
			IAxiosResponse<null>,
			IGetRegisterMemberArgs
		>({
			query: data => ({
				url: 'Member/RegisterMember',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetMemberListQuery,
	useGetAllTagQuery,
	useGetVipLevelSettingsQuery,
	useExportMemberMutation,
	useGetRegisterMemberMutation,
} = memberAdministrationListApi

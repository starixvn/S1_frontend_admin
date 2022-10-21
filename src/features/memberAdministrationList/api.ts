import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetMemberListArgs,
	IMemberResponse,
	IVipLevelData,
	ITagData,
	IExportMemberArgs,
} from './type'

export const memberAdministrationListApi = createApi({
	reducerPath: 'MemberAdministrationListApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: builder => ({
		getMemberList: builder.query<IMemberResponse, IGetMemberListArgs>({
			query: data => ({
				url: 'Member/GetList',
				method: 'POST',
				data,
			}),
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
	}),
})

export const {
	useLazyGetMemberListQuery,
	useGetAllTagQuery,
	useGetVipLevelSettingsQuery,
	useExportMemberMutation,
} = memberAdministrationListApi

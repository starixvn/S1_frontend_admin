import { rootApi } from 'common/service/rootApi/api'
import {
	IDeleteBannerArgs,
	IDeleteBannerResponse,
	IGetBannerArgs,
	IGetBannerListArgs,
	IGetBannerListResponse,
	IGetBannerResponse,
	IGetGameIdListArgs,
	IGetGameIdListResponse,
	IGetLanguageListArgs,
	IGetLanguageListResponse,
	IGetTpBySiteAndCurrencyArgs,
	IGetTpBySiteAndCurrencyResponse,
	IGetTpCategoryByTpIdArgs,
	IGetTpCategoryByTpIdResponse,
	IGetTpListByCategoryArgs,
	IGetTpListByCategoryResponse,
	ISetBannerArgs,
	ISetBannerResponse,
	IUpdateStatusArgs,
	IUpdateStatusResponse,
} from 'features/bannerManagement/type'

export interface IPostUploadImageResponse {
	data: {
		returnImagePath: string
	}
}

export const bannerManagementApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBannerList: builder.query<IGetBannerListResponse, IGetBannerListArgs>({
			query: data => ({
				url: 'Banner/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getBanner: builder.query<IGetBannerResponse, IGetBannerArgs>({
			query: data => ({
				url: 'Banner/GetBanner',
				method: 'POST',
				data,
			}),
		}),
		setBanner: builder.mutation<ISetBannerResponse, ISetBannerArgs>({
			query: data => ({
				url: 'Banner/SetBanner',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateStatus: builder.mutation<IUpdateStatusResponse, IUpdateStatusArgs>({
			query: data => ({
				url: 'Banner/UpdateStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		deleteBanner: builder.mutation<IDeleteBannerResponse, IDeleteBannerArgs>({
			query: data => ({
				url: 'Banner/DeleteBanner',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		getTpBySiteAndCurrency: builder.query<
			IGetTpBySiteAndCurrencyResponse,
			IGetTpBySiteAndCurrencyArgs
		>({
			query: data => ({
				url: 'BaseData/GetTpBySiteAndCurrency',
				method: 'POST',
				data,
			}),
		}),
		getTpCategoryByTpId: builder.query<
			IGetTpCategoryByTpIdResponse,
			IGetTpCategoryByTpIdArgs
		>({
			query: data => ({
				url: 'BaseData/GetTpCategoryByTpId',
				method: 'POST',
				data,
			}),
		}),
		getTpListByCategory: builder.query<
			IGetTpListByCategoryResponse,
			IGetTpListByCategoryArgs
		>({
			query: data => ({
				url: 'BaseData/GetTpListByCategory',
				method: 'POST',
				data,
			}),
		}),
		getLanguageList: builder.query<
			IGetLanguageListResponse,
			IGetLanguageListArgs
		>({
			query: data => ({
				url: 'Permission/GetLanguageList',
				method: 'POST',
				data,
			}),
		}),
		getGameIdList: builder.query<IGetGameIdListResponse, IGetGameIdListArgs>({
			query: data => ({
				url: 'BaseData/GetGameIdByTpIdAndCategoryId',
				method: 'POST',
				data,
			}),
		}),
		uploadBannerImage: builder.mutation<IPostUploadImageResponse, FormData>({
			query: data => ({
				url: 'UploadImage/BannerManagement',
				method: 'POST',
				data,
				headers: {
					'content-type':
						'multipart/form-data; boundary=<calculated when request is sent>',
				},
			}),
		}),
	}),
})

export const {
	useLazyGetBannerListQuery,
	useDeleteBannerMutation,
	useSetBannerMutation,
	useUpdateStatusMutation,
	useGetTpBySiteAndCurrencyQuery,
	useGetTpCategoryByTpIdQuery,
	useGetTpListByCategoryQuery,
	useLazyGetLanguageListQuery,
	useLazyGetBannerQuery,
	useGetGameIdListQuery,
	useUploadBannerImageMutation,
} = bannerManagementApi

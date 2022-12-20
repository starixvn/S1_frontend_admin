import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import { assign } from 'lodash'
import {
	IGetCategoriesArgs,
	ICategoriesResponse,
	IGetGiftListArgs,
	IGetGiftTagsArgs,
	IGiftTagsResponse,
	IGiftListResponse,
	IUpdateGiftArgs,
	IUpdateGiftSortArgs,
	ICreateGiftArgs,
	IGiftInfoResponse,
	IGetGiftInfoArgs,
	IInfos,
	IEditGiftForm,
} from './type'

export const giftListingApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// * 取得商品類別
		getCategories: builder.query<ICategoriesResponse, IGetCategoriesArgs>({
			query: data => ({
				url: 'GiftManagement/GetCategories',
				method: 'POST',
				data,
			}),
		}),
		// * 取得商品標籤
		GetGiftTags: builder.query<IGiftTagsResponse, IGetGiftTagsArgs>({
			query: data => ({
				url: 'GiftManagement/GetTags',
				method: 'POST',
				data,
			}),
		}),
		// * 取得兌換商品列表
		getGiftList: builder.query<IGiftListResponse, IGetGiftListArgs>({
			query: data => ({
				url: 'GiftManagement/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 修改兌換商品
		updateGift: builder.mutation<void, IUpdateGiftArgs>({
			query: data => ({
				url: 'GiftManagement/Update',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 修改商品排序
		updateGiftSort: builder.mutation<IAxiosResponse<void>, IUpdateGiftSortArgs>(
			{
				query: data => ({
					url: 'GiftManagement/SetSort',
					method: 'POST',
					data,
				}),
				invalidatesTags: ['POST'],
			}
		),
		// * 新增兌換商品
		createGift: builder.mutation<IAxiosResponse<void>, ICreateGiftArgs>({
			query: data => ({
				url: 'GiftManagement/Create',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 上傳商品圖片
		uploadGiftImage: builder.mutation<
			IAxiosResponse<{ pictureUrl: string }>,
			FormData
		>({
			query: data => ({
				url: 'GiftManagement/Upload',
				method: 'POST',
				data,
				headers: {
					'content-type':
						'multipart/form-data; boundary=<calculated when request is sent>',
				},
			}),
			invalidatesTags: ['POST'],
		}),
		// * 取得兌換商品內容
		getGiftInfo: builder.query<IAxiosResponse<IEditGiftForm>, IGetGiftInfoArgs>(
			{
				query: data => ({
					url: 'GiftManagement/Get',
					method: 'POST',
					data,
				}),
				providesTags: ['POST'],
				// * 整理資料格式以符合 GiftListingForm 元件預期
				transformResponse: (returnResponse: IGiftInfoResponse) => {
					const infos: IInfos = {}
					const newData = returnResponse.data.reduce((acc, cur) => {
						const { giftName, description, lang, tagIds, pictureUrl, ...rest } =
							cur
						infos[lang] = {
							name: giftName,
							description,
							pictureUrl,
						}
						return { ...acc, ...rest, tags: tagIds }
					}, {})
					const newReturnResponse: any = assign(returnResponse, {
						data: { ...newData, infos },
					})
					return newReturnResponse as IAxiosResponse<IEditGiftForm>
				},
			}
		),
	}),
})

export const {
	useLazyGetCategoriesQuery,
	useLazyGetGiftTagsQuery,
	useLazyGetGiftListQuery,
	useUpdateGiftMutation,
	useUpdateGiftSortMutation,
	useCreateGiftMutation,
	useUploadGiftImageMutation,
	useGetGiftInfoQuery,
} = giftListingApi

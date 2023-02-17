import { rootApi } from 'common/service/rootApi/api'
import {
	IChangeVipLevelResponse,
	IExportDowngradeListArgs,
	IExportUpgradeListArgs,
	IGetDowngradeListArgs,
	IDowngradeListResponse,
	IGetUpgradeListArgs,
	IUpgradeListResponse,
	IUpdateDowngradeArgs,
	IUpdateDowngradeResponse,
	IUpdateUpgradeArgs,
	IUpdateUpgradeResponse,
} from 'features/vipReview/type'

export const vipReviewApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getUpgradeList: builder.query<IUpgradeListResponse, IGetUpgradeListArgs>({
			query: data => ({
				url: 'VipLevelReview/GetUpgradeList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getDowngradeList: builder.query<
			IDowngradeListResponse,
			IGetDowngradeListArgs
		>({
			query: data => ({
				url: 'VipLevelReview/GetDowngradeList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		exportUpgradeList: builder.mutation<Blob, IExportUpgradeListArgs>({
			query: data => ({
				url: 'VipLevelReview/ExportUpgradeList',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		exportDowngradeList: builder.mutation<Blob, IExportDowngradeListArgs>({
			query: data => ({
				url: 'VipLevelReview/ExportDowngradeList',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		updateUpgrade: builder.mutation<IUpdateUpgradeResponse, IUpdateUpgradeArgs>(
			{
				query: data => ({
					url: 'VipLevelReview/UpdateUpgrade',
					method: 'POST',
					data,
				}),
				invalidatesTags: ['POST'],
			}
		),
		updateDowngrade: builder.mutation<
			IUpdateDowngradeResponse,
			IUpdateDowngradeArgs
		>({
			query: data => ({
				url: 'VipLevelReview/UpdateDowngrade',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		changeVipLevelBatch: builder.mutation<IChangeVipLevelResponse, FormData>({
			query: data => ({
				url: 'VipLevel/ChangeVipLevelBatch',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetUpgradeListQuery,
	useLazyGetDowngradeListQuery,
	useExportUpgradeListMutation,
	useExportDowngradeListMutation,
	useUpdateUpgradeMutation,
	useUpdateDowngradeMutation,
	useChangeVipLevelBatchMutation,
} = vipReviewApi

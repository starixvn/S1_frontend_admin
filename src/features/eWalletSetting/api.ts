import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'
import {
	IGetEWalletListArg,
	IGetEWalletListResponse,
	ISwitchStatusArgs,
	IUpdateEWalletArgs,
} from 'features/eWalletSetting/type'

export const eWalletSettingApi = createApi({
	reducerPath: 'eWalletSettingApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		// 取得列表
		getEWalletList: builder.query<IGetEWalletListResponse, IGetEWalletListArg>({
			query: data => ({
				url: 'WithdrawalLimitEWallet/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// 切換status
		setStatus: builder.mutation<void, ISwitchStatusArgs>({
			query: data => ({
				url: 'WithdrawalLimitEWallet/SwitchStatus',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		updateEWalletList: builder.mutation<void, IUpdateEWalletArgs>({
			query: data => ({
				url: 'WithdrawalLimitEWallet/Update',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useGetEWalletListQuery,
	useSetStatusMutation,
	useUpdateEWalletListMutation,
} = eWalletSettingApi

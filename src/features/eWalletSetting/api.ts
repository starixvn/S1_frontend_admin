import { rootApi } from 'common/service/rootApi/api'
import {
	IGetEWalletListArg,
	IGetEWalletListResponse,
	ISwitchStatusArgs,
	IUpdateEWalletArgs,
} from 'features/eWalletSetting/type'

export const eWalletSettingApi = rootApi.injectEndpoints({
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

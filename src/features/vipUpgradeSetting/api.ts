import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetUpgradeSettingArgs,
	IGetUpgradeSettingResponse,
	IGetVipUpgradeSupportCurrencyArgs,
	IGetVipUpgradeSupportCurrencyResponse,
	ISetUpgradeSetting,
} from 'features/vipUpgradeSetting/type'

export const upgradeSettingApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getVipUpgradeSupportCurrency: builder.query<
			IGetVipUpgradeSupportCurrencyResponse,
			IGetVipUpgradeSupportCurrencyArgs
		>({
			query: data => ({
				url: 'VipLevel/GetVipUpgradeSupportCurrency',
				method: 'POST',
				data,
			}),
		}),
		getUpgradeSetting: builder.query<
			IGetUpgradeSettingResponse,
			IGetUpgradeSettingArgs
		>({
			query: data => ({
				url: 'VipLevel/GetUpgradeSetting',
				method: 'POST',
				data,
			}),
		}),
		setUpgradeSetting: builder.mutation<
			IAxiosResponse<null>,
			ISetUpgradeSetting
		>({
			query: data => ({
				url: 'VipLevel/SetUpgradeSetting',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const {
	useGetVipUpgradeSupportCurrencyQuery,
	useLazyGetUpgradeSettingQuery,
	useSetUpgradeSettingMutation,
} = upgradeSettingApi

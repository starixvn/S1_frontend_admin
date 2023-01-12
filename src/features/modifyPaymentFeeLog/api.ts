import { rootApi } from 'common/service/rootApi/api'
import {
	IGetModifyPaymentChargeFeeListArgs,
	IGetModifyPaymentChargeFeeListResponse,
	IGetPaySettingListResponse,
	ISubmitPaySettingArgs,
	ISubmitPaySettingResponse,
} from 'features/modifyPaymentFeeLog/type'

export const modifyPaymentFeeLogApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getModifyPaymentChargeFeeList: builder.query<
			IGetModifyPaymentChargeFeeListResponse,
			IGetModifyPaymentChargeFeeListArgs
		>({
			query: data => ({
				url: 'ModifyPaymentChargeFee/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getPaySettingList: builder.query<IGetPaySettingListResponse, null>({
			query: data => ({
				url: 'GetAllData/GetPaySetting',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		submitPaySetting: builder.mutation<
			ISubmitPaySettingResponse,
			ISubmitPaySettingArgs
		>({
			query: data => ({
				url: 'ModifyPaymentChargeFee/Submit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})
export const {
	useLazyGetModifyPaymentChargeFeeListQuery,
	useGetPaySettingListQuery,
	useSubmitPaySettingMutation,
} = modifyPaymentFeeLogApi

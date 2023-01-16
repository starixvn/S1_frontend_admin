import { rootApi } from 'common/service/rootApi/api'
import {
	IGetModifyPaymentChargeFeeListArgs,
	IGetModifyPaymentChargeFeeListResponse,
	ISubmitPaySettingArgs,
} from 'features/modifyPaymentFeeLog/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

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
		submitPaySetting: builder.mutation<
			IAxiosResponse<null>,
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
	useSubmitPaySettingMutation,
} = modifyPaymentFeeLogApi

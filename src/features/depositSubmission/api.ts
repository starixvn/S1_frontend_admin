import { rootApi } from 'common/service/rootApi/api'
import {
	IGetBankInfoListArgs,
	IGetBankInfoListResponse,
} from 'features/depositSubmission/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

export const depositSubmissionApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getBankInfoList: builder.query<
			IGetBankInfoListResponse,
			IGetBankInfoListArgs
		>({
			query: data => ({
				url: 'BaseData/GetBankInfoOffListByCustVerify',
				method: 'POST',
				data,
			}),
		}),
		submitDeposit: builder.mutation<IAxiosResponse<null>, FormData>({
			query: data => ({
				url: 'DepositSubmission/Submit',
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

export const { useLazyGetBankInfoListQuery, useSubmitDepositMutation } =
	depositSubmissionApi

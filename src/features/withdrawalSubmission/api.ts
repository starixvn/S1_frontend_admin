import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery, IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IGetBankListArgs,
	IGetBankListResponse,
	IGetCryptoInfoResponse,
	IGetPaymentTypeResponse,
	ISubmitArgs,
} from 'features/withdrawalSubmission/type'

export const withdrawalSubmissionApi = createApi({
	reducerPath: 'withdrawalSubmissionApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	tagTypes: ['POST'],
	endpoints: builder => ({
		getBankList: builder.query<IGetBankListResponse, IGetBankListArgs>({
			query: data => ({
				url: 'WithdrawalSubmission/Verify',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		getPaymentType: builder.query<IGetPaymentTypeResponse, null>({
			query: () => ({
				url: 'Enum/GetEnumType',
				method: 'POST',
				data: { enumName: 'ApplicationAccountTypeEnum' },
			}),
		}),
		getCryptoInfo: builder.query<IGetCryptoInfoResponse, null>({
			query: () => ({
				url: 'GetAllData/GetCryptoInfoData',
				method: 'POST',
			}),
		}),
		submitWithdrawal: builder.mutation<IAxiosResponse<null>, ISubmitArgs>({
			query: data => ({
				url: 'WithdrawalSubmission/Submit',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
	}),
})

export const {
	useLazyGetBankListQuery,
	useGetPaymentTypeQuery,
	useGetCryptoInfoQuery,
	useSubmitWithdrawalMutation,
} = withdrawalSubmissionApi

import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { rootApi } from 'common/service/rootApi/api'
import { ICustInfoDetailData } from 'common/service/commonApi/type'

export const commonApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getCustInfoDetail: builder.query<
			IAxiosResponse<ICustInfoDetailData>,
			{ custId: number }
		>({
			query: data => ({
				url: 'CustomerManage/GetCustInfoDetail',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useGetCustInfoDetailQuery } = commonApi

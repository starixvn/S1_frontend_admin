import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IAdminUserLogData,
	IGetAdminUserLogArgs,
} from 'features/memberProfile/pages/adminUserLog/type'

const adminUserLogApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		GetAdminUserLog: builder.query<
			IAxiosResponse<IAdminUserLogData[]>,
			IGetAdminUserLogArgs
		>({
			query: data => ({
				url: 'CustomerManage/GetAdminOperateLogByCustId',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useLazyGetAdminUserLogQuery } = adminUserLogApi

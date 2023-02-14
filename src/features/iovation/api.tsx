import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetIovationReportArgs,
	IGetIovationReportExportArgs,
	IGetIovationAssociateAccountArgs,
	IIovationReportData,
	IIovationAssociateAccountData,
} from 'features/iovation/type'

export const lovationApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getIovationAssociateAccount: builder.query<
			IAxiosResponse<IIovationAssociateAccountData[]>,
			IGetIovationAssociateAccountArgs
		>({
			query: data => ({
				url: 'IovationReport/GetAssociateAccount',
				method: 'POST',
				data,
			}),
		}),
		getIovationReport: builder.query<
			IAxiosResponse<IIovationReportData[]>,
			IGetIovationReportArgs
		>({
			query: data => ({
				url: 'IovationReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		exportIovationReport: builder.mutation<Blob, IGetIovationReportExportArgs>({
			query: data => ({
				url: 'IovationReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetIovationAssociateAccountQuery,
	useLazyGetIovationReportQuery,
	useExportIovationReportMutation,
} = lovationApi

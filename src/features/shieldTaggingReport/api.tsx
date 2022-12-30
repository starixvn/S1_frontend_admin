import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetShieldTaggingReportArgs,
	IGetShieldTaggingReportExportArgs,
	IGetShieldTaggingAssociateAccountReportArgs,
	IShieldTaggingAssociateAccountData,
	IShieldTaggingReportResponse,
} from 'features/shieldTaggingReport/type'

export const shieldTaggingReport = rootApi.injectEndpoints({
	endpoints: builder => ({
		getShieldTaggingAssociateAccountReport: builder.query<
			IAxiosResponse<IShieldTaggingAssociateAccountData[]>,
			IGetShieldTaggingAssociateAccountReportArgs
		>({
			query: data => ({
				url: 'ShieldTaggingReport/GetAssociateAccount',
				method: 'POST',
				data,
			}),
		}),
		getShieldTaggingReport: builder.query<
			IShieldTaggingReportResponse,
			IGetShieldTaggingReportArgs
		>({
			query: data => ({
				url: 'ShieldTaggingReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		getShieldTaggingReportExport: builder.mutation<
			Blob,
			IGetShieldTaggingReportExportArgs
		>({
			query: data => ({
				url: 'ShieldTaggingReport/GetExport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetShieldTaggingAssociateAccountReportQuery,
	useLazyGetShieldTaggingReportQuery,
	useGetShieldTaggingReportExportMutation,
} = shieldTaggingReport

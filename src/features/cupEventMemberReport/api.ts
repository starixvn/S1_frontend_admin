import { rootApi } from 'common/service/rootApi/api'
import { assign } from 'lodash'
import {
	IExportMemberReportArgs,
	IGetMemberReportArgs,
	IGetMemberReportResponse,
	ICupEventTeamResponse,
	IGetCupEventSettingResponse,
} from './type'

export const cupEventMemberReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMemberReport: builder.query<
			IGetMemberReportResponse,
			IGetMemberReportArgs
		>({
			query: data => ({
				url: 'CupEvent/GetCupEventMemberReport',
				method: 'POST',
				data,
			}),
		}),
		exportMemberReport: builder.mutation<Blob, IExportMemberReportArgs>({
			query: data => ({
				url: 'CupEvent/ExportCupEventMemberReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getCupEventTeams: builder.query<ICupEventTeamResponse, null>({
			query: () => ({
				url: 'CupEvent/GetCupEventPredictionSetting',
				method: 'POST',
			}),
			transformResponse: (response: IGetCupEventSettingResponse) => {
				const {
					data: { selectOptions },
				} = response
				const newResponse: any = assign(response, {
					data: selectOptions,
				})

				return newResponse
			},
		}),
	}),
})

export const {
	useLazyGetMemberReportQuery,
	useExportMemberReportMutation,
	useGetCupEventTeamsQuery,
} = cupEventMemberReportApi

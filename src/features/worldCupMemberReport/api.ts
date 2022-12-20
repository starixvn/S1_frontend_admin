import { rootApi } from 'common/service/rootApi/api'
import { assign } from 'lodash'
import {
	IExportMemberReportArgs,
	IGetMemberReportArgs,
	IGetMemberReportResponse,
	IGetWorldCupSettingResponse,
	IWorldCupTeamResponse,
} from './type'

export const worldCupMemberReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getMemberReport: builder.query<
			IGetMemberReportResponse,
			IGetMemberReportArgs
		>({
			query: data => ({
				url: 'WorldCupPrediction/GetMemberReport',
				method: 'POST',
				data,
			}),
		}),
		exportMemberReport: builder.mutation<Blob, IExportMemberReportArgs>({
			query: data => ({
				url: 'WorldCupPrediction/ExportMemberReport',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
		getWorldCupTeams: builder.query<IWorldCupTeamResponse, null>({
			query: () => ({
				url: 'WorldCupPrediction/GetWorldCupPredictionSetting',
				method: 'POST',
			}),
			transformResponse: (response: IGetWorldCupSettingResponse) => {
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
	useGetWorldCupTeamsQuery,
} = worldCupMemberReportApi

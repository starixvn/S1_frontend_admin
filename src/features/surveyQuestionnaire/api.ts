import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	IExportQuestionnaireReportArgs,
	IGetQuestionnaireReportArgs,
	IQuestionnaireReportResponse,
	ISetQuestionnaireReportArgs,
} from './type'

export const surveyQuestionnaireApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		// * 更新問券資料
		getQuestionnaireReport: builder.query<
			IQuestionnaireReportResponse,
			IGetQuestionnaireReportArgs
		>({
			query: data => ({
				url: 'QuestionnaireReport/GetList',
				method: 'POST',
				data,
			}),
			providesTags: ['POST'],
		}),
		// * 更新feedback
		setQuestionnaireReport: builder.mutation<
			IAxiosResponse<void>,
			ISetQuestionnaireReportArgs
		>({
			query: data => ({
				url: 'QuestionnaireReport/Set',
				method: 'POST',
				data,
			}),
			invalidatesTags: ['POST'],
		}),
		// * 匯出問券資料
		exportQuestionnaireReport: builder.mutation<
			Blob,
			IExportQuestionnaireReportArgs
		>({
			query: data => ({
				url: 'QuestionnaireReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetQuestionnaireReportQuery,
	useSetQuestionnaireReportMutation,
	useExportQuestionnaireReportMutation,
} = surveyQuestionnaireApi

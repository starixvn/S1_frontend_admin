import { rootApi } from 'common/service/rootApi/api'
import { IGetOTPReportArgs, IOtpReportResponse } from './type'

export const otpVerificationReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getOTPReport: builder.query<IOtpReportResponse, IGetOTPReportArgs>({
			query: data => ({
				url: 'OTPReport/GetList',
				method: 'POST',
				data,
			}),
		}),
	}),
})

export const { useLazyGetOTPReportQuery } = otpVerificationReportApi

import { rootApi } from 'common/service/rootApi/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'

import {
	IGetFpsReportArgs,
	IGetFpsReportExportArgs,
	IGetFpsAssociateAccountArgs,
	IGetFpsAssociateDevicesArgs,
	TFpsReportData,
	TFpsAssociateAccountData,
	TFpsAssociateDevicesData,
} from 'features/fpsDeviceReport/type'

export const FpsDeviceReportApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getFpsReport: builder.query<
			IAxiosResponse<TFpsReportData[]>,
			IGetFpsReportArgs
		>({
			query: data => ({
				url: 'FPSReport/GetList',
				method: 'POST',
				data,
			}),
		}),
		getFpsAssociateAccount: builder.query<
			IAxiosResponse<TFpsAssociateAccountData[]>,
			IGetFpsAssociateAccountArgs
		>({
			query: data => ({
				url: 'FPSReport/GetAssociateAccount',
				method: 'POST',
				data,
			}),
		}),
		getFpsAssociateDevices: builder.query<
			IAxiosResponse<TFpsAssociateDevicesData[]>,
			IGetFpsAssociateDevicesArgs
		>({
			query: data => ({
				url: 'FPSReport/GetAssociateDevices',
				method: 'POST',
				data,
			}),
		}),
		exportFpsReport: builder.mutation<Blob, IGetFpsReportExportArgs>({
			query: data => ({
				url: 'FPSReport/Export',
				method: 'POST',
				data,
				responseType: 'blob',
			}),
		}),
	}),
})

export const {
	useLazyGetFpsReportQuery,
	useLazyGetFpsAssociateAccountQuery,
	useLazyGetFpsAssociateDevicesQuery,
	useExportFpsReportMutation,
} = FpsDeviceReportApi

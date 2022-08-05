import { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios, { AxiosRequestConfig } from 'axios'

export interface IAxiosResponse<T> {
	data: T
	totalPages?: number
	pageNumber?: number
	rowCount?: number
	errorCode: number
	message: string
	rawErrorCode?: string
	rawMessage?: string
}

export interface IAxiosError extends globalThis.Error {
	status?: number
	statusText?: string
	errorCode?: number
}

export const axiosBaseQuery =
	(
		{ baseUrl }: { baseUrl: string } = { baseUrl: '' }
	): BaseQueryFn<
		{
			url: string
			method: AxiosRequestConfig['method']
			data?: AxiosRequestConfig['data']
			params?: AxiosRequestConfig['params']
			headers?: AxiosRequestConfig['headers']
			responseType?: AxiosRequestConfig['responseType']
		},
		unknown,
		{ status?: number; statusText?: string; errorCode?: number }
	> =>
	async ({ url, method, data, params, headers, responseType }) => {
		try {
			const {
				data: axiosData,
				status,
				statusText,
			} = await axios({
				url: baseUrl + url,
				method,
				data,
				params,
				headers,
				responseType,
			})

			if (axiosData?.errorCode && axiosData?.errorCode !== 0) {
				const error: IAxiosError = new Error()
				error.message = axiosData?.message
				error.status = status
				error.statusText = statusText
				error.errorCode = axiosData?.errorCode
				throw error
			}

			return { data: axiosData }
		} catch (axiosError) {
			const error = axiosError as IAxiosError

			return {
				error: {
					status: error.status,
					message: error?.message,
					errorCode: error?.errorCode,
				},
			}
		}
	}

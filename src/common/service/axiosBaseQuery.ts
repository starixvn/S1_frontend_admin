import { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'

export interface IAxiosResponse<T> {
	data: T
	totalPages?: number
	pageNumber?: number
	rowCount?: number
	errorCode: number
	message: string
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
		},
		unknown,
		unknown
	> =>
	async ({ url, method, data, params }) => {
		try {
			const result = await axios({ url: baseUrl + url, method, data, params })

			if (result?.data?.errorCode !== 0) {
				throw new Error(result?.data?.message)
			}

			return { data: result.data }
		} catch (axiosError) {
			const error = axiosError as AxiosError

			return {
				error: {
					status: error.response?.status,
					message: error?.message || error.response?.statusText,
				},
			}
		}
	}

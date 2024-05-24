import { rootApi } from 'common/service/rootApi/api'
import { assign } from 'lodash'
import dayjs from 'dayjs'
import {
	IDepositPointSettingResponse,
	ISetDepositPointSettingArgs,
} from './type'

export const depositPointApi = rootApi.injectEndpoints({
	endpoints: builder => ({
		getDepositPointSetting: builder.query<
			IDepositPointSettingResponse,
			{ siteId: number | undefined }
		>({
			query: data => ({
				url: 'PointSetting/GetDepositPointSetting',
				method: 'POST',
				data,
			}),
			transformResponse: (returnResponse: IDepositPointSettingResponse) => {
				const newData = returnResponse.data.map(item => ({
					...item,
					promotionDateRange: [
						dayjs(item.promotionStartTime),
						dayjs(item.promotionEndTime),
					],
				}))

				const newReturnResponse = assign(returnResponse, { data: newData })
				return newReturnResponse
			},
			providesTags: ['POST'],
		}),
		setDepositPointSetting: builder.mutation<void, ISetDepositPointSettingArgs>(
			{
				query: data => ({
					url: 'PointSetting/SetDepositPointSetting',
					method: 'POST',
					data,
				}),
				invalidatesTags: ['POST'],
			}
		),
	}),
})

export const {
	useGetDepositPointSettingQuery,
	useSetDepositPointSettingMutation,
} = depositPointApi

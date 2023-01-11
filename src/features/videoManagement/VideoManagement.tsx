import { useEffect, useState } from 'react'
import { Form, message, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	useLazyGetVideoListQuery,
	useUpdateVideoMutation,
} from 'features/videoManagement/api'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import {
	IFilterForm,
	IGetVideoData,
	ITableForm,
} from 'features/videoManagement/type'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import VideoManagementFilter from 'features/videoManagement/VideoManagementFilter'
import VideoManagementTable from 'features/videoManagement/VideoManagementTable'
import {
	getLangIdsByCurrencies,
	LangObj,
} from 'features/videoManagement/constants'
import { includes, isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'

const VideoManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [tableForm] = Form.useForm<ITableForm>()
	const currencyIds = Form.useWatch('currencyIds', filterForm)
	const [editingKey, setEditingKey] = useState<IGetVideoData | undefined>(
		undefined
	)

	const {
		data: filterLangTypeList, // * 根據 currencies 回傳支援的 langIds
		isLoading: isGetLangTypeListLoading,
	} = useGetEnumTypeQuery(
		{ enumName: 'LangType' },
		{
			selectFromResult: ({
				data: { data: langTypeList = [] } = {},
				isLoading,
			}) => ({
				data: langTypeList.filter(({ value: currency }) => {
					const langIdsByCurrencies = getLangIdsByCurrencies(currencyIds)

					return includes(langIdsByCurrencies, currency)
				}),
				isLoading,
			}),
		}
	)

	const [
		getVideoList,
		{
			data: { data: videoList = [], rowCount: videoListTotal = 0 } = {},
			isFetching: isGetVideoListLoading,
		},
	] = useLazyGetVideoListQuery()

	const [updateVideo, { isLoading: isUpdateVideoLoading }] =
		useUpdateVideoMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: videoListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!siteId) return
		try {
			const { langIds, currencyIds: formCurrencyId } =
				filterForm.getFieldsValue()
			const args = {
				siteId,
				currencyIds: formCurrencyId,
				langIds,
				pageNumber: current,
				pageSize,
			}
			await getVideoList(args).unwrap()
			setQueryParams(args)
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleSaved = async () => {
		if (!siteId) return
		const { title, link } = tableForm.getFieldsValue()
		if (editingKey) {
			const {
				title: beforeTitle,
				link: beforeLink,
				langId,
				currencyId,
			} = editingKey
			try {
				const args = {
					siteId,
					currencyId,
					before: {
						langId: LangObj[langId],
						title: beforeTitle,
						link: beforeLink,
					},
					after: {
						langId: LangObj[langId],
						title,
						link,
					},
				}
				await updateVideo(args).unwrap()
				setEditingKey(undefined)
				message.success(t('System.Label_Success'))
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	useEffect(() => {
		const init = () => {
			if (!isEmpty(queryParams)) {
				const {
					currencyIds: queryCurrencyIds,
					langIds,
					pageNumber,
					pageSize,
				} = queryParams
				filterForm.setFieldsValue({
					currencyIds: queryCurrencyIds.map((currencyId: string) =>
						Number(currencyId)
					),
					langIds: langIds.map((langId: string) => Number(langId)),
				})
				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
				})
			} else {
				filterForm.setFieldsValue({
					currencyIds: currencyListBySite.map(({ currencyId }) => currencyId),
					langIds: filterLangTypeList.map(({ value }) => value),
				})
			}
		}
		init()
	}, [isGetLangTypeListLoading])

	const loading =
		isGetVideoListLoading || isUpdateVideoLoading || isGetLangTypeListLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<VideoManagementFilter
				loading={loading}
				form={filterForm}
				currencyListBySite={currencyListBySite}
				LangTypeList={filterLangTypeList}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<VideoManagementTable
					loading={loading}
					form={tableForm}
					videoList={videoList}
					pagination={pagination}
					editPermission={editPermission}
					currencyListBySite={currencyListBySite}
					editingKey={editingKey}
					setEditingKey={setEditingKey}
					onSaved={handleSaved}
					onTableChange={handleTableChange}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default VideoManagement

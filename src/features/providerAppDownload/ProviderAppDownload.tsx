import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useGetDeepLinkListQuery,
	useLazyGetDeepLinkQuery,
	useSetDeepLinkMutation,
} from 'features/providerAppDownload/api'
import { ProviderAppDownloadFilter } from 'features/providerAppDownload/ProviderAppDownloadFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useEffect, useState } from 'react'
import { head, isEmpty } from 'lodash'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { IEditForm, IFilterForm } from 'features/providerAppDownload/type'
import { ProviderAppDownloadTable } from 'features/providerAppDownload/ProviderAppDownloadTable'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useGetEnumTypeQuery } from 'common/service/enumApi'

const ProviderAppDownload = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()
	const currentDeepLink = Form.useWatch('deepLinkId', filterForm)
	const [editingKey, setEditingKey] = useState<string | undefined>(undefined)
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const {
		data: { data: deepLinkList = [] } = {},
		isLoading: isGetDeepLinkListLoading,
	} = useGetDeepLinkListQuery(null)

	const { data: { data: typeList = [] } = {} } = useGetEnumTypeQuery({
		enumName: 'DeepLinkTableTypeEnum',
	})

	const { data: { data: protocolList = [] } = {} } = useGetEnumTypeQuery({
		enumName: 'DeepLinkTableProtocolTypeEnum',
	})

	const [
		getDeepLink,
		{
			data: { data: deepLinkData = [], rowCount: deepLinkTotal = 0 } = {},
			isFetching: isGetDeepLinkLoading,
		},
	] = useLazyGetDeepLinkQuery()
	const [pagination, setPagination] = usePagination({
		paginationTotal: deepLinkTotal,
	})
	const [setDeepLink, { isLoading: isSetDeepLinkLoading }] =
		useSetDeepLinkMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		try {
			await getDeepLink({
				siteId,
				deepLinkId: currentDeepLink,
				pageNumber: current,
				pageSize,
			}).unwrap()

			setQueryParams({
				deepLinkId: currentDeepLink,
				pageNumber: current,
				pageSize,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		setEditingKey(undefined)
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleRowSaved = async () => {
		const args = await editForm.validateFields()
		try {
			const response = await setDeepLink({
				siteId,
				...args,
			}).unwrap()
			message.success(response?.message || t('System.Label_Success'))
			setEditingKey(undefined)
			filterForm.resetFields()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isGetDeepLinkListLoading) {
			filterForm.setFieldsValue({
				deepLinkId: head(deepLinkList)?.id,
			})
		}
	}, [isGetDeepLinkListLoading])

	useEffect(() => {
		if (currentDeepLink) {
			handleSearch({})
		}
	}, [currentDeepLink])

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const { deepLinkId, pageNumber, pageSize } = queryParams
			filterForm.setFieldsValue({
				deepLinkId: Number(deepLinkId),
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}
	}, [])

	const loading = isGetDeepLinkLoading || isSetDeepLinkLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<ProviderAppDownloadFilter
				loading={loading || isGetDeepLinkListLoading}
				form={filterForm}
				deepLinkList={deepLinkList}
			/>
			<ProviderAppDownloadTable
				loading={loading}
				form={editForm}
				deepLinkData={deepLinkData}
				editingKey={editingKey}
				timeZoneUtcOffset={timeZoneUtcOffset}
				editPermission={editPermission}
				typeList={typeList}
				protocolList={protocolList}
				setEditingKey={setEditingKey}
				deepLinkList={deepLinkList}
				pagination={pagination}
				onRowSaved={handleRowSaved}
				onTableChange={handleTableChange}
			/>
		</LayoutContent.Main>
	)
}

export default ProviderAppDownload

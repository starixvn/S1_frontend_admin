import dayjs from 'dayjs'
import { find, isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { selectUserSiteList } from 'common/enum'
import { utcFormatter, dateRangeToUtcFormatter } from 'common/utils'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { IFilterForm, IEditForm } from 'features/newsManagement/type'
import {
	useSetNewsMutation,
	useLazyGetNewsListQuery,
} from 'features/newsManagement/api'
import { JSONConverter } from 'features/newsManagement/utils'
import { NewsManagementFilter } from 'features/newsManagement/NewsManagementFilter'
import { NewsManagementTable } from 'features/newsManagement/NewsManagementTable'
import { NewsManagementModal } from 'features/newsManagement/EditNewsModal/EditNewsModal'

const NewsManagement = ({ pageTitle = '' }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()

	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const userSiteList = useAppSelector(selectUserSiteList)
	const editModal = useModal()

	const formSiteId = Form.useWatch('siteId', editForm)

	const {
		data: { data: statusEnumList = [] } = {},
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'NewsStatusEnum' })

	const [
		getNewsList,
		{
			data: { data: newsList = [], rowCount: newsListTotal = 0 } = {},
			isFetching: isGetNewsListLoading,
		},
	] = useLazyGetNewsListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: newsListTotal,
	})

	const [setNews, { isLoading: isSetNewsLoading }] = useSetNewsMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, status, siteId } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		const payload = {
			startDate,
			endDate,
			status,
			pageNumber: current,
			pageSize,
		}

		try {
			await getNewsList({
				siteIds: [siteId],
				...payload,
			}).unwrap()
			setQueryParams({
				timeZone: currentTimeZoneUtcOffset,
				siteId,
				...payload,
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
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleOpenModal = (newsId: number | 'Add') => {
		editForm.setFieldsValue({ newsId })
		editModal.onOpen()
	}

	const handleSetNews = async () => {
		try {
			const {
				newsId,
				postTime: rawPostTime,
				sort,
				status,
				imageUrl,
				title,
				content,
			} = await editForm.validateFields()

			const isAdd = !newsId

			const postTime = utcFormatter({
				date: rawPostTime,
				utcOffset: timeZoneUtcOffset,
			})

			const payload = {
				isAdd,
				siteId: formSiteId,
				title: JSONConverter(title),
				content: JSONConverter(content),
				imageUrl: JSONConverter(imageUrl),
				status: status ? 1 : 0,
				postTime,
				sort: Number(sort),
				newsId: Number(newsId) || 0,
			}

			try {
				const response = await setNews(payload).unwrap()
				message.success(response?.message || t('System.Label_Success'))
				editModal.onCancel()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		} catch (error: any) {
			const { errorFields = [] } = error
			// can find name inside errorField means missed required content in form
			if (find(errorFields, (item: any) => item?.name.length > 0)) {
				message.error(t('Label_EnLangRequiredMsg'))
			}
		}
	}

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const {
				siteId,
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
				status,
			} = queryParams

			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				siteId: siteId ? Number(siteId) : undefined,
				dateRange: [dayjs(startDate), dayjs(endDate)],
				status: status ? status?.map((value: string) => Number(value)) : [],
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		} else if (isEmpty(queryParams) && !isGetStatusListLoading) {
			filterForm.setFieldsValue({
				status: statusEnumList.map(({ value }) => value),
			})
		}
	}, [isGetStatusListLoading])

	const loading =
		isGetStatusListLoading || isGetNewsListLoading || isSetNewsLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle} />
			<NewsManagementFilter
				form={filterForm}
				loading={isGetNewsListLoading}
				statusEnumList={statusEnumList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
				userSiteList={userSiteList}
			/>
			{!isEmpty(queryParams) && (
				<NewsManagementTable
					newsList={newsList}
					pagination={pagination}
					editPermission={editPermission}
					getListLoading={isGetNewsListLoading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onOpenModal={handleOpenModal}
					onTableChange={handleTableChange}
				/>
			)}
			<NewsManagementModal
				open={editModal.visible}
				form={editForm}
				loading={loading}
				editPermission={editPermission}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onCancel={editModal.onCancel}
				onFinish={handleSetNews}
				onTimeZoneChange={onTimeZoneChange}
				userSiteList={userSiteList}
			/>
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => handleOpenModal('Add')}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default NewsManagement

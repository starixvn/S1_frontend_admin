import { FC, useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { HotEventManagementFilter } from 'features/hotEventManagement/HotEventManagementFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	useDeleteHotEventMutation,
	useGetSportLeagueTitleQuery,
	useLazyGetHotEventListQuery,
	useSetHotEventStatusMutation,
} from 'features/hotEventManagement/api'
import {
	HotEventMethodEnum,
	IGetHotEventListResponse,
	IGetSportLeaguesTitleResponse,
} from 'features/hotEventManagement/type'
import { AffixButtons } from 'components/AffixButtons'
import { HotEventManagementTable } from 'features/hotEventManagement/HotEventManagementTable'
import { useTimeZone } from 'components/TimeZoneSelect'
import { isEmpty } from 'lodash'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { useNavigate } from 'react-router-dom'

const HotEventManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()
	const [filterForm] = Form.useForm<{
		status: number
		sportLeaguesTitleId: number
	}>()
	const { timeZoneUtcOffset } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const navigate = useNavigate()

	const [
		getHotEventList,
		{
			data: {
				data: hotEventListData,
				rowCount: hotEventListTotal = 0,
			} = {} as IGetHotEventListResponse,
			isFetching: isGetHotEventListLoading,
		},
	] = useLazyGetHotEventListQuery()

	const [setHotEventStatus, { isLoading: isSetHotEventStatusLoading }] =
		useSetHotEventStatusMutation()

	const [deleteHotEvent, { isLoading: isDeleteHotEventLoading }] =
		useDeleteHotEventMutation()

	const {
		data: {
			data: sportLeagueTitleList = [],
		} = {} as IGetSportLeaguesTitleResponse,
		isLoading: isGetSportLeagueTitleLoading,
	} = useGetSportLeagueTitleQuery(null)

	const [pagination, setPagination] = usePagination({
		paginationTotal: hotEventListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { status, sportLeaguesTitleId } = filterForm.getFieldsValue()
		try {
			await getHotEventList({
				siteId,
				pageNumber: current,
				pageSize,
				status,
				sportLeaguesTitleId,
			}).unwrap()

			setQueryParams({
				pageNumber: current,
				pageSize,
				status,
				sportLeaguesTitleId,
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

	const handleDeleteHotEvent = async (id: number) => {
		try {
			await deleteHotEvent({ id }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetStatus = async ({
		id,
		status,
	}: {
		id: number
		status: number
	}) => {
		try {
			await setHotEventStatus({ id, status }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (!isEmpty(queryParams)) {
				const { pageNumber, pageSize, status, sportLeaguesTitleId } =
					queryParams
				filterForm.setFieldsValue({
					status: status ? Number(status) : 0,
					sportLeaguesTitleId: sportLeaguesTitleId
						? Number(sportLeaguesTitleId)
						: 0,
				})

				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
				})
			}
		}
		init()
	}, [])

	const loading =
		isGetHotEventListLoading ||
		isSetHotEventStatusLoading ||
		isDeleteHotEventLoading ||
		isGetSportLeagueTitleLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<HotEventManagementFilter
				loading={loading}
				form={filterForm}
				onSearch={handleSearch}
				sportLeagueTitleList={sportLeagueTitleList}
			/>
			{!isEmpty(queryParams) && (
				<HotEventManagementTable
					loading={loading}
					pagination={pagination}
					onTableChange={handleTableChange}
					onDeleteHotEvent={handleDeleteHotEvent}
					onSetStatus={handleSetStatus}
					timeZoneUtcOffset={timeZoneUtcOffset}
					editPermission={editPermission}
					deletePermission={deletePermission}
					hotEventList={hotEventListData}
				/>
			)}
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() =>
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.cms.sub.hotEventManagement.root}/${HotEventMethodEnum.Create}`
						)
					}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default HotEventManagement

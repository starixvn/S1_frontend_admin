import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useDeleteGameExclusionMutation,
	useLazyGetGameExclusionListQuery,
	useUpdateGameExclusionStatusMutation,
} from 'features/gameExclusion/api'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { GameExclusionFilter } from 'features/gameExclusion/GameExclusionFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	GameExclusionMethodEnum,
	IDeleteGameExclusionData,
	IFilterForm,
	IGameExclusionData,
	IUpdateGameExclusionStatusData,
} from 'features/gameExclusion/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { GameExclusionTable } from 'features/gameExclusion/GameExclusionTable'
import { isEmpty } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const GameExclusion = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const { actionPermissions: { editPermission, setActivePermission } = {} } =
		useAuth()
	const [
		getGameExclusionList,
		{
			data: {
				data: gameExclusionList = [],
				rowCount: gameExclusionTotal = 0,
			} = {},
			isFetching: isGetGameExclusionListLoading,
		},
	] = useLazyGetGameExclusionListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: gameExclusionTotal,
	})

	const [
		updateGameExclusionStatus,
		{ isLoading: isUpdateGameExclusionStatusLoading },
	] = useUpdateGameExclusionStatusMutation()

	const [deleteGameExclusion, { isLoading: isDeleteGameExclusionLoading }] =
		useDeleteGameExclusionMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { userName, dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			await getGameExclusionList({
				siteId,
				userName,
				startDate,
				endDate,
				pageSize,
				pageNumber: current,
			}).unwrap()
			setQueryParams({
				userName,
				startDate,
				endDate,
				pageSize,
				pageNumber: current,
				timeZone: currentTimeZoneUtcOffset,
			})
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

	const handleUpdateStatus = async (record: IGameExclusionData) => {
		const { currencyId, userName, custId, status } = record
		const before: IUpdateGameExclusionStatusData = {
			userName,
			custId,
			status,
		}
		const after: IUpdateGameExclusionStatusData = {
			userName,
			custId,
			status: Number(!status),
		}
		try {
			await updateGameExclusionStatus({
				siteId,
				currencyId,
				before,
				after,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDelete = async (record: IGameExclusionData) => {
		const { currencyId, userName, custId } = record
		const before: IDeleteGameExclusionData = {
			userName,
			custId,
		}
		const after: IDeleteGameExclusionData = {
			userName,
			custId,
		}
		try {
			await deleteGameExclusion({
				siteId,
				currencyId,
				before,
				after,
			}).unwrap()
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
				const {
					userName = '',
					startDate,
					endDate,
					pageSize,
					pageNumber,
					timeZone,
				} = queryParams
				onTimeZoneChange(Number(timeZone))

				filterForm.setFieldsValue({
					userName,
					dateRange: [dayjs(startDate), dayjs(endDate)],
				})

				handleSearch({
					pageSize: Number(pageSize),
					current: Number(pageNumber),
					currentTimeZoneUtcOffset: Number(timeZone),
				})
			}
		}
		init()
	}, [])

	const loading =
		isGetGameExclusionListLoading ||
		isUpdateGameExclusionStatusLoading ||
		isDeleteGameExclusionLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<GameExclusionFilter
				loading={isGetGameExclusionListLoading}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<GameExclusionTable
					loading={loading}
					gameExclusionList={gameExclusionList}
					editPermission={editPermission}
					setActivePermission={setActivePermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					onDelete={handleDelete}
					onUpdateStatus={handleUpdateStatus}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => navigate(GameExclusionMethodEnum.add)}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default GameExclusion

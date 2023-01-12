import moment from 'moment'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { message, Form, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import {
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
	PAGINATION,
} from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useLazyGetBetLimitListQuery,
	useDeleteBetLimitMutation,
} from 'features/betLimit/api'
import { IFilterForm, IEditForm, IBetLimitData } from 'features/betLimit/type'
import { BetLimitFilter } from 'features/betLimit/BetLimitFilter'
import { EditBetLimitModal } from 'features/betLimit/EditBetLimitModal'
import { BetLimitTable } from 'features/betLimit/BetLimitTable'

const BetLimit = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const editModal = useModal()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()
	const [isAddForm, setIsAddForm] = useState<boolean>(true)

	const [
		getBetLimitList,
		{
			data: { data: betLimitList = [], rowCount: betLimitListTotal = 0 } = {},
			isFetching: isGetBetLimitListLoading,
		},
	] = useLazyGetBetLimitListQuery()

	const [deleteBetLimit, { isLoading: isDeleteBetLimitLoading }] =
		useDeleteBetLimitMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: betLimitListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, memberId, currencyIds } = filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			await getBetLimitList({
				pageNumber: current,
				pageSize,
				startDate,
				endDate,
				siteIds: siteId ? [siteId] : [],
				currencyIds,
				userName: memberId || null,
			}).unwrap()

			setQueryParams({
				pageNumber: current,
				pageSize,
				startDate,
				endDate,
				siteIds: siteId ? [siteId] : [],
				currencyIds,
				timeZone: currentTimeZoneUtcOffset,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleEdit = ({
		userName,
		custId,
		currencyId,
	}: {
		userName: string
		custId: number
		currencyId: number
	}) => {
		editForm.setFieldsValue({ userName, custId, currencyId })
		setIsAddForm(false)
		editModal.onOpen()
	}

	const handleAdd = () => {
		editForm.resetFields()
		setIsAddForm(true)
		editModal.onOpen()
	}

	const handleDelete = async (data: IBetLimitData) => {
		const { currencyId, custId, userName } = data

		try {
			await deleteBetLimit({
				siteId,
				currencyId,
				before: {
					custId,
					userName,
				},
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const {
				startDate,
				endDate,
				currencyIds,
				memberId,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams

			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds?.map((id: string) => Number(id)),
				memberId,
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}
	}, [])

	const loading = isGetBetLimitListLoading || isDeleteBetLimitLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BetLimitFilter
				form={filterForm}
				loading={isGetBetLimitListLoading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<BetLimitTable
					loading={loading}
					pagination={pagination}
					betLimitList={betLimitList}
					editPermission={editPermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					currencyListBySite={currencyListBySite}
					handleEdit={handleEdit}
					handleDelete={handleDelete}
					onTableChange={handleTableChange}
				/>
			)}
			{editModal.visible && (
				<EditBetLimitModal
					form={editForm}
					isAdd={isAddForm}
					isOpen={editModal.visible}
					editPermission={editPermission}
					currencyListBySite={currencyListBySite}
					onCancel={editModal.onCancel}
				/>
			)}
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={handleAdd}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BetLimit

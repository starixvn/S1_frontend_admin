import moment from 'moment'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { message, Form, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectUserSite } from 'common/enum'
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
	useSetBetLimitMutation,
	useDeleteBetLimitMutation,
	useLazyGetBetLimitListQuery,
} from 'features/betLimit/api'
import {
	IEditForm,
	IFilterForm,
	IBetLimitData,
	IGameTypeBetLimit,
} from 'features/betLimit/type'
import { BetLimitTable } from 'features/betLimit/BetLimitTable'
import { BetLimitFilter } from 'features/betLimit/BetLimitFilter'
import { EditBetLimitModal } from 'features/betLimit/EditBetLimitModal'

const BetLimit = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()
	const editModal = useModal()
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

	const [setBetLimit, { isLoading: isSetBetLimitLoading }] =
		useSetBetLimitMutation()

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
			currentTimeZoneUtcOffset
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

	const handleSetBetLimit = async (list: IGameTypeBetLimit[]) => {
		const { userName } = editForm.getFieldsValue()
		const { currencyId } = editForm.getFieldsValue(['currencyId'])

		const betSettingList = list?.map(
			({
				categoryId: tpCategory,
				categoryName: tpCategoryName,
				typeId: gameTypeId,
				typeName: gameTypeName,
				limitGroup,
				selectedValue,
				checked,
			}) => ({
				checked,
				tpCategory,
				tpCategoryName,
				gameTypeId,
				gameTypeName,
				limitGroup: checked ? selectedValue : null,
				limitRange: checked
					? limitGroup.find(obj => obj.group === selectedValue)?.range
					: null,
			})
		)

		try {
			await setBetLimit({
				siteId,
				currencyId,
				after: {
					userName,
					betSetting: betSettingList,
				},
			}).unwrap()

			editModal.onCancel()
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
				currentTimeZoneUtcOffset: Number(timeZone),
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
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<BetLimitTable
					loading={loading}
					pagination={pagination}
					betLimitList={betLimitList}
					editPermission={editPermission}
					deletePermission={deletePermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onTableChange={handleTableChange}
				/>
			)}
			<EditBetLimitModal
				form={editForm}
				isAdd={isAddForm}
				isOpen={editModal.visible}
				editPermission={editPermission}
				isSetBetLimitLoading={isSetBetLimitLoading}
				onCancel={editModal.onCancel}
				onSetBetLimit={handleSetBetLimit}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={handleAdd}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BetLimit

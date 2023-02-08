import moment from 'moment'
import { isEmpty, isNumber } from 'lodash'
import { useEffect, useState } from 'react'
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
	useGetTpListQuery,
	useGetCategoryQuery,
} from 'common/service/allDataApi'
import { message, Form, TablePaginationConfig } from 'antd'
import {
	useGetTpGameTypeQuery,
	useLazyGetTpMaintenanceListQuery,
	useAddTpMaintenanceMutation,
	useUpdateTpMaintenanceMutation,
	useDeleteTpMaintenanceMutation,
} from 'features/productMaintenance/api'
import {
	IFilterForm,
	IEditForm,
	IAddForm,
} from 'features/productMaintenance/type'
import ProductMaintenanceFilter from 'features/productMaintenance/ProductMaintenanceFilter'
import ProductMaintenanceTable from 'features/productMaintenance/ProductMaintenanceTable'
import AddProductMaintenanceModal from 'features/productMaintenance/AddProductMaintenanceModal'

const ProductMaintenance = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const {
		timeZoneUtcOffset: timeZoneUtcOffsetModal,
		onTimeZoneChange: onTimeZoneChangeModal,
	} = useTimeZone()

	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()
	const [addForm] = Form.useForm<IAddForm>()
	const addFormTpId = Form.useWatch('tpId', addForm)
	const filterFormTpId = Form.useWatch('tpId', filterForm)
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
	const addProductMaintenanceModal = useModal()

	const { data: { data: tpList = [] } = {}, isLoading: isGetTpLoading } =
		useGetTpListQuery(null)

	const {
		data: { data: categoryList = [] } = {},
		isLoading: isGetCategoryLoading,
	} = useGetCategoryQuery(null)

	const {
		data: { data: gameTypeList = [] } = {},
		isLoading: isGetGameTypeLoading,
	} = useGetTpGameTypeQuery({ tpId: filterFormTpId }, { skip: !filterFormTpId })

	const {
		data: { data: addGameTypeList = [] } = {},
		isFetching: isGetAddGameTypeFetching,
	} = useGetTpGameTypeQuery({ tpId: addFormTpId }, { skip: !addFormTpId })

	const [
		getTpMaintenanceList,
		{
			data: {
				data: tpMaintenanceList = [],
				rowCount: TpMaintenanceListTotal = 0,
			} = {},
			isFetching: isGetTpMaintenanceFetching,
		},
	] = useLazyGetTpMaintenanceListQuery()

	const [addTpMaintenance, { isLoading: isAddTpMaintenanceLoading }] =
		useAddTpMaintenanceMutation()

	const [updateTpMaintenance, { isLoading: isUpdateTpMaintenanceLoading }] =
		useUpdateTpMaintenanceMutation()

	const [deleteTpMaintenance, { isLoading: isDeleteTpMaintenanceLoading }] =
		useDeleteTpMaintenanceMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: TpMaintenanceListTotal,
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
		const { dateRange, tpId, tpGameTypeId, tpCategoryId, isExpired } =
			filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		try {
			await getTpMaintenanceList({
				siteId: siteId ? [siteId] : [],
				startDate,
				endDate,
				tpId,
				tpGameTypeId,
				tpCategoryId,
				isExpired,
				pageNumber: current,
				pageSize,
			}).unwrap()

			setQueryParams({
				siteId,
				startDate,
				endDate,
				tpId,
				tpGameTypeId,
				tpCategoryId,
				isExpired,
				pageNumber: current,
				pageSize,
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

	const handleAddProductMaintenance = async () => {
		if (!siteId) return
		const { dateRange, tpId, tpGameType } = await addForm.validateFields()

		const [beginDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffsetModal
		)

		try {
			await addTpMaintenance({
				sn: '',
				siteId,
				tpId: String(tpId),
				tpGameTypeList:
					// 全選則送 0 其他以 '1-1,2-6' 這類格式送出 (type-categoryId)
					tpGameType.length === addGameTypeList.length
						? '0'
						: tpGameType.join(','),
				beginDate,
				endDate,
				// 定值不需顯示
				maintainType: 'Date',
			}).unwrap()

			addProductMaintenanceModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleRowSaved = async () => {
		if (!isNumber(editingKey)) return
		const { dateRange } = await editForm.validateFields()

		const [beginDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			await updateTpMaintenance({
				sn: String(editingKey),
				beginDate,
				endDate,
			}).unwrap()

			message.success(t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteProductMaintenance = async (sn: number) => {
		try {
			await deleteTpMaintenance({
				sn,
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isGetTpMaintenanceFetching ||
		isGetTpLoading ||
		isGetCategoryLoading ||
		isGetGameTypeLoading

	const tableLoading =
		isGetTpMaintenanceFetching ||
		isUpdateTpMaintenanceLoading ||
		isDeleteTpMaintenanceLoading

	const modalLoading =
		isAddTpMaintenanceLoading || isGetTpLoading || isGetAddGameTypeFetching

	useEffect(() => {
		// init
		const init = () => {
			const {
				startDate,
				endDate,
				tpId = 0,
				tpGameTypeId = 0,
				tpCategoryId = 0,
				isExpired = false,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))

			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				tpId: Number(tpId),
				tpGameTypeId: Number(tpGameTypeId),
				tpCategoryId: Number(tpCategoryId),
				isExpired: Boolean(isExpired),
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: timeZoneUtcOffset,
			})
		}

		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	useEffect(() => {
		if (!isGetAddGameTypeFetching) {
			addForm.setFieldsValue({
				tpGameType: addGameTypeList.map(
					({ type, categoryId }) => `${type}-${categoryId}`
				),
			})
		}
	}, [isGetAddGameTypeFetching, addFormTpId])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<ProductMaintenanceFilter
				form={filterForm}
				loading={filterLoading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				tpList={tpList}
				categoryList={categoryList}
				gameTypeList={gameTypeList}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<ProductMaintenanceTable
					loading={tableLoading}
					form={editForm}
					pagination={pagination}
					tpMaintenanceList={tpMaintenanceList}
					editPermission={editPermission}
					editingKey={editingKey}
					setEditingKey={setEditingKey}
					deletePermission={deletePermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onDelete={handleDeleteProductMaintenance}
					onRowSaved={handleRowSaved}
					onTableChange={handleTableChange}
				/>
			)}

			<AddProductMaintenanceModal
				loading={modalLoading}
				form={addForm}
				timeZoneUtcOffset={timeZoneUtcOffsetModal}
				tpList={tpList}
				addGameTypeList={addGameTypeList}
				visible={addProductMaintenanceModal.visible}
				onCancel={addProductMaintenanceModal.onCancel}
				onFinish={handleAddProductMaintenance}
				onTimeZoneChange={onTimeZoneChangeModal}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={addProductMaintenanceModal.onOpen}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ProductMaintenance

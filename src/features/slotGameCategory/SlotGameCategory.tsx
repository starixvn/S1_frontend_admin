import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { SlotGameCategoryFilter } from 'features/slotGameCategory/SlotGameCategoryFilter'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	useGetTpListQuery,
	useLazyGetSlotGameCategoryListQuery,
	useLazyGetSlotGameListQuery,
	useSetSlotGameCategoryMutation,
	useSetSlotGameMutation,
} from 'features/slotGameCategory/api'
import {
	IGetTpListResponse,
	ITableColumnsInfo,
} from 'features/slotGameCategory/type'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { slotGameResponseConverter } from 'features/slotGameCategory/utils'
import { SlotGameCategoryTable } from 'features/slotGameCategory/SlotGameCategoryTable'
import { useTimeZone } from 'components/TimeZoneSelect'
import { SlotCategoryEnum } from 'features/slotGameCategory/constants'
import { assign, cloneDeep, findIndex, head, isEmpty } from 'lodash'

const SlotGameCategory: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [filterForm] = Form.useForm<{
		tpId: number
		name: string
		status: number
		gameId: string
	}>()
	// format 過後的 tableDataSource
	const [tableDataSource, setTableDataSource] = useState<any[]>([])
	// 當前 response 需要新增的 Table Columns 資訊
	const [columnInfos, setColumnsInfo] = useState<ITableColumnsInfo[]>([])
	const { timeZoneUtcOffset } = useTimeZone()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [queryParams, setQueryParams] = useQueryParams()

	// pagination
	const [slotGameTotal, setSlotGameTotal] = useState(0)
	const [pagination, setPagination] = usePagination({
		paginationTotal: slotGameTotal,
	})

	const [categoryForm] = Form.useForm<{ categoryId: number }>()
	const currentCategoryId = Form.useWatch('categoryId', categoryForm)

	const {
		data: { data: tpList } = {} as IGetTpListResponse,
		isLoading: isGetTpListLoading,
	} = useGetTpListQuery(null)

	const [getSlotGameList, { isFetching: isGetSlotGameListLoading }] =
		useLazyGetSlotGameListQuery()

	const [setSlotGame, { isLoading: isSetSlotGameLoading }] =
		useSetSlotGameMutation()

	const [
		getSlotGameCategoryList,
		{ isFetching: isGetSlotGameCategoryListLoading },
	] = useLazyGetSlotGameCategoryListQuery()

	const [setSlotGameCategory, { isLoading: isSetSlotGameCategoryLoading }] =
		useSetSlotGameCategoryMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const formValue = await filterForm.validateFields()
		if (
			currentCategoryId === SlotCategoryEnum.AllAndSetStatus ||
			currentCategoryId === undefined
		) {
			// Default
			try {
				const { data: slotGameListData, rowCount: listTotal = 0 } =
					await getSlotGameList({
						siteId,
						pageSize,
						pageNumber: current,
						...formValue,
					}).unwrap()
				const { dataSource, tableColumns } = slotGameResponseConverter(
					slotGameListData,
					currencyListBySite
				)
				setTableDataSource(dataSource)
				setColumnsInfo(tableColumns)
				setSlotGameTotal(listTotal)
				setPagination(prev => ({ ...prev, current, pageSize }))
				setQueryParams({
					pageNumber: current,
					pageSize,
					...formValue,
				})
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		} else {
			// Slot Category
			try {
				const { data: slotGameListData, rowCount: listTotal = 0 } =
					await getSlotGameCategoryList({
						siteId,
						pageSize,
						pageNumber: current,
						category: currentCategoryId,
						...formValue,
					}).unwrap()

				const { dataSource, tableColumns } = slotGameResponseConverter(
					slotGameListData,
					currencyListBySite
				)
				setTableDataSource(dataSource)
				setColumnsInfo(tableColumns)
				setSlotGameTotal(listTotal)
				setPagination(prev => ({ ...prev, current, pageSize }))
				setQueryParams({
					category: currentCategoryId,
					pageNumber: current,
					pageSize,
					...formValue,
				})
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
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

	const handleSetStatus = async ({
		currencyId,
		slotGameId,
		status,
		dataIndex,
	}: {
		currencyId: number
		slotGameId: number
		status: boolean
		dataIndex: string
	}) => {
		try {
			if (
				currentCategoryId === SlotCategoryEnum.AllAndSetStatus ||
				currentCategoryId === undefined
			) {
				// Default
				await setSlotGame({
					siteId,
					currencyId,
					slotGameId,
					status: Number(status),
				}).unwrap()
			} else {
				// Category
				await setSlotGameCategory({
					siteId,
					currencyId,
					slotGameId,
					status: Number(status),
					categoryId: currentCategoryId,
				}).unwrap()
			}

			// 更動儲存在前端的資料
			const rawSource = cloneDeep(tableDataSource)
			const sourceIndex = findIndex(
				rawSource,
				source => source.id === slotGameId
			)
			const mutationData = assign(rawSource[sourceIndex], {
				[dataIndex]: Number(status),
			})
			setTableDataSource(assign(rawSource, mutationData))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (currentCategoryId !== undefined) {
			handleSearch({})
		}
	}, [currentCategoryId])

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					tpId: head(tpList)?.tpId,
				})
			} else {
				const {
					tpId,
					name = '',
					gameId = '',
					status = 0,
					pageSize,
					pageNumber,
					category,
				} = queryParams
				if (category) {
					categoryForm.setFieldsValue({
						categoryId: Number(category),
					})
				}
				filterForm.setFieldsValue({
					tpId: Number(tpId),
					name,
					gameId,
					status: Number(status),
				})
				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
				})
			}
		}
		if (!isGetTpListLoading) {
			init()
		}
	}, [isGetTpListLoading])

	const loading =
		isGetTpListLoading ||
		isGetSlotGameListLoading ||
		isSetSlotGameLoading ||
		isGetSlotGameCategoryListLoading ||
		isSetSlotGameCategoryLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<SlotGameCategoryFilter
				loading={loading}
				tpList={tpList}
				form={filterForm}
				onSearch={handleSearch}
			/>
			{tableDataSource.length > 0 && (
				<SlotGameCategoryTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					dataSource={tableDataSource}
					columnInfos={columnInfos}
					editPermission={editPermission}
					pagination={pagination}
					onTableChange={handleTableChange}
					setStatus={handleSetStatus}
					categoryForm={categoryForm}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default SlotGameCategory

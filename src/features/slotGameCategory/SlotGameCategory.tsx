import { FC, useEffect, useState, useContext } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { SlotGameCategoryFilter } from 'features/slotGameCategory/SlotGameCategoryFilter'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import paths from 'app/constants/paths'
import { useNavigate } from 'react-router-dom'
import {
	useGetSlotGamesTpListQuery,
	useLazyGetSlotGameCategoryListQuery,
	useLazyGetSlotGameListQuery,
	useSetSlotGameAllCurrencyMutation,
	useSetSlotGameCategoryMutation,
	useSetSlotGameEnvironmentMutation,
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
import { AuthContext } from 'common/auth'
import { CurrencyEnum } from 'type'
import { AffixButtons } from 'components/AffixButtons'
import { NEW_SITE_PREFIX_URL } from 'app/config'

const SlotGameCategory: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { userData } = useContext(AuthContext)
	const { t } = useTranslation()
	const { siteId = 0 } = useAppSelector(selectUserSite) ?? {}
	const [filterForm] = Form.useForm<{
		tpId: number
		name: string
		status: number
		gameId: string
	}>()
	const navigate = useNavigate()
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

	// 判斷是否為狀態控制而非 category 顯示與否的控制
	const isAllCategory =
		currentCategoryId === SlotCategoryEnum.AllAndSetStatus ||
		currentCategoryId === undefined

	const {
		data: { data: tpList } = {} as IGetTpListResponse,
		isLoading: isGetTpListLoading,
	} = useGetSlotGamesTpListQuery({
		siteIds: [siteId],
		currencyId: CurrencyEnum.All,
	})

	const [getSlotGameList, { isFetching: isGetSlotGameListLoading }] =
		useLazyGetSlotGameListQuery()

	const [setSlotGame, { isLoading: isSetSlotGameLoading }] =
		useSetSlotGameMutation()

	const [
		setSlotGameAllCurrency,
		{ isLoading: isSetSlotGameAllCurrencyLoading },
	] = useSetSlotGameAllCurrencyMutation()

	const [
		getSlotGameCategoryList,
		{ isFetching: isGetSlotGameCategoryListLoading },
	] = useLazyGetSlotGameCategoryListQuery()

	const [setSlotGameCategory, { isLoading: isSetSlotGameCategoryLoading }] =
		useSetSlotGameCategoryMutation()

	const [
		setSlotGameEnvironment,
		{ isLoading: isSetSlotGameEnvironmentLoading },
	] = useSetSlotGameEnvironmentMutation()

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
		isGoToPRD,
	}: {
		currencyId: number
		slotGameId: number
		status: boolean
		dataIndex: string
		isGoToPRD: boolean
	}) => {
		const hashedStatus = ((): number => {
			if (!status) {
				return 0
			}
			// 再 prd 上的話 set 1 , 否的話 set 3
			return isGoToPRD ? 1 : 3
		})()

		try {
			if (isAllCategory) {
				// Default
				await setSlotGame({
					siteId,
					currencyId,
					slotGameId,
					status: hashedStatus,
				}).unwrap()
			} else {
				// Category
				// 調整 category 時不需要根據是否上 PRD 做 status value 調整
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
			// Last operator 欄位更動拿全域 auth 狀態儲存在前端
			assign(mutationData, {
				operator: userData?.userName,
			})
			if (!status) {
				assign(mutationData, {
					activeInactiveAll: false,
				})
			} else {
				let isActiveAll = true
				const filteredObj: { [key: string]: any } = Object.keys(mutationData)
					.filter((key: string) => key.includes('isoCode'))
					.reduce((newObj: { [key: string]: any }, key: string) => {
						newObj[key] = mutationData[key]
						return newObj
					}, {})
				Object.values(filteredObj).forEach((value: number) => {
					if (value !== 1) {
						isActiveAll = false
					}
				})
				if (isActiveAll) {
					assign(mutationData, {
						activeInactiveAll: true,
					})
				}
			}
			setTableDataSource(assign(rawSource, mutationData))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetAllCurrencyStatus = async ({
		slotGameId,
		activeInactiveAll,
		isGoToPRD,
	}: {
		slotGameId: number
		activeInactiveAll: boolean
		isGoToPRD: boolean
	}) => {
		const hashedStatus = ((): number => {
			if (!activeInactiveAll) {
				return 0
			}
			// 再 prd 上的話 set 1 , 否的話 set 3
			return isGoToPRD ? 1 : 3
		})()

		try {
			await setSlotGameAllCurrency({
				siteId: Number(siteId),
				slotGameId,
				status: hashedStatus,
			}).unwrap()

			// 更動儲存在前端的資料
			const rawSource = cloneDeep(tableDataSource)
			const sourceIndex = findIndex(
				rawSource,
				source => source.id === slotGameId
			)
			columnInfos.forEach(({ dataIndex }) =>
				assign(rawSource[sourceIndex], {
					[dataIndex]: hashedStatus,
				})
			)
			if (!activeInactiveAll) {
				// 如果全關則 goToPRD 一起關
				assign(rawSource[sourceIndex], { isGoToPRD: false })
			}
			assign(rawSource[sourceIndex], { activeInactiveAll })
			assign(rawSource[sourceIndex], { operator: userData?.userName })
			setTableDataSource(rawSource)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetSlotGameEnvironment = async ({
		slotGameId,
		isGoToPRD,
	}: {
		slotGameId: number
		isGoToPRD: boolean
	}) => {
		// 設定是否上到 PRD
		try {
			await setSlotGameEnvironment({
				siteId: Number(siteId),
				slotGameId,
				isPRD: isGoToPRD ? 1 : 0,
			}).unwrap()

			// 更動儲存在前端的資料
			const rawSource = cloneDeep(tableDataSource)
			const sourceIndex = findIndex(
				rawSource,
				source => source.id === slotGameId
			)
			assign(rawSource[sourceIndex], { isGoToPRD })
			assign(rawSource[sourceIndex], { operator: userData?.userName })
			setTableDataSource(rawSource)
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
		isSetSlotGameCategoryLoading ||
		isSetSlotGameAllCurrencyLoading ||
		isSetSlotGameEnvironmentLoading

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
					isAllCategory={isAllCategory}
					timeZoneUtcOffset={timeZoneUtcOffset}
					dataSource={tableDataSource}
					columnInfos={columnInfos}
					editPermission={editPermission}
					pagination={pagination}
					onTableChange={handleTableChange}
					setStatus={handleSetStatus}
					setAllStatus={handleSetAllCurrencyStatus}
					setGoToPRD={handleSetSlotGameEnvironment}
					categoryForm={categoryForm}
				/>
			)}
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => {
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.productManagement.sub.slotGameCategory.root}/add`
						)
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default SlotGameCategory

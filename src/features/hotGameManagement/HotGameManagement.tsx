import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useEffect, useState } from 'react'
import { head, isEmpty } from 'lodash'
import {
	useDeleteHotGameMutation,
	useGetCommonTpListQuery,
	useGetTopCategoryListQuery,
	useGetTpGameTypeListQuery,
	useLazyGetHotGameListQuery,
	useSetHotGameMutation,
	useSetHotGameSortMutation,
} from 'features/hotGameManagement/api'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	IEditForm,
	IFilterForm,
	IHotGameData,
} from 'features/hotGameManagement/type'
import { HotGameContext } from 'features/hotGameManagement/hotGameContext'
import { HotGameManagementFilterTab } from 'features/hotGameManagement/hotGameManagementFilter/HotGameManagementFilterTab'
import { withOutSiteIdParams } from 'common/utils'
import { HotGameManagementTable } from 'features/hotGameManagement/HotGameManagementTable'
import { useTimeZone } from 'components/TimeZoneSelect'
import { EditHotGameModal } from 'features/hotGameManagement/EditHotGameModal'
import { sortingDataConverter } from 'features/hotGameManagement/utils'

const HotGameManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()

	const [filterForm] = Form.useForm<IFilterForm>()

	const [editForm] = Form.useForm<IEditForm>()
	const editModal = useModal()

	// 儲存當前 currency
	const [currentCurrency, setCurrentCurrency] = useState<number>(
		head(currencyListBySite)?.currencyId ?? 0
	)
	// for sort mode
	// 因為 sort mode 需要異動到 tableSource , 故拉出來獨立處理
	const [isSortMode, setIsSortMode] = useState(false)
	const [tableSource, setTableSource] = useState<IHotGameData[]>([])

	const currentTpId = Form.useWatch('tpId', filterForm)

	const {
		data: { data: topCategoryList = [] } = {},
		isLoading: isGetTopCategoryListLoading,
	} = useGetTopCategoryListQuery(null)

	const {
		data: { data: commonTpList = [] } = {},
		isLoading: isGetCommonTpListLoading,
	} = useGetCommonTpListQuery(null)

	const {
		data: { data: tpGameTypeList = [] } = {},
		isFetching: isGetTpGameTypeListLoading,
	} = useGetTpGameTypeListQuery({ tpId: currentTpId }, { skip: !currentTpId })

	const [
		getHotGameList,
		{
			data: { data: rawHotGameList = [], rowCount: hotGameTotal = 0 } = {},
			isFetching: isGetHotGameListLoading,
		},
	] = useLazyGetHotGameListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: hotGameTotal,
	})

	const [deleteHotGame, { isLoading: isDeleteHotGameLoading }] =
		useDeleteHotGameMutation()

	const [setHotGame, { isLoading: isSetHotGameLoading }] =
		useSetHotGameMutation()

	const [setHotGameSort, { isLoading: isSetSortLoading }] =
		useSetHotGameSortMutation()

	const handleSetSortModeCanceled = () => {
		// 取消 sorting 時，除了關閉 sort mode , 還要把 api 撈到的原始資料寫回去 TableSource
		setIsSortMode(false)
		setTableSource(rawHotGameList)
	}

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currencyId = currentCurrency,
	}: {
		current?: number
		pageSize?: number
		currencyId?: number
	}) => {
		if (currencyId === 0) return

		const { tpId, tpGameType, topCategory } = filterForm.getFieldsValue()
		try {
			// tpId 跟 tpGameType 可以不選，不選送 0
			await getHotGameList({
				siteId,
				currencyId,
				topCategory,
				tpId: tpId ?? 0,
				tpGameType: tpGameType ?? 0,
				pageSize,
				pageNumber: current,
			}).unwrap()
			setQueryParams({
				currencyId,
				topCategory,
				tpId,
				tpGameType,
				pageSize,
				pageNumber: current,
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
		// 強制關閉 sortMode
		handleSetSortModeCanceled()
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleDeleteHotGame = async (id: number) => {
		try {
			await deleteHotGame({
				siteId,
				id,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleEditHotGame = (id: number) => {
		editForm.setFieldsValue({
			id,
		})
		editModal.onOpen()
	}

	const handleSetHotGame = async () => {
		await editForm.validateFields()
		// 有些 value 沒有渲染在畫面上，使用 true 取出
		const value = editForm.getFieldsValue(true)
		try {
			await setHotGame({ siteId, ...value }).unwrap()
			editModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetSort = async () => {
		if (!siteId || tableSource.length === 0) return
		const sortIds = tableSource.map(item => item.id)
		try {
			await setHotGameSort(sortingDataConverter(sortIds, siteId)).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
		setIsSortMode(false)
	}

	const filterLoading = isGetTopCategoryListLoading || isGetCommonTpListLoading

	const loading =
		isDeleteHotGameLoading || isGetHotGameListLoading || isSetSortLoading

	useEffect(() => {
		const init = async () => {
			// 切 tab 時手動清 queryParams 會有 siteId 清不掉
			if (isEmpty(withOutSiteIdParams(queryParams))) {
				filterForm.setFieldsValue({
					topCategory: head(topCategoryList)?.hotGameTopCategoryId,
				})
			} else {
				const {
					currencyId,
					topCategory,
					tpId,
					tpGameType,
					pageSize,
					pageNumber,
				} = queryParams
				await setCurrentCurrency(Number(currencyId))
				filterForm.setFieldsValue({
					topCategory: Number(topCategory),
					tpId: tpId ? Number(tpId) : undefined,
					tpGameType: tpGameType ? Number(tpGameType) : undefined,
				})

				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
					currencyId: Number(currencyId),
				})
			}
		}
		if (!filterLoading) {
			init()
		}
	}, [filterLoading, currentCurrency])

	useEffect(() => {
		// fetch 完重置 tableSource
		if (!isGetHotGameListLoading) {
			setTableSource(rawHotGameList)
		}
	}, [isGetHotGameListLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<HotGameContext.Provider
				value={{
					loading,
					isSortMode,
					filterLoading,
					tpGameTypeLoading: isGetTpGameTypeListLoading,
					currencyListBySite,
					topCategoryList,
					commonTpList,
					tpGameTypeList,
					onSearch: handleSearch,
				}}
			>
				<HotGameManagementFilterTab
					form={filterForm}
					currentCurrency={currentCurrency}
					setCurrentCurrency={setCurrentCurrency}
				/>
				{!isEmpty(withOutSiteIdParams(queryParams)) && (
					<HotGameManagementTable
						editPermission={editPermission}
						hotGameList={tableSource}
						pagination={pagination}
						timeZoneUtcOffset={timeZoneUtcOffset}
						setTableSource={setTableSource}
						onEditClick={handleEditHotGame}
						onTableChange={handleTableChange}
						onDeleteHotGame={handleDeleteHotGame}
					/>
				)}
				<EditHotGameModal
					form={editForm}
					open={editModal.visible}
					loading={isSetHotGameLoading}
					onCancel={editModal.onCancel}
					onFinish={handleSetHotGame}
				/>
			</HotGameContext.Provider>
			<AffixButtons>
				<AffixButtons.BackToTop />
				{isSortMode ? (
					<>
						<AffixButtons.Close onClick={handleSetSortModeCanceled} />
						<AffixButtons.Saved loading={loading} onClick={handleSetSort} />
					</>
				) : (
					<>
						<AffixButtons.Drag
							onClick={() => setIsSortMode(true)}
							disabled={
								!editPermission?.canUse ||
								isSortMode ||
								tableSource.length === 0 ||
								isEmpty(withOutSiteIdParams(queryParams))
							}
						/>
						<AffixButtons.Create
							disabled={!editPermission?.canUse || isSortMode}
							// 新增固定帶 0
							onClick={() => handleEditHotGame(0)}
						/>
					</>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default HotGameManagement

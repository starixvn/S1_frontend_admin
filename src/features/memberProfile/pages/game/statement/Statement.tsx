import { useTranslation } from 'react-i18next'
import {
	useExportCustTpBetRecordByCategoryMutation,
	useExportCustTpBetRecordByDayMutation,
	useExportCustTpBetRecordByGameTypeMutation,
	useExportCustTpBetRecordMutation,
	useLazyGetCustTpBetRecordByCategoryQuery,
	useLazyGetCustTpBetRecordByDayQuery,
	useLazyGetCustTpBetRecordByGameTypeQuery,
	useLazyGetCustTpBetRecordQuery,
	useLazyGetGameTypeListQuery,
	useLazyGetTpBetRecordDetailQuery,
} from 'features/memberProfile/api'
import { useParams } from 'react-router-dom'
import { Form, message, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { StatementFilter } from 'features/memberProfile/pages/game/statement/StatementFilter'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter, getInRangeDate } from 'common/utils'
import { useEffect, useState } from 'react'
import { CustTpBetRecordTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordTable'
import { GameStatementTableEnum } from 'features/memberProfile/constants'
import { CustTpBetRecordByDayTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordByDayTable'
import { CustTpBetRecordByCategoryTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordByCategoryTable'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { CustTpBetRecordByGameTypeTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordByGameTypeTable'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { IGetTpBetRecordDetailData } from 'features/memberProfile/type'
import { TpBetRecordDetailModal } from 'features/memberProfile/pages/game/statement/tables/TpBetRecordDetailModal'
import { AffixButtons } from 'components/AffixButtons'
import download from 'downloadjs'
import moment from 'moment/moment'
import { useGetCategoryQuery } from 'common/service/allDataApi'

const Statement = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const { startDate: queryStartDate, endDate: queryEndDate } = queryParams
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()
	const currentCategories = Form.useWatch('tpCategoryList', filterForm)
	const [initSearch, setInitSearch] = useState(false)
	const [tableState, setTableState] = useState(0)
	const tpBetRecordDetailModal = useModal()
	// 暫存當前閱讀的 categoryId 供彈窗元件判斷
	const [currentCategoryId, setCurrentCategoryId] = useState<
		number | undefined
	>(undefined)

	// 第一層 , 取得客戶紀錄
	const [
		getCustTpBetRecord,
		{
			data: { data: custTpBetRecord = [] } = {},
			isFetching: isGetCustTpBetRecordLoading,
		},
	] = useLazyGetCustTpBetRecordQuery()

	const [exportCustTpBetRecord, { isLoading: isExportCustTpBetRecordLoading }] =
		useExportCustTpBetRecordMutation()

	// 第二層 , 取得客戶指定日期紀錄
	const [
		getCustTpBetRecordByDay,
		{
			data: { data: custTpBetRecordByDay = [] } = {},
			isFetching: isGetCustRecordByDayLoading,
		},
	] = useLazyGetCustTpBetRecordByDayQuery()

	const [
		exportCustTpBetRecordByDay,
		{ isLoading: isExportCustTpBetRecordByDayLoading },
	] = useExportCustTpBetRecordByDayMutation()

	// 第三層 , 取得客戶指定 Category 紀錄
	const [
		getCustTpBetRecordByCategory,
		{
			data: { data: custTpBetRecordByCategory = [] } = {},
			isFetching: isGetCustRecordByCategoryLoading,
		},
	] = useLazyGetCustTpBetRecordByCategoryQuery()

	const [
		exportCustTpBetRecordByCategory,
		{ isLoading: isExportCustTpBetRecordByCategoryLoading },
	] = useExportCustTpBetRecordByCategoryMutation()

	// 第四層 , 取得客戶指定 GameType 紀錄
	const [
		getCustTpBetRecordByGameType,
		{
			data: {
				data: custTpBetRecordByGameType = [],
				rowCount: tpBetRecordByGameTypeTotal = 0,
			} = {},
			isFetching: isGetCustRecordByGameTypeLoading,
		},
	] = useLazyGetCustTpBetRecordByGameTypeQuery()

	const [
		exportCustTpBetRecordByGameType,
		{ isLoading: isExportCustTpBetRecordByGameTypeLoading },
	] = useExportCustTpBetRecordByGameTypeMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: tpBetRecordByGameTypeTotal,
	})

	// 第五層 , 取得第三方細單
	const [
		getTpBetRecordDetail,
		{
			data: {
				data: tpBetRecordDetail,
			} = {} as IAxiosResponse<IGetTpBetRecordDetailData>,
			isFetching: isGetTpBetRecordDetailLoading,
		},
	] = useLazyGetTpBetRecordDetailQuery()

	const {
		data: { data: categoryList = [] } = {},
		isLoading: isGetCategoryListLoading,
	} = useGetCategoryQuery(null)

	const [
		getGameTypeList,
		{
			data: { data: gameTypeList = [] } = {},
			isFetching: isGetGameTypeListLoading,
		},
	] = useLazyGetGameTypeListQuery()

	const handleGetGameType = async () => {
		const { tpCategoryList = [] } = filterForm.getFieldsValue()
		try {
			await getGameTypeList({ tpCategoryList }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSearch = async () => {
		// 第一層
		if (!custId) return
		const { gameTypes = [] } = filterForm.getFieldsValue()
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			await getCustTpBetRecord({
				custId: Number(custId),
				startDate,
				endDate,
				gameTypes,
			}).unwrap()

			setQueryParams({ startDate, endDate })
			setTableState(0)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 取得第二層的 Table Detail ,  並切換 state 至第二層
	const handleTpBetRecordTableClicked = async (settledDate: string) => {
		const { gameTypes = [] } = filterForm.getFieldsValue()
		const [startDate, endDate] = getInRangeDate({
			targetDate: settledDate,
			dateRange: [queryStartDate, queryEndDate],
			timeZoneUtcOffset,
		})

		try {
			await getCustTpBetRecordByDay({
				custId: Number(custId),
				startDate,
				endDate,
				selDate: settledDate,
				gameTypes,
			}).unwrap()

			filterForm.setFieldsValue({
				selDate: settledDate,
			})
			setTableState(prev => prev + 1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 取得第三層的 Table Detail , 並切換 state 至第三層
	const handleTpBetRecordByDayTableClicked = async (categoryId: number) => {
		setCurrentCategoryId(categoryId)
		const { selDate } = filterForm.getFieldsValue(true)
		const { gameTypes = [] } = filterForm.getFieldsValue()
		const [startDate, endDate] = getInRangeDate({
			targetDate: selDate,
			dateRange: [queryStartDate, queryEndDate],
			timeZoneUtcOffset,
		})

		try {
			await getCustTpBetRecordByCategory({
				custId: Number(custId),
				startDate,
				endDate,
				selDate,
				categoryId,
				gameTypes,
			}).unwrap()
			setTableState(prev => prev + 1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 取得第四層的 Table Detail , 因為 GameType 這層有 pagination 要處理 ，故將 handleSearch 的 api 拉出來獨立處理
	const handleGetTpBetRecordByGameType = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { selDate, gameTypeId } = filterForm.getFieldsValue(true)
		const [startDate, endDate] = getInRangeDate({
			targetDate: selDate,
			dateRange: [queryStartDate, queryEndDate],
			timeZoneUtcOffset,
		})

		try {
			await getCustTpBetRecordByGameType({
				custId: Number(custId),
				startDate,
				endDate,
				selDate,
				gameTypeId,
				pageNumber: current,
				pageSize,
			}).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 第四層的換頁 function
	const handleGetTpBetRecordByGameTypeTableChange = async (
		newPagination: TablePaginationConfig
	) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleGetTpBetRecordByGameType({
			current,
			pageSize,
		})
	}

	const handleTpBetRecordByCategoryTableClicked = async (
		gameTypeId: number
	) => {
		// 處理 click detail 後點擊進入第四層
		filterForm.setFieldsValue({
			gameTypeId,
		})

		await handleGetTpBetRecordByGameType({})
		setTableState(prev => prev + 1)
	}

	const handleTransIdClicked = async ({
		transId,
		settledTime,
	}: {
		transId: string
		settledTime: string
	}) => {
		// 處理第四層 click 單號進入第五層 (第五層為彈窗)
		const { gameTypeId } = filterForm.getFieldsValue(true)
		try {
			await getTpBetRecordDetail({
				custId: Number(custId),
				settledTime,
				transId,
				gameType: gameTypeId,
			}).unwrap()

			tpBetRecordDetailModal.onOpen()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		switch (tableState) {
			case GameStatementTableEnum.TPBetRecord: {
				if (!custId) return
				const { gameTypes = [] } = filterForm.getFieldsValue()
				const { dateRange } = filterForm.getFieldsValue()
				const [startDate, endDate] = dateRangeToUtcFormatter(
					dateRange,
					timeZoneUtcOffset
				)
				try {
					const blob = await exportCustTpBetRecord({
						custId: Number(custId),
						startDate,
						endDate,
						gameTypes,
					}).unwrap()
					download(
						blob,
						`ExportCustTPBetRecord_${moment().format('YYYYMMDDHHmmss')}.xlsx`
					)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
				break
			}
			case GameStatementTableEnum.TPBetRecordByDay: {
				const { selDate } = filterForm.getFieldsValue(true)
				const { gameTypes = [] } = filterForm.getFieldsValue()
				const [startDate, endDate] = getInRangeDate({
					targetDate: selDate,
					dateRange: [queryStartDate, queryEndDate],
					timeZoneUtcOffset,
				})
				try {
					const blob = await exportCustTpBetRecordByDay({
						custId: Number(custId),
						startDate,
						endDate,
						selDate,
						gameTypes,
					}).unwrap()
					download(
						blob,
						`ExportCustTPBetRecordByDay_${moment().format(
							'YYYYMMDDHHmmss'
						)}.xlsx`
					)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
				break
			}
			case GameStatementTableEnum.TPBetRecordByCategory: {
				if (!currentCategoryId) return
				const { gameTypes = [] } = filterForm.getFieldsValue()
				const { selDate } = filterForm.getFieldsValue(true)
				const [startDate, endDate] = getInRangeDate({
					targetDate: selDate,
					dateRange: [queryStartDate, queryEndDate],
					timeZoneUtcOffset,
				})
				try {
					const blob = await exportCustTpBetRecordByCategory({
						custId: Number(custId),
						selDate,
						startDate,
						endDate,
						categoryId: currentCategoryId,
						gameTypes,
					}).unwrap()
					download(
						blob,
						`ExportCustTPBetRecordByCategory_${moment().format(
							'YYYYMMDDHHmmss'
						)}.xlsx`
					)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
				break
			}
			case GameStatementTableEnum.TPBetRecordByGameType: {
				const { selDate, gameTypeId } = filterForm.getFieldsValue(true)
				const [startDate, endDate] = getInRangeDate({
					targetDate: selDate,
					dateRange: [queryStartDate, queryEndDate],
					timeZoneUtcOffset,
				})
				try {
					const blob = await exportCustTpBetRecordByGameType({
						custId: Number(custId),
						startDate,
						endDate,
						selDate,
						gameTypeId,
					}).unwrap()
					download(
						blob,
						`ExportCustTPBetRecordByGameType_${moment().format(
							'YYYYMMDDHHmmss'
						)}.xlsx`
					)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
				break
			}
			default: {
				break
			}
		}
	}

	const filterLoading = isGetGameTypeListLoading || isGetCategoryListLoading

	const loading =
		isGetCustTpBetRecordLoading ||
		isGetTpBetRecordDetailLoading ||
		isGetCustRecordByGameTypeLoading ||
		isGetCustRecordByCategoryLoading ||
		isGetCustRecordByDayLoading

	useEffect(() => {
		// 初始化 category Select
		if (!isGetCategoryListLoading && categoryList.length > 0) {
			filterForm.setFieldsValue({
				tpCategoryList: categoryList?.map(category => category.categoryId),
			})
		}
	}, [isGetCategoryListLoading])

	useEffect(() => {
		// 取得 gameTypes
		handleGetGameType()
	}, [currentCategories])

	useEffect(() => {
		// 初始化 gameTypes , 沒有第一次進入時才自動全選 , 之後更改則必須手動重新選擇 filter
		if (!isGetGameTypeListLoading && gameTypeList.length > 0 && !initSearch) {
			filterForm.setFieldsValue({
				gameTypes: gameTypeList?.map(gameType => gameType.type),
			})
			// 更改 initState 代表初始化完成  之後更動不會再進到此 useEffect
			setInitSearch(true)
		}
	}, [isGetGameTypeListLoading])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Game.Label_Statement')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<StatementFilter
					loading={isGetCustTpBetRecordLoading}
					filterLoading={filterLoading}
					form={filterForm}
					categoryList={categoryList}
					gameTypeList={gameTypeList}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
					tableState={tableState}
					setTableState={setTableState}
				/>
				{tableState === GameStatementTableEnum.TPBetRecord && (
					<CustTpBetRecordTable
						loading={loading}
						custTpBetRecord={custTpBetRecord}
						onDetailClicked={handleTpBetRecordTableClicked}
					/>
				)}
				{tableState === GameStatementTableEnum.TPBetRecordByDay && (
					<CustTpBetRecordByDayTable
						loading={loading}
						custTpBetRecordByDay={custTpBetRecordByDay}
						onDetailClicked={handleTpBetRecordByDayTableClicked}
					/>
				)}
				{tableState === GameStatementTableEnum.TPBetRecordByCategory && (
					<CustTpBetRecordByCategoryTable
						loading={loading}
						custTpBetRecordByCategory={custTpBetRecordByCategory}
						onDetailClicked={handleTpBetRecordByCategoryTableClicked}
					/>
				)}
				{tableState === GameStatementTableEnum.TPBetRecordByGameType && (
					<CustTpBetRecordByGameTypeTable
						loading={loading}
						custTpBetRecordByGameType={custTpBetRecordByGameType}
						timeZoneUtcOffset={timeZoneUtcOffset}
						pagination={pagination}
						onTableChange={handleGetTpBetRecordByGameTypeTableChange}
						onTransIdClicked={handleTransIdClicked}
					/>
				)}
				<TpBetRecordDetailModal
					categoryId={currentCategoryId}
					loading={isGetTpBetRecordDetailLoading}
					tpBetRecordDetail={tpBetRecordDetail}
					visible={tpBetRecordDetailModal.visible}
					onCancel={tpBetRecordDetailModal.onCancel}
				/>
				<AffixButtons>
					<AffixButtons.BackToTop />
					<AffixButtons.FileExport
						disabled={!exportExcelPermission?.canUse}
						onClick={handleExport}
						loading={
							isExportCustTpBetRecordLoading ||
							isExportCustTpBetRecordByDayLoading ||
							isExportCustTpBetRecordByCategoryLoading ||
							isExportCustTpBetRecordByGameTypeLoading
						}
					/>
				</AffixButtons>
			</LayoutContent.Card>
		</>
	)
}

export default Statement

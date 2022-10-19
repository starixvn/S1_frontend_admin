import { useTranslation } from 'react-i18next'
import {
	useLazyGetCustTpBetRecordByCategoryQuery,
	useLazyGetCustTpBetRecordByDayQuery,
	useLazyGetCustTpBetRecordByGameTypeQuery,
	useLazyGetCustTpBetRecordQuery,
	useLazyGetTpBetRecordDetailQuery,
} from 'features/memberProfile/api'
import { useParams } from 'react-router-dom'
import { Form, message, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { StatementFilter } from 'features/memberProfile/pages/game/statement/StatementFilter'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useState } from 'react'
import { CustTpBetRecordTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordTable'
import { GameStatementTableEnum } from 'features/memberProfile/constants'
import { CustTpBetRecordByDayTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordByDayTable'
import { CustTpBetRecordByCategoryTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordByCategoryTable'
import { PAGINATION, useModal, usePagination } from 'common/hooks'
import { CustTpBetRecordByGameTypeTable } from 'features/memberProfile/pages/game/statement/tables/CustTpBetRecordByGameTypeTable'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { IGetTpBetRecordDetailData } from 'features/memberProfile/type'
import { TpBetRecordDetailModal } from 'features/memberProfile/pages/game/statement/tables/TpBetRecordDetailModal'

const Statement = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm()
	const [tableState, setTableState] = useState(0)
	const tpBetRecordDetailModal = useModal()
	// 第一層 , 取得客戶紀錄
	const [
		getCustTpBetRecord,
		{
			data: { data: custTpBetRecord = [] } = {},
			isFetching: isGetCustTpBetRecordLoading,
		},
	] = useLazyGetCustTpBetRecordQuery()

	// 第二層 , 取得客戶指定日期紀錄
	const [
		getCustTpBetRecordByDay,
		{
			data: { data: custTpBetRecordByDay = [] } = {},
			isFetching: isGetCustRecordByDayLoading,
		},
	] = useLazyGetCustTpBetRecordByDayQuery()

	// 第三層 , 取得客戶指定 Category 紀錄
	const [
		getCustTpBetRecordByCategory,
		{
			data: { data: custTpBetRecordByCategory = [] } = {},
			isFetching: isGetCustRecordByCategoryLoading,
		},
	] = useLazyGetCustTpBetRecordByCategoryQuery()

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

	const handleSearch = async () => {
		// 第一層
		if (!custId) return
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getCustTpBetRecord({
				custId: Number(custId),
				startDate,
				endDate,
			}).unwrap()
			setTableState(0)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTpBetRecordTableClicked = async (settledDate: string) => {
		// 取得第二層的 Table Detail ,  並切換 state 至第二層
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		filterForm.setFieldsValue({
			selDate: settledDate,
		})
		try {
			await getCustTpBetRecordByDay({
				custId: Number(custId),
				startDate,
				endDate,
				selDate: settledDate,
			}).unwrap()
			setTableState(prev => prev + 1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTpBetRecordByDayTableClicked = async (categoryId: number) => {
		// 取得第三層的 Table Detail , 並切換 state 至第三層
		const { dateRange, selDate } = filterForm.getFieldsValue(true)
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getCustTpBetRecordByCategory({
				custId: Number(custId),
				startDate,
				endDate,
				selDate,
				categoryId,
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
		const { dateRange, selDate, gameTypeId } = filterForm.getFieldsValue(true)
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
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

	const loading =
		isGetCustTpBetRecordLoading ||
		isGetTpBetRecordDetailLoading ||
		isGetCustRecordByGameTypeLoading ||
		isGetCustRecordByCategoryLoading ||
		isGetCustRecordByDayLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Game.Label_Statement')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<StatementFilter
					loading={isGetCustTpBetRecordLoading}
					form={filterForm}
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
						timeZoneUtcOffset={timeZoneUtcOffset}
						onDetailClicked={handleTpBetRecordTableClicked}
					/>
				)}
				{tableState === GameStatementTableEnum.TPBetRecordByDay && (
					<CustTpBetRecordByDayTable
						loading={loading}
						timeZoneUtcOffset={timeZoneUtcOffset}
						custTpBetRecordByDay={custTpBetRecordByDay}
						onDetailClicked={handleTpBetRecordByDayTableClicked}
					/>
				)}
				{tableState === GameStatementTableEnum.TPBetRecordByCategory && (
					<CustTpBetRecordByCategoryTable
						loading={loading}
						timeZoneUtcOffset={timeZoneUtcOffset}
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
					loading={isGetTpBetRecordDetailLoading}
					tpBetRecordDetail={tpBetRecordDetail}
					visible={tpBetRecordDetailModal.visible}
					onCancel={tpBetRecordDetailModal.onCancel}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default Statement

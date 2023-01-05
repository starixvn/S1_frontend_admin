import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { LayoutContent } from 'app/pages/layout'
import { useGetCategoryQuery } from 'common/service/allDataApi'
import {
	useLazyGetGameTypeListQuery,
	useLazyGetTurnoverByCustIdQuery,
} from 'features/memberProfile/api'
import { Form, message } from 'antd'
import { useEffect, useState } from 'react'
import { TurnoverFilter } from 'features/memberProfile/pages/game/turnover/TurnoverFilter'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { TurnoverTable } from 'features/memberProfile/pages/game/turnover/TurnoverTable'
import { TurnoverOverviewTable } from 'features/memberProfile/pages/game/turnover/TurnoverOverviewTable'

const Turnover = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const [filterForm] = Form.useForm()
	const currentCategories = Form.useWatch('tpCategoryList', filterForm)
	const [initSearch, setInitSearch] = useState(false)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

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

	const [
		getTurnoverByCustId,
		{
			data: { data: turnoverData = [] } = {},
			isFetching: isGetTurnoverLoading,
		},
	] = useLazyGetTurnoverByCustIdQuery()

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
		if (!custId) return
		const { gameTypes, dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)
		try {
			await getTurnoverByCustId({
				gameTypes,
				custId: Number(custId),
				startDate,
				endDate,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

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

	const filterLoading = isGetGameTypeListLoading || isGetCategoryListLoading

	useEffect(() => {
		// 這裡使用 initSearch state 判斷是否做過初始化 , 避免每次 filter 修改時自動 reSearch
		if (!filterLoading && custId && !initSearch) {
			handleSearch()
		}
	}, [filterLoading])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Game.Label_Turnover')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<TurnoverFilter
					loading={isGetTurnoverLoading}
					filterLoading={filterLoading}
					form={filterForm}
					onSearch={handleSearch}
					categoryList={categoryList}
					gameTypeList={gameTypeList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTimeZoneChange={onTimeZoneChange}
				/>
				<TurnoverOverviewTable
					loading={isGetTurnoverLoading}
					turnoverData={turnoverData}
				/>
				<TurnoverTable
					loading={isGetTurnoverLoading}
					turnoverData={turnoverData}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default Turnover

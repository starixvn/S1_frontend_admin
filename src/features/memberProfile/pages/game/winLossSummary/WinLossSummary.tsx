import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useGetCategoryQuery } from 'common/service/allDataApi'
import {
	useLazyGetGameTypeListQuery,
	useLazyGetWinLossSummaryDetailQuery,
} from 'features/memberProfile/api'
import { WinLossSummaryFilter } from 'features/memberProfile/pages/game/winLossSummary/WinLossSummaryFilter'
import { Form, message } from 'antd'
import { useEffect, useState } from 'react'
import { WinLossSummaryTable } from 'features/memberProfile/pages/game/winLossSummary/WinLossSummaryTable'

const WinLossSummary = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const [filterForm] = Form.useForm()
	const currentCategories = Form.useWatch('tpCategoryList', filterForm)
	const [initSearch, setInitSearch] = useState(false)

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
		getWinLossSummaryDetail,
		{
			data: { data: winLossSummaryDetail = [] } = {},
			isFetching: isGetWinLossSummaryDetailLoading,
		},
	] = useLazyGetWinLossSummaryDetailQuery()

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
		const { gameTypes } = filterForm.getFieldsValue()
		try {
			await getWinLossSummaryDetail({ custId: Number(custId), gameTypes })
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
		// 初始化 gameTypes , 沒有第一次進入時才自動全選 , 之後更改則必須手動重新選擇 filter
		if (!isGetGameTypeListLoading && gameTypeList.length > 0 && !initSearch) {
			filterForm.setFieldsValue({
				gameTypes: gameTypeList?.map(gameType => gameType.type),
			})
			setInitSearch(true)
		}
	}, [isGetGameTypeListLoading])

	useEffect(() => {
		// 取得 gameTypes
		handleGetGameType()
	}, [currentCategories])

	const filterLoading = isGetCategoryListLoading || isGetGameTypeListLoading

	useEffect(() => {
		// 這裡使用 initSearch state 判斷是否做過初始化 , 避免每次 filter 修改時自動 reSearch
		if (!filterLoading && custId && !initSearch) {
			handleSearch()
		}
	}, [filterLoading])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Game.Label_WinLoseSummary')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<WinLossSummaryFilter
					loading={isGetWinLossSummaryDetailLoading}
					filterLoading={filterLoading}
					form={filterForm}
					onSearch={handleSearch}
					categoryList={categoryList}
					gameTypeList={gameTypeList}
				/>
				<WinLossSummaryTable
					loading={isGetWinLossSummaryDetailLoading}
					winLossSummaryDetail={winLossSummaryDetail}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default WinLossSummary

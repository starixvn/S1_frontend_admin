import { head } from 'lodash'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination } from 'common/hooks'
import { message, TablePaginationConfig } from 'antd'
import { IGetNewReferralHistoryResponse } from 'features/memberProfile/type'
import { useLazyGetNewReferralHistoryLogQuery } from 'features/memberProfile/api'
import NewReferralHistoryTable from 'features/memberProfile/pages/customerInfo/newReferralHistory/NewReferralHistoryTable'
import NewReferralHistoryDescription from 'features/memberProfile/pages/customerInfo/newReferralHistory/NewReferralHistoryDescription'

const NewReferralHistory = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getNewReferralHistoryLog,
		{
			data: {
				data: newReferralHistoryList = [],
				rowCount: newReferralHistoryTotal = 0,
			} = {} as IGetNewReferralHistoryResponse,
			isLoading: isGetNewReferralHistoryLoading,
		},
	] = useLazyGetNewReferralHistoryLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: newReferralHistoryTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		try {
			await getNewReferralHistoryLog({
				custId: Number(custId),
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

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_NewReferralHistory')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<NewReferralHistoryTable
					loading={isGetNewReferralHistoryLoading}
					pagination={pagination}
					onTableChange={handleTableChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
					newReferralHistoryDetailList={
						// 這裡都會用 head 是因為後端的 response 是給陣列(感覺給物件比較不會混淆) 但實際上陣列裡不會有其他物件
						head(newReferralHistoryList)?.detail! ?? []
					}
				/>

				<NewReferralHistoryDescription
					newReferralHistoryList={newReferralHistoryList}
					newReferralHistoryTotal={newReferralHistoryTotal}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default NewReferralHistory

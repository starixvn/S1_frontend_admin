import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { ReferralHistoryTable } from 'features/memberProfile/pages/customerInfo/referralHistory/ReferralHistoryTable'
import { useLazyGetReferralHistoryLogQuery } from 'features/memberProfile/api'
import { IGetReferralHistoryResponse } from 'features/memberProfile/type'
import { message, TablePaginationConfig } from 'antd'
import { PAGINATION, usePagination } from 'common/hooks'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useTimeZone } from 'components/TimeZoneSelect'

const ReferralHistory = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getReferralHistoryLog,
		{
			data: {
				data: referralHistoryData = [],
				rowCount: referralHistoryTotal = 0,
			} = {} as IGetReferralHistoryResponse,
			isLoading: isGetReferralHistoryLoading,
		},
	] = useLazyGetReferralHistoryLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: referralHistoryTotal,
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
			await getReferralHistoryLog({
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
				title={t('MemberProfile.Menu.CustomerInfo.Label_ReferralHistory')}
			/>
			<ReferralHistoryTable
				loading={isGetReferralHistoryLoading}
				pagination={pagination}
				onTableChange={handleTableChange}
				timeZoneUtcOffset={timeZoneUtcOffset}
				referralHistoryData={referralHistoryData}
			/>
		</>
	)
}

export default ReferralHistory

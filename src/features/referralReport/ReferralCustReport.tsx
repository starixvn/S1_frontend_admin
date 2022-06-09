import { useEffect } from 'react'
import { usePagination, PAGINATION, useQueryParams } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { TablePaginationConfig, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { ReferralCustReportTable } from './ReferralCustReportTable'
import { useLazyGetCustReferralReportQuery } from './api'
import { IReferralCustReportResponse } from './type'

const ReferralCustReport = () => {
	const { t } = useTranslation()
	const [queryParams] = useQueryParams()
	const { userName, startDate, endDate, timeZoneUtcOffset } = queryParams
	const { custId } = useParams()

	const [
		getCustReferralReport,
		{
			data: {
				data: referralCustReportData,
				rowCount: custReportPaginationTotal = 0,
			} = {} as IReferralCustReportResponse,
			isLoading: isGetCustReportLoading,
		},
	] = useLazyGetCustReferralReportQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custReportPaginationTotal,
	})

	const handleFetching = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		try {
			await getCustReferralReport({
				pageNumber: current,
				pageSize,
				startDate,
				endDate,
				custID: Number(custId),
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
		handleFetching({
			current,
			pageSize,
		})
	}

	useEffect(() => {
		if (!custId) return
		handleFetching({})
	}, [custId])

	const loading = isGetCustReportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={`${t('Label_ReferralLog')} > ${userName}`} />
			<ReferralCustReportTable
				loading={loading}
				referralCustReportData={referralCustReportData}
				pagination={pagination}
				timeZoneUtcOffset={timeZoneUtcOffset}
				handleTableChange={handleTableChange}
			/>
			<AffixButtons>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ReferralCustReport

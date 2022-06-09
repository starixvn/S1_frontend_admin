import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Table } from 'components'
import { TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { numberFormatter } from 'common/utils/format'
import { IReferralReportData } from './type'

interface IReferralReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	referralReportData: IReferralReportData[]
	dateRange: { startDate: string; endDate: string }
	timeZoneUtcOffset: number
}

const ReferralReportTable: FC<IReferralReportTableProps> = ({
	loading,
	pagination,
	onTableChange,
	referralReportData,
	dateRange,
	timeZoneUtcOffset,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Invitation'),
			key: 'referralCount',
			dataIndex: 'referralCount',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Complete'),
			key: 'conditionCount',
			dataIndex: 'conditionCount',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Achievements'),
			key: 'amountCount',
			dataIndex: 'amountCount',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ReferralLog'),
			key: 'check',
			width: 80,
			align: 'center' as 'center',
			render: (values: IReferralReportData) => {
				return (
					<Typography.Link
						onClick={() => {
							const searchParams = createSearchParams({
								userName: values.userName,
								startDate: dateRange.startDate,
								endDate: dateRange.endDate,
								timeZoneUtcOffset: timeZoneUtcOffset.toString(),
							})
							navigate(
								`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.referralCustReport.root}/${values.custId}?${searchParams}`
							)
						}}
					>
						{t('Label_Check')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_ReferralRewards'),
			key: 'amountSum',
			dataIndex: 'amountSum',
			width: 120,
			align: 'center' as 'center',
			render: (amountSum: number) => numberFormatter.format(amountSum),
		},
		{
			title: t('Label_ReferralFreeCredit'),
			key: 'freeCreditSum',
			dataIndex: 'freeCreditSum',
			width: 120,
			align: 'center' as 'center',
			render: (freeCreditSum: number) => numberFormatter.format(freeCreditSum),
		},
		{
			title: t('Label_Running'),
			key: 'pendingCount',
			dataIndex: 'pendingCount',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Expired'),
			key: 'expiredCount',
			dataIndex: 'expiredCount',
			width: 80,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={referralReportData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}
export { ReferralReportTable }

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
import { ColumnsType } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import { IReferralReportData } from './type'

interface IReferralReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IReferralReportData>
	) => void
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

	const columns: ColumnsType<IReferralReportData> = [
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
			sorter: true,
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Complete'),
			key: 'conditionCount',
			dataIndex: 'conditionCount',
			sorter: true,
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Achievements'),
			key: 'amountCount',
			dataIndex: 'amountCount',
			sorter: true,
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
			sorter: true,
			width: 120,
			align: 'center' as 'center',
			render: (amountSum: number) => numberFormatter.format(amountSum),
		},
		{
			title: t('Label_ReferralFreeCredit'),
			key: 'freeCreditSum',
			dataIndex: 'freeCreditSum',
			sorter: true,
			width: 120,
			align: 'center' as 'center',
			render: (freeCreditSum: number) => numberFormatter.format(freeCreditSum),
		},
		{
			title: t('Label_Running'),
			key: 'pendingCount',
			dataIndex: 'pendingCount',
			sorter: true,
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Expired'),
			key: 'expiredCount',
			dataIndex: 'expiredCount',
			sorter: true,
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
				// 因為 沒有用到 filter , 宣告為 any 的情況下會報錯 , 這裡忽略 ts 檢查
				// @ts-ignore
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}
export { ReferralReportTable }

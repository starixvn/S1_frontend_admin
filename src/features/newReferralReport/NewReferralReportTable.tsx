import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { numberFormatter } from 'common/utils/format'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { LayoutContent } from 'app/pages/layout'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { TablePaginationConfig, Typography } from 'antd'
import { IListData } from 'features/newReferralReport/type'

interface INewReferralReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	dateRange: { startDate: string; endDate: string }
	depositReferralReportList: IListData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const NewReferralReportTable = ({
	loading,
	pagination,
	dateRange,
	depositReferralReportList,
	onTableChange,
}: INewReferralReportTableProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			align: 'center' as 'center',
			render: (currencyName: string) => currencyName || '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 120,
			align: 'center' as 'center',
			render: ({ custId, userName }: IListData) =>
				userName ? (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				) : (
					'-'
				),
		},
		{
			title: t('Label_TotalDeposit'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			align: 'center' as 'center',
			render: (totalDeposit: number) =>
				numberFormatter.format(totalDeposit) ?? '-',
		},
		{
			title: t('Label_RewardAmount'),
			key: 'referralAmount',
			dataIndex: 'referralAmount',
			align: 'center' as 'center',
			render: (referralAmount: number) =>
				numberFormatter.format(referralAmount) ?? '-',
		},
		{
			title: t('Label_Detail'),
			key: 'custId',
			align: 'center' as 'center',
			render: ({ custId, userName }: IListData) => {
				return (
					<Typography.Link
						onClick={() => {
							const searchParams = createSearchParams({
								userName,
								startDate: dateRange.startDate,
								endDate: dateRange.endDate,
							})
							navigate(
								`/${NEW_SITE_PREFIX_URL}/${paths.report.sub.newReferralCustReport.root}/${custId}?${searchParams}`
							)
						}}
					>
						{t('Label_Detail')}
					</Typography.Link>
				)
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={depositReferralReportList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default NewReferralReportTable

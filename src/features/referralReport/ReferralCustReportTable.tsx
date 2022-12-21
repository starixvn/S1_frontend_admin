import moment from 'moment'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IReferralCustReportData } from 'features/referralReport/type'

interface IReferralCustReportTable {
	loading: boolean
	referralCustReportData: IReferralCustReportData[]
	pagination: PaginationInterface
	handleTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
}
const ReferralCustReportTable: FC<IReferralCustReportTable> = ({
	loading,
	referralCustReportData,
	pagination,
	handleTableChange,
	timeZoneUtcOffset,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_RegTime'),
			key: 'registerDate',
			dataIndex: 'registerDate',
			width: 150,
			align: 'center' as 'center',
			render: (registerDate: string) =>
				registerDate
					? moment(registerDate).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_TotalDeposit'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			width: 100,
			align: 'center' as 'center',
			render: (totalDeposit: number) => numberFormatter.format(totalDeposit),
		},
		{
			title: t('Label_TotalBet'),
			key: 'totalBet',
			dataIndex: 'totalBet',
			width: 100,
			align: 'center' as 'center',
			render: (totalBet: number) => numberFormatter.format(totalBet),
		},
		{
			title: t('Label_RewardAmount'),
			key: 'bonusAmount',
			dataIndex: 'bonusAmount',
			width: 100,
			align: 'center' as 'center',
			render: (bonusAmount: number) => numberFormatter.format(bonusAmount),
		},
		{
			title: t('Label_ReferralFreeCredit'),
			key: 'referralFreeCredit',
			dataIndex: 'referralFreeCredit',
			width: 100,
			align: 'center' as 'center',
			render: (referralFreeCredit: number) =>
				numberFormatter.format(referralFreeCredit),
		},
		{
			title: t('Label_RewardTime'),
			key: 'rewardTime',
			dataIndex: 'rewardTime',
			width: 150,
			align: 'center' as 'center',
			render: (rewardTime: string) =>
				rewardTime
					? moment(rewardTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Status'),
			key: 'statusName',
			dataIndex: 'statusName',
			width: 100,
			align: 'center' as 'center',
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={referralCustReportData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={handleTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { ReferralCustReportTable }

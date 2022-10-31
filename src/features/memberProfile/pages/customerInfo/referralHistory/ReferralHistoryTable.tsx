import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { IGetReferralHistoryData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { numberFormatter, timeFormat } from 'common/utils/format'

interface IReferralHistoryTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
	referralHistoryData: IGetReferralHistoryData[]
}

const ReferralHistoryTable = ({
	loading,
	pagination,
	onTableChange,
	timeZoneUtcOffset,
	referralHistoryData,
}: IReferralHistoryTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: (userName: string) => (!isEmpty(userName) ? userName : '-'),
		},
		{
			title: t('Label_RegisterDate'),
			key: 'registerDate',
			dataIndex: 'registerDate',
			width: 120,
			align: 'center' as 'center',
			render: (registerDate: string) =>
				registerDate ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(registerDate)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_TotalDepositedAmount'),
			key: 'totalDepositedAmount',
			width: 120,
			align: 'center' as 'center',
			render: (record: IGetReferralHistoryData) => {
				const { totalDeposit, depositC } = record
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{`${totalDeposit ? numberFormatter.format(totalDeposit) : 0} / ${
							depositC ? numberFormatter.format(depositC) : 0
						}`}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_TotalBetAmount'),
			key: 'totalBetAmount',
			width: 120,
			align: 'center' as 'center',
			render: (record: IGetReferralHistoryData) => {
				const { totalBet, validBetC } = record
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{`${totalBet ? numberFormatter.format(totalBet) : 0} / ${
							validBetC ? numberFormatter.format(validBetC) : 0
						}`}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_RewardAmount'),
			key: 'rewardAmount',
			dataIndex: 'bonusAmount',
			width: 100,
			align: 'center' as 'center',
			render: (bonusAmount: number) =>
				bonusAmount ? numberFormatter.format(bonusAmount) : 0,
		},
		{
			title: t('Label_ReferralFreeCredit'),
			key: 'referralFreeCredit',
			dataIndex: 'referralFreeCredit',
			width: 100,
			align: 'center' as 'center',
			render: (referralFreeCredit: number) =>
				referralFreeCredit ? numberFormatter.format(referralFreeCredit) : 0,
		},
		{
			title: t('Label_RewardDate'),
			key: 'rewardTime',
			dataIndex: 'rewardTime',
			width: 100,
			align: 'center' as 'center',
			render: (rewardTime: string) =>
				rewardTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(rewardTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'statusName',
			width: 100,
			align: 'center' as 'center',
		},
	]
	return (
		<LayoutContent.Card style={{ marginTop: -20 }}>
			<Table
				loading={loading}
				onChange={onTableChange}
				pagination={pagination as TablePaginationConfig}
				style={{ marginTop: '10px', marginBottom: '10px' }}
				dataSource={referralHistoryData ?? []}
				columns={columns}
			/>
		</LayoutContent.Card>
	)
}

export { ReferralHistoryTable }

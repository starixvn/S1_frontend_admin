import moment from 'moment'
import { Table } from 'components'
import paths from 'app/constants/paths'
import { useTranslation } from 'react-i18next'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { NewReferralDetailData } from 'features/memberProfile/type'
import {
	numberFormatter,
	numFormatToDigits,
	timeFormat,
} from 'common/utils/format'

interface INewReferralHistoryTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
	newReferralHistoryDetailList: NewReferralDetailData[]
}

const NewReferralHistoryTable = ({
	loading,
	pagination,
	onTableChange,
	timeZoneUtcOffset,
	newReferralHistoryDetailList,
}: INewReferralHistoryTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 120,
			align: 'center' as 'center',
			render: ({ custId, userName }: NewReferralDetailData) =>
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
			title: t('Label_RegisterDate'),
			key: 'regTime',
			dataIndex: 'regTime',
			width: 120,
			align: 'center' as 'center',
			render: (regTime: string) =>
				regTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(regTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_TotalDepositedAmount'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			width: 120,
			align: 'center' as 'center',
			render: (totalDeposit: number) => numberFormatter.format(totalDeposit),
		},
		{
			title: t('Label_TotalRewardAmount'),
			key: 'referralAmount',
			dataIndex: 'referralAmount',
			width: 120,
			align: 'center' as 'center',
			render: (referralAmount: number) =>
				numFormatToDigits(referralAmount || 0),
		},
	]

	return (
		<Table
			loading={loading}
			onChange={onTableChange}
			pagination={
				{
					...pagination,
					showTotal: total => `total ${total} items`,
				} as TablePaginationConfig
			}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={newReferralHistoryDetailList}
			columns={columns}
		/>
	)
}

export default NewReferralHistoryTable

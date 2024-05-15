import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { IGetReferralHistoryData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography

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
						{dayjs(registerDate)
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
			render: ({ totalDeposit, depositC }: IGetReferralHistoryData) => (
				<>
					<Text
						type={isPositiveNum(totalDeposit) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(totalDeposit || 0)}
					</Text>
					{` / `}
					<Text
						type={isPositiveNum(depositC) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(depositC || 0)}
					</Text>
				</>
			),
		},
		{
			title: t('Label_TotalBetAmount'),
			key: 'totalBetAmount',
			width: 120,
			align: 'center' as 'center',
			render: (record: IGetReferralHistoryData) => {
				const { totalBet, validBetC } = record
				return (
					<>
						<Text
							type={isPositiveNum(totalBet) ? undefined : 'danger'}
							style={{ whiteSpace: 'nowrap', padding: '5px' }}
						>
							{numFormatToDigits(totalBet || 0)}
						</Text>
						{` / `}
						<Text
							type={isPositiveNum(validBetC) ? undefined : 'danger'}
							style={{ whiteSpace: 'nowrap', padding: '5px' }}
						>
							{numFormatToDigits(validBetC || 0)}
						</Text>
					</>
				)
			},
		},
		{
			title: t('Label_RewardAmount'),
			key: 'rewardAmount',
			dataIndex: 'bonusAmount',
			width: 100,
			align: 'center' as 'center',
			render: (bonusAmount: number) => (
				<Text
					type={isPositiveNum(bonusAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(bonusAmount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_ReferralFreeCredit'),
			key: 'referralFreeCredit',
			dataIndex: 'referralFreeCredit',
			width: 100,
			align: 'center' as 'center',
			render: (referralFreeCredit: number) => (
				<Text
					type={isPositiveNum(referralFreeCredit) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(referralFreeCredit || 0)}
				</Text>
			),
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
						{dayjs(rewardTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
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
				pagination={
					{
						...pagination,
						showTotal: total => `total ${total} items`,
					} as TablePaginationConfig
				}
				style={{ marginTop: '10px', marginBottom: '10px' }}
				dataSource={referralHistoryData ?? []}
				columns={columns}
			/>
		</LayoutContent.Card>
	)
}

export { ReferralHistoryTable }

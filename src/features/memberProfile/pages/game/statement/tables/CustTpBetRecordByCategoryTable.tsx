import { IGetCustTpBetRecordByCategoryIdData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { Button, Typography } from 'antd'
import moment from 'moment/moment'
import { dateFormat, numberFormatter } from 'common/utils/format'

interface ICustTpBetRecordByCategoryTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	custTpBetRecordByCategory: IGetCustTpBetRecordByCategoryIdData[]
	onDetailClicked: (gameTypeId: number) => void
}
const CustTpBetRecordByCategoryTable = ({
	loading,
	timeZoneUtcOffset,
	custTpBetRecordByCategory,
	onDetailClicked,
}: ICustTpBetRecordByCategoryTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_SettledDate'),
			key: 'settledDate',
			dataIndex: 'settledDate',
			width: 150,
			align: 'center' as 'center',
			render: (settledDate: string) =>
				settledDate ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(settledDate)
							.utcOffset(timeZoneUtcOffset)
							.format(dateFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetCustTpBetRecordByCategoryIdData) => {
				const { gameTypeID } = record
				return (
					<Button
						type='primary'
						shape='round'
						onClick={() => onDetailClicked(gameTypeID)}
					>
						{t('Label_Detail')}
					</Button>
				)
			},
		},
		{
			title: t('Label_GameType'),
			key: 'gameTypeName',
			dataIndex: 'gameTypeName',
			width: 120,
			align: 'center' as 'center',
			render: (gameTypeName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{gameTypeName}
				</Typography.Text>
			),
		},
		{
			title: t('Label_TotalTO'),
			key: 'totalTO',
			dataIndex: 'totalTO',
			width: 100,
			align: 'center' as 'center',
			render: (totalTO: number) =>
				totalTO ? numberFormatter.format(totalTO) : 0,
		},
		{
			title: t('Label_TurnoverWithoutBonus'),
			key: 'totalTOExcludeBonus',
			dataIndex: 'totalTOExcludeBonus',
			width: 100,
			align: 'center' as 'center',
			render: (totalTOExcludeBonus: number) =>
				totalTOExcludeBonus ? numberFormatter.format(totalTOExcludeBonus) : 0,
		},
		{
			title: t('Label_ValidBet'),
			key: 'validBet',
			dataIndex: 'validBet',
			width: 100,
			align: 'center' as 'center',
			render: (validBet: number) => {
				return validBet ? numberFormatter.format(validBet) : 0
			},
		},
		{
			title: t('Label_InvalidBet'),
			key: 'invalidBet',
			dataIndex: 'invalidBet',
			width: 120,
			align: 'center' as 'center',
			render: (invalidBet: number) => {
				return invalidBet ? numberFormatter.format(invalidBet) : 0
			},
		},
		{
			title: `${t('Label_TurnOver')} ${t('Label_ExcludeValidTO')}`,
			dataIndex: 'turnOver',
			key: 'stakeNotRollover',
			width: 120,
			align: 'center' as 'center',
			render: (turnOver: number) =>
				turnOver ? numberFormatter.format(turnOver) : 0,
		},
		{
			title: t('Label_RunningTickets'),
			key: 'runningTickets',
			dataIndex: 'runningTickets',
			width: 80,
			align: 'center' as 'center',
			render: (runningTickets: number) => {
				return runningTickets ? numberFormatter.format(runningTickets) : 0
			},
		},
		{
			title: t('Label_WinLoss'),
			key: 'winLoss',
			dataIndex: 'winLoss',
			width: 100,
			align: 'center' as 'center',
			render: (winLoss: number) => {
				return winLoss ? numberFormatter.format(winLoss) : 0
			},
		},
		{
			title: t('Label_WinLossWithoutBonus'),
			key: 'winLossExcludeBonus',
			dataIndex: 'winLossExcludeBonus',
			width: 100,
			align: 'center' as 'center',
			render: (winLossExcludeBonus: number) => {
				return winLossExcludeBonus
					? numberFormatter.format(winLossExcludeBonus)
					: 0
			},
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={custTpBetRecordByCategory ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
		/>
	)
}

export { CustTpBetRecordByCategoryTable }

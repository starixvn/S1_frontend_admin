import { IGetTurnoverData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { numberFormatter } from 'common/utils/format'

interface ITurnoverTableProps {
	loading: boolean
	turnoverData: IGetTurnoverData[]
}

const TurnoverTable = ({ loading, turnoverData }: ITurnoverTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_GameName'),
			dataIndex: 'gameName',
			key: 'gameName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TotalTO'),
			key: 'totalTO',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetTurnoverData) => {
				const { stakeSettled = 0, stakeNotRollover = 0 } = record
				return numberFormatter.format(stakeSettled + stakeNotRollover)
			},
		},
		{
			title: t('Label_ValidBet'),
			key: 'validBet',
			dataIndex: 'stakeSettled',
			width: 100,
			align: 'center' as 'center',
			render: (stakeSettled: number) => {
				return stakeSettled ? numberFormatter.format(stakeSettled) : 0
			},
		},
		{
			title: t('Label_TurnOver') + t('Label_ExcludeValidTO'),
			key: 'turnover',
			dataIndex: 'stakeNotRollover',
			width: 100,
			align: 'center' as 'center',
			render: (stakeNotRollover: number) => {
				return stakeNotRollover ? numberFormatter.format(stakeNotRollover) : 0
			},
		},
		{
			title: t('Label_WinLoss'),
			key: 'winLoss',
			dataIndex: 'winlostAmount',
			width: 100,
			align: 'center' as 'center',
			render: (winlostAmount: number) => {
				return winlostAmount ? numberFormatter.format(winlostAmount) : 0
			},
		},
	]

	return (
		<Table
			loading={loading}
			dataSource={turnoverData ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
		/>
	)
}

export { TurnoverTable }

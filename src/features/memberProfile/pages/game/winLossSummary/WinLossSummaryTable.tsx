import { IGetWinLossSummaryDetailData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { Table } from 'components'

interface IWinLossSummaryTableProps {
	loading: boolean
	winLossSummaryDetail: IGetWinLossSummaryDetailData[]
}

const WinLossSummaryTable = ({
	loading,
	winLossSummaryDetail,
}: IWinLossSummaryTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_GameName'),
			dataIndex: 'gameName',
			key: 'gameName',
			width: '20%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_ValidBet'),
			dataIndex: 'stakeSettled',
			key: 'stakeSettled',
			width: '15%',
			align: 'center' as 'center',
			render: (stakeSettled: number) =>
				stakeSettled ? numberFormatter.format(stakeSettled) : 0,
		},
		{
			title: t('Label_TurnOver') + t('Label_ExcludeValidTO'),
			dataIndex: 'stakeNotRollover',
			key: 'stakeNotRollover',
			width: '15%',
			align: 'center' as 'center',
			render: (stakeNotRollover: number) =>
				stakeNotRollover ? numberFormatter.format(stakeNotRollover) : 0,
		},
		{
			title: t('Label_WinLoss'),
			dataIndex: 'winlostAmount',
			key: 'winlostAmount',
			width: '15%',
			align: 'center' as 'center',
			render: (winlostAmount: number) =>
				winlostAmount ? numberFormatter.format(winlostAmount) : 0,
		},
	]
	return (
		<Table
			dataSource={winLossSummaryDetail ?? []}
			loading={loading}
			columns={columns}
			style={{ marginTop: '10px', marginBottom: '10px' }}
		/>
	)
}

export { WinLossSummaryTable }

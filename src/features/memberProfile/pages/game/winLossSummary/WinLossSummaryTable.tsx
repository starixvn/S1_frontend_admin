import { IGetWinLossSummaryDetailData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { numFormatToDigits } from 'common/utils/format'
import { Table } from 'components'
import { Typography } from 'antd'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography
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
			title: t('Label_TpUserName'),
			dataIndex: 'tpUserName',
			key: 'tpUserName',
			width: '20%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_ValidBet'),
			dataIndex: 'stakeSettled',
			key: 'stakeSettled',
			width: '20%',
			align: 'center' as 'center',
			render: (stakeSettled: number) => (
				<Text
					type={isPositiveNum(stakeSettled) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(stakeSettled || 0)}
				</Text>
			),
		},
		{
			title: t('Label_TurnOver') + t('Label_ExcludeValidTO'),
			dataIndex: 'stakeNotRollover',
			key: 'stakeNotRollover',
			width: '20%',
			align: 'center' as 'center',
			render: (stakeNotRollover: number) => (
				<Text
					type={isPositiveNum(stakeNotRollover) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(stakeNotRollover || 0)}
				</Text>
			),
		},
		{
			title: t('Label_WinLoss'),
			dataIndex: 'winlostAmount',
			key: 'winlostAmount',
			width: '20%',
			align: 'center' as 'center',
			render: (winlostAmount: number) => (
				<Text
					type={isPositiveNum(winlostAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(winlostAmount || 0)}
				</Text>
			),
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

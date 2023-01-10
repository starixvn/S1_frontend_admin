import { IGetTurnoverData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { numFormatToDigits } from 'common/utils/format'
import { Typography } from 'antd'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography
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
			title: t('Label_TpUserName'),
			dataIndex: 'tpUserName',
			key: 'tpUserName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TotalTO'),
			key: 'totalTO',
			width: 100,
			align: 'center' as 'center',
			render: ({
				stakeSettled = 0,
				stakeNotRollover = 0,
			}: IGetTurnoverData) => (
				<Text
					type={
						isPositiveNum(stakeSettled + stakeNotRollover)
							? undefined
							: 'danger'
					}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(stakeSettled + stakeNotRollover)}
				</Text>
			),
		},
		{
			title: t('Label_ValidBet'),
			key: 'validBet',
			dataIndex: 'stakeSettled',
			width: 100,
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
			key: 'turnover',
			dataIndex: 'stakeNotRollover',
			width: 100,
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
			key: 'winLoss',
			dataIndex: 'winlostAmount',
			width: 100,
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
			loading={loading}
			dataSource={turnoverData ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
		/>
	)
}

export { TurnoverTable }

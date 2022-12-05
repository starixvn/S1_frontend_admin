import { IGetCustTpBetRecordByCategoryIdData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { Button, Typography, Table as AntdTable } from 'antd'
import moment from 'moment/moment'
import { dateFormat, numFormatToDigits } from 'common/utils/format'
import { sumTotalObject } from 'common/utils'

interface ICustTpBetRecordByCategoryTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	custTpBetRecordByCategory: IGetCustTpBetRecordByCategoryIdData[]
	onDetailClicked: (gameTypeId: number) => void
}

const { Summary } = AntdTable

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
			render: (totalTO: number) => (totalTO ? numFormatToDigits(totalTO) : 0),
		},
		{
			title: t('Label_TurnoverWithoutBonus'),
			key: 'totalTOExcludeBonus',
			dataIndex: 'totalTOExcludeBonus',
			width: 100,
			align: 'center' as 'center',
			render: (totalTOExcludeBonus: number) =>
				totalTOExcludeBonus ? numFormatToDigits(totalTOExcludeBonus) : 0,
		},
		{
			title: t('Label_ValidBet'),
			key: 'validBet',
			dataIndex: 'validBet',
			width: 100,
			align: 'center' as 'center',
			render: (validBet: number) => {
				return validBet ? numFormatToDigits(validBet) : 0
			},
		},
		{
			title: t('Label_InvalidBet'),
			key: 'invalidBet',
			dataIndex: 'invalidBet',
			width: 120,
			align: 'center' as 'center',
			render: (invalidBet: number) => {
				return invalidBet ? numFormatToDigits(invalidBet) : 0
			},
		},
		{
			title: `${t('Label_TurnOver')} ${t('Label_ExcludeValidTO')}`,
			dataIndex: 'turnOver',
			key: 'stakeNotRollover',
			width: 120,
			align: 'center' as 'center',
			render: (turnOver: number) =>
				turnOver ? numFormatToDigits(turnOver) : 0,
		},
		{
			title: t('Label_RunningTickets'),
			key: 'runningTickets',
			dataIndex: 'runningTickets',
			width: 80,
			align: 'center' as 'center',
			render: (runningTickets: number) => {
				return runningTickets ? numFormatToDigits(runningTickets) : 0
			},
		},
		{
			title: t('Label_WinLoss'),
			key: 'winLoss',
			dataIndex: 'winLoss',
			width: 100,
			align: 'center' as 'center',
			render: (winLoss: number) => {
				return winLoss ? numFormatToDigits(winLoss) : 0
			},
		},
		{
			title: t('Label_WinLossWithoutBonus'),
			key: 'winLossExcludeBonus',
			dataIndex: 'winLossExcludeBonus',
			width: 100,
			align: 'center' as 'center',
			render: (winLossExcludeBonus: number) => {
				return winLossExcludeBonus ? numFormatToDigits(winLossExcludeBonus) : 0
			},
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={custTpBetRecordByCategory ?? []}
			summary={
				// eslint-disable-next-line react/no-unstable-nested-components
				pageData => {
					if (pageData.length <= 1) return null
					const totalData: IGetCustTpBetRecordByCategoryIdData = sumTotalObject(
						pageData as object[]
					)
					const {
						totalTO,
						totalTOExcludeBonus,
						validBet,
						invalidBet,
						turnOver,
						runningTickets,
						winLoss,
						winLossExcludeBonus,
					} = totalData

					return (
						<Summary.Row>
							<Summary.Cell index={0} />
							<Summary.Cell index={1} />
							<Summary.Cell index={2} align='center'>
								{t('Label_Total')}
							</Summary.Cell>
							<Summary.Cell index={3} align='center'>
								{totalTO ? numFormatToDigits(totalTO) : 0}
							</Summary.Cell>
							<Summary.Cell index={4} align='center'>
								{totalTOExcludeBonus
									? numFormatToDigits(totalTOExcludeBonus)
									: 0}
							</Summary.Cell>
							<Summary.Cell index={5} align='center'>
								{validBet ? numFormatToDigits(validBet) : 0}
							</Summary.Cell>
							<Summary.Cell index={6} align='center'>
								{invalidBet ? numFormatToDigits(invalidBet) : 0}
							</Summary.Cell>
							<Summary.Cell index={7} align='center'>
								{turnOver ? numFormatToDigits(turnOver) : 0}
							</Summary.Cell>
							<Summary.Cell index={8} align='center'>
								{runningTickets ? numFormatToDigits(runningTickets) : 0}
							</Summary.Cell>
							<Summary.Cell index={9} align='center'>
								{winLoss ? numFormatToDigits(winLoss) : 0}
							</Summary.Cell>
							<Summary.Cell index={10} align='center'>
								{winLossExcludeBonus
									? numFormatToDigits(winLossExcludeBonus)
									: 0}
							</Summary.Cell>
						</Summary.Row>
					)
				}
			}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
		/>
	)
}

export { CustTpBetRecordByCategoryTable }

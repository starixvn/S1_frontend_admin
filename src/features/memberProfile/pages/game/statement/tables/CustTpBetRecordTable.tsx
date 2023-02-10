import moment from 'moment'
import { IGetCustTpBetRecordData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { Button, Typography, Table as AntdTable } from 'antd'
import { dateFormat, numFormatToDigits } from 'common/utils/format'
import { isPositiveNum, sumTotalObject } from 'common/utils'

const { Text } = Typography

interface ICustTpBetRecordTableProps {
	loading: boolean
	custTpBetRecord: IGetCustTpBetRecordData[]
	onDetailClicked: (settledDate: string) => void
}

const { Summary } = AntdTable

const CustTpBetRecordTable = ({
	loading,
	custTpBetRecord,
	onDetailClicked,
}: ICustTpBetRecordTableProps) => {
	// 第一層
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_SettledDate'),
			key: 'settledDate',
			dataIndex: 'settledDate',
			width: 150,
			align: 'center' as 'center',
			render: (settledDate: string) => {
				return settledDate ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{/* settledDate 經過討論不需要額外做 timezone 的處理 */}
						{moment(settledDate).format(dateFormat)}
					</Typography.Text>
				) : (
					''
				)
			},
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetCustTpBetRecordData) => {
				const { settledDate } = record
				// noAction 為自定義的 total 欄位，total 欄位不會有 detail 可以使用
				return (
					<Button
						type='primary'
						shape='round'
						onClick={() => onDetailClicked(settledDate)}
					>
						{t('Label_Detail')}
					</Button>
				)
			},
		},
		{
			title: t('Label_TotalTO'),
			key: 'totalTO',
			dataIndex: 'totalTO',
			width: 100,
			align: 'center' as 'center',
			render: (totalTO: number) => (
				<Text
					type={isPositiveNum(totalTO) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(totalTO || 0)}
				</Text>
			),
		},
		{
			title: t('Label_TurnoverWithoutBonus'),
			key: 'totalTOExcludeBonus',
			dataIndex: 'totalTOExcludeBonus',
			width: 100,
			align: 'center' as 'center',
			render: (totalTOExcludeBonus: number) => (
				<Text
					type={isPositiveNum(totalTOExcludeBonus) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(totalTOExcludeBonus || 0)}
				</Text>
			),
		},
		{
			title: t('Label_ValidBet'),
			key: 'validBet',
			dataIndex: 'validBet',
			width: 100,
			align: 'center' as 'center',
			render: (validBet: number) => (
				<Text
					type={isPositiveNum(validBet) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(validBet || 0)}
				</Text>
			),
		},
		{
			title: t('Label_InvalidBet'),
			key: 'invalidBet',
			dataIndex: 'invalidBet',
			width: 120,
			align: 'center' as 'center',
			render: (invalidBet: number) => (
				<Text
					type={isPositiveNum(invalidBet) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(invalidBet || 0)}
				</Text>
			),
		},
		{
			title: `${t('Label_TurnOver')} ${t('Label_ExcludeValidTO')}`,
			dataIndex: 'turnOver',
			key: 'stakeNotRollover',
			width: 120,
			align: 'center' as 'center',
			render: (turnOver: number) => (
				<Text
					type={isPositiveNum(turnOver) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(turnOver || 0)}
				</Text>
			),
		},
		{
			title: t('Label_RunningTickets'),
			key: 'runningTickets',
			dataIndex: 'runningTickets',
			width: 80,
			align: 'center' as 'center',
			render: (runningTickets: number) => (
				<Text
					type={isPositiveNum(runningTickets) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(runningTickets || 0)}
				</Text>
			),
		},
		{
			title: t('Label_WinLoss'),
			key: 'winLoss',
			dataIndex: 'winLoss',
			width: 100,
			align: 'center' as 'center',
			render: (winLoss: number) => (
				<Text
					type={isPositiveNum(winLoss) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(winLoss || 0)}
				</Text>
			),
		},
		{
			title: t('Label_WinLossWithoutBonus'),
			key: 'winLossExcludeBonus',
			dataIndex: 'winLossExcludeBonus',
			width: 100,
			align: 'center' as 'center',
			render: (winLossExcludeBonus: number) => (
				<Text
					type={isPositiveNum(winLossExcludeBonus) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(winLossExcludeBonus || 0)}
				</Text>
			),
		},
	]

	return (
		<Table
			loading={loading}
			dataSource={custTpBetRecord ?? []}
			summary={
				// eslint-disable-next-line react/no-unstable-nested-components
				pageData => {
					if (pageData.length <= 1) return null
					const totalData: IGetCustTpBetRecordData = sumTotalObject(
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
							<Summary.Cell index={0} align='center'>
								{t('Label_Total')}
							</Summary.Cell>
							<Summary.Cell index={1} />
							<Summary.Cell index={2} align='center'>
								{totalTO ? numFormatToDigits(totalTO) : 0}
							</Summary.Cell>
							<Summary.Cell index={3} align='center'>
								{totalTOExcludeBonus
									? numFormatToDigits(totalTOExcludeBonus)
									: 0}
							</Summary.Cell>
							<Summary.Cell index={4} align='center'>
								{validBet ? numFormatToDigits(validBet) : 0}
							</Summary.Cell>
							<Summary.Cell index={5} align='center'>
								{invalidBet ? numFormatToDigits(invalidBet) : 0}
							</Summary.Cell>
							<Summary.Cell index={6} align='center'>
								{turnOver ? numFormatToDigits(turnOver) : 0}
							</Summary.Cell>
							<Summary.Cell index={7} align='center'>
								{runningTickets ? numFormatToDigits(runningTickets) : 0}
							</Summary.Cell>
							<Summary.Cell index={8} align='center'>
								{winLoss ? numFormatToDigits(winLoss) : 0}
							</Summary.Cell>
							<Summary.Cell index={9} align='center'>
								{winLossExcludeBonus
									? numFormatToDigits(winLossExcludeBonus)
									: 0}
							</Summary.Cell>
						</Summary.Row>
					)
				}
			}
			columns={columns}
			style={{ marginTop: '10px', marginBottom: '10px' }}
		/>
	)
}

export { CustTpBetRecordTable }

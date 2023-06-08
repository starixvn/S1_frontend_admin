import moment from 'moment'
import { IGetCustTpBetRecordByGameTypeData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import {
	PaginationProps,
	Table as AntdTable,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { isEmpty } from 'lodash'
import { isPositiveNum, sumTotalObject } from 'common/utils'

const { Text } = Typography

interface ICustTpBetRecordByGameTypeTableProps {
	loading: boolean
	custTpBetRecordByGameType: IGetCustTpBetRecordByGameTypeData[]
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onTransIdClicked: ({
		transId,
		settledTime,
	}: {
		transId: string
		settledTime: string
	}) => void
}

const { Summary } = AntdTable

const CustTpBetRecordByGameTypeTable = ({
	loading,
	custTpBetRecordByGameType,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	onTransIdClicked,
}: ICustTpBetRecordByGameTypeTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_TransId'),
			key: 'transId',
			width: 120,
			align: 'center' as 'center',
			render: (record: IGetCustTpBetRecordByGameTypeData) => {
				const { transId, settledTime } = record
				return (
					<Typography.Link
						onClick={() => onTransIdClicked({ transId, settledTime })}
					>
						{transId}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_SettlementTypeName'),
			key: 'settlementTypeName',
			dataIndex: 'settlementTypeName',
			width: 120,
			align: 'center' as 'center',
			render: (settlementTypeName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{settlementTypeName}
				</Typography.Text>
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
			title: `${t('Label_TurnOver')} ${t('Label_ExcludeValidTO')}`,
			dataIndex: 'turnOver_ExcludeValidTO',
			key: 'turnOver',
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
			title: t('Label_WinLoss'),
			key: 'winLoss',
			dataIndex: 'winlostAmount',
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
			title: t('Label_TransTime'),
			key: 'transTime',
			dataIndex: 'transTime',
			width: 150,
			align: 'center' as 'center',
			render: (transTime: string) =>
				transTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(transTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_SettledTime'),
			key: 'settledDate',
			dataIndex: 'settledTime',
			width: 150,
			align: 'center' as 'center',
			render: (settledTime: string) =>
				settledTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(settledTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_BonusId'),
			key: 'bonusId',
			dataIndex: 'bonusId',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 100,
			align: 'center' as 'center',
			render: (bonusCode: string) => (!isEmpty(bonusCode) ? bonusCode : '-'),
		},
	]

	const showTotal: PaginationProps['showTotal'] = total =>
		`Total ${total} items`

	return (
		<Table
			loading={loading}
			dataSource={custTpBetRecordByGameType ?? []}
			summary={
				// eslint-disable-next-line react/no-unstable-nested-components
				pageData => {
					if (pageData.length <= 1) return null
					const totalData: IGetCustTpBetRecordByGameTypeData = sumTotalObject(
						pageData as object[]
					)
					const { validBet, turnOver, winlostAmount } = totalData

					return (
						<Summary.Row>
							<Summary.Cell index={0} align='center'>
								-
							</Summary.Cell>
							<Summary.Cell index={1} align='center'>
								{t('Label_Total')}
							</Summary.Cell>
							<Summary.Cell index={2} align='center'>
								{validBet ? numFormatToDigits(validBet) : 0}
							</Summary.Cell>
							<Summary.Cell index={3} align='center'>
								{turnOver ? numFormatToDigits(turnOver) : 0}
							</Summary.Cell>
							<Summary.Cell index={4} align='center'>
								{winlostAmount ? numFormatToDigits(winlostAmount) : 0}
							</Summary.Cell>
							<Summary.Cell index={5} align='center'>
								-
							</Summary.Cell>
							<Summary.Cell index={6} align='center'>
								-
							</Summary.Cell>
							<Summary.Cell index={7} align='center'>
								-
							</Summary.Cell>
							<Summary.Cell index={8} align='center'>
								-
							</Summary.Cell>
						</Summary.Row>
					)
				}
			}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={
				{
					pagination,
					showTotal,
					position: ['topRight'],
				} as TablePaginationConfig
			}
			onChange={onTableChange}
		/>
	)
}

export { CustTpBetRecordByGameTypeTable }

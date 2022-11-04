import { IGetCustTpBetRecordByGameTypeData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { isEmpty } from 'lodash'

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
			render: (validBet: number) => {
				return validBet ? numberFormatter.format(validBet) : 0
			},
		},
		{
			title: `${t('Label_TurnOver')} ${t('Label_ExcludeValidTO')}`,
			dataIndex: 'turnOver',
			key: 'turnOver',
			width: 120,
			align: 'center' as 'center',
			render: (turnOver: number) =>
				turnOver ? numberFormatter.format(turnOver) : 0,
		},
		{
			title: t('Label_WinLoss'),
			key: 'winLoss',
			dataIndex: 'winlostAmount',
			width: 100,
			align: 'center' as 'center',
			render: (winLoss: number) => {
				return winLoss ? numberFormatter.format(winLoss) : 0
			},
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
					''
				),
		},
		{
			title: t('Label_TransTime'),
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
					''
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
	return (
		<Table
			loading={loading}
			dataSource={custTpBetRecordByGameType ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export { CustTpBetRecordByGameTypeTable }

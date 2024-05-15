import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import dayjs from 'dayjs'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetTransferInfoData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'

interface TransferTableProps {
	transferInfoList: IGetTransferInfoData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	statusList: IEnumTypeData[]
}
const TransferTable = ({
	transferInfoList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	statusList,
}: TransferTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_CreateTime'),
			key: 'CreateTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_TrxnID'),
			key: 'TrxnID',
			dataIndex: 'transId',
			width: 100,
			align: 'center' as 'center',
			render: (transId: string) => transId ?? '-',
		},
		{
			title: t('Label_ThirdParty'),
			key: 'ThirdParty',
			dataIndex: 'tpName',
			width: 100,
			align: 'center' as 'center',
			render: (tpName: string) => tpName ?? '-',
		},
		{
			title: t('Label_Direction'),
			key: 'Direction',
			dataIndex: 'directionName',
			width: 100,
			align: 'center' as 'center',
			render: (directionName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{directionName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Amount'),
			key: 'Amount',
			dataIndex: 'amount',
			width: 100,
			align: 'center' as 'center',
			render: (amount: number) => (amount ? numFormatToDigits(amount) : 0),
		},
		{
			title: t('Label_ThirdPartyID'),
			key: 'ThirdPartyID',
			dataIndex: 'thirdId',
			width: 100,
			align: 'center' as 'center',
			render: (thirdId: number) => thirdId ?? '-',
		},
		{
			title: t('Label_Status'),
			key: 'Status',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) =>
				statusList.map(({ value, name }) => value === status && name),
		},
		{
			title: t('Label_Memo'),
			key: 'Memo',
			dataIndex: 'memo',
			width: 100,
			align: 'center' as 'center',
			render: (memo: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{memo ?? '-'}
				</Typography.Text>
			),
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={transferInfoList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default TransferTable

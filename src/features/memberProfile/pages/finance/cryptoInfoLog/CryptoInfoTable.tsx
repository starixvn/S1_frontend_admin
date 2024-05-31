import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetCryptoLogData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'

interface CryptoInfoTableProps {
	cryptoLogList: IGetCryptoLogData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	statusList: IEnumTypeData[]
}
const CryptoInfoTable = ({
	cryptoLogList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	statusList,
}: CryptoInfoTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Type'),
			key: 'Type',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) =>
				statusList.map(({ value, name }) => value === status && name),
		},
		{
			title: t('Label_Channel'),
			key: 'Channel',
			dataIndex: 'isoCode',
			width: 100,
			align: 'center' as 'center',
			render: (isoCode: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{isoCode}
				</Typography.Text>
			),
		},
		{
			title: t('Label_NetWork'),
			key: 'NetWork',
			dataIndex: 'netWork',
			width: 100,
			align: 'center' as 'center',
			render: (netWork: string) => netWork ?? '-',
		},
		{
			title: t('Label_WalletAddress'),
			key: 'WalletAddress',
			dataIndex: 'usdtAddress',
			width: 100,
			align: 'center' as 'center',
			render: (usdtAddress: string) => usdtAddress ?? '-',
		},
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
					'-'
				),
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={cryptoLogList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default CryptoInfoTable

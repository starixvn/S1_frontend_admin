import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import moment from 'moment'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetEWalletInfoData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'

interface EWalletInfoTableProps {
	eWalletInfoLogList: IGetEWalletInfoData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	statusList: IEnumTypeData[]
}
const EWalletInfoTable = ({
	eWalletInfoLogList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	statusList,
}: EWalletInfoTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Type'),
			key: 'Type',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) =>
				statusList.map(item => item.value === status && item.name),
		},
		{
			title: t('Label_EWalletName'),
			key: 'EWalletName',
			dataIndex: 'eWalletName',
			width: 100,
			align: 'center' as 'center',
			render: (eWalletName: string) => eWalletName ?? '-',
		},
		{
			title: t('Label_AccountName'),
			key: 'AccountName',
			dataIndex: 'accountName',
			width: 100,
			align: 'center' as 'center',
			render: (accountName: string) => accountName ?? '-',
		},
		{
			title: t('Label_AccountNum'),
			key: 'AccountNum',
			dataIndex: 'accountNum',
			width: 100,
			align: 'center' as 'center',
			render: (accountNum: string) => accountNum ?? '-',
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
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_Updater'),
			key: 'Updater',
			dataIndex: 'updater',
			width: 100,
			align: 'center' as 'center',
			render: (updater: string) => updater ?? '-',
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={eWalletInfoLogList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default EWalletInfoTable

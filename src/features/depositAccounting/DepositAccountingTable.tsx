import { FC } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig, Typography } from 'antd'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { PermissionInterface } from 'type'
import { IDepositAccountsState } from './type'

interface IDepositAccountingTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	depositAccounts: IDepositAccountsState[]
	pagination: PaginationInterface
	editPermission?: PermissionInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onEditDepositAccountModal: (transId: string, currencyId: number) => void
}

const DepositAccountingTable: FC<IDepositAccountingTableProps> = ({
	loading,
	timeZoneUtcOffset,
	depositAccounts,
	pagination,
	editPermission,
	onTableChange,
	onEditDepositAccountModal,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => (
				<Typography.Link
					disabled={!editPermission?.canUse}
					onClick={() =>
						onEditDepositAccountModal(values.transId, values.currencyId)
					}
				>
					{t('Label_Edit')}
				</Typography.Link>
			),
		},
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DepositAmount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 120,
			align: 'center' as 'center',
			render: (amount: number) => numberFormatter.format(amount),
		},
		{
			title: t('Label_AccountNo'),
			key: 'accountNo',
			dataIndex: 'accountNo',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ApprovedTime'),
			key: 'approvedTime',
			dataIndex: 'approvedTime',
			width: 120,
			align: 'center' as 'center',
			render: (approvedTime: string) =>
				approvedTime
					? moment(approvedTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_LatestUpdateOperator'),
			key: 'latestUpdateOperator',
			dataIndex: 'latestUpdateOperator',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LatestUpdateTime'),
			key: 'latestUpdateTime',
			dataIndex: 'latestUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (approvedTime: string) =>
				approvedTime
					? moment(approvedTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={depositAccounts}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default DepositAccountingTable

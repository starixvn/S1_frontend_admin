import moment from 'moment'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { PaginationInterface } from 'common/hooks'
import {
	numFormatToDigits,
	timeFormat,
	numberFormatter,
} from 'common/utils/format'
import { SorterResult } from 'antd/es/table/interface'
import { TablePaginationConfig, Typography } from 'antd'
import {
	IMarketingDepositSignUpDetailData,
	IMarketingWithdrawalDetailData,
} from 'features/marketing/type'

interface IDepositSignUpDetailTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZone: number
	marketingWithdrawalDetailList: IMarketingWithdrawalDetailData[]
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IMarketingDepositSignUpDetailData>
	) => void
}

const { Text } = Typography

const WithdrawalDetailTable = ({
	loading,
	pagination,
	timeZone,
	marketingWithdrawalDetailList,
	onTableChange,
}: IDepositSignUpDetailTableProps) => {
	const { t } = useTranslation()

	const columns: ColumnsType<IMarketingWithdrawalDetailData> = [
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			sorter: true,
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			align: 'center' as 'center',
			sorter: true,
			render: (currencyName: string) => currencyName || '-',
		},
		{
			title: t('Label_RegisteredDate'),
			key: 'registeredDate',
			dataIndex: 'registeredDate',
			align: 'center' as 'center',
			sorter: true,
			render: (registeredDate: string) =>
				registeredDate ? (
					<Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(registeredDate).utcOffset(timeZone).format(timeFormat)}
					</Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_NumberOfWithdrawal'),
			key: 'withdrawalCount',
			dataIndex: 'withdrawalCount',
			align: 'center' as 'center',
			sorter: true,
			render: (withdrawalCount: number) =>
				numberFormatter.format(withdrawalCount),
		},
		{
			title: t('Label_TotalWithdrawalAmount'),
			key: 'withdrawalAmount',
			dataIndex: 'withdrawalAmount',
			align: 'center' as 'center',
			sorter: true,
			render: (withdrawalAmount: number) =>
				numFormatToDigits(withdrawalAmount || 0),
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={marketingWithdrawalDetailList}
			pagination={pagination as TablePaginationConfig}
			// @ts-ignore
			onChange={onTableChange}
		/>
	)
}

export default WithdrawalDetailTable

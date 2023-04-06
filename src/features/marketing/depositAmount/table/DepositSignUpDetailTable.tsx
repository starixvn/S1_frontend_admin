import moment from 'moment/moment'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { SorterResult } from 'antd/es/table/interface'
import { TablePaginationConfig, Table, Typography } from 'antd'
import { PaginationInterface } from 'common/hooks'
import {
	numFormatToDigits,
	timeFormat,
	numberFormatter,
} from 'common/utils/format'
import { IMarketingDepositSignUpDetailData } from 'features/marketing/type'

interface IDepositSignUpDetailTableProps {
	loading: boolean
	pagination: PaginationInterface
	timezone: number
	marketingDepositSignUpDetailList: IMarketingDepositSignUpDetailData[]
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IMarketingDepositSignUpDetailData>
	) => void
}

const { Text } = Typography

const DepositSignUpDetailTable = ({
	loading,
	pagination,
	timezone,
	marketingDepositSignUpDetailList,
	onTableChange,
}: IDepositSignUpDetailTableProps) => {
	const { t } = useTranslation()

	const columns: ColumnsType<IMarketingDepositSignUpDetailData> = [
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			sorter: true,
			width: 100,
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			align: 'center' as 'center',
			sorter: true,
			width: 100,
			render: (currencyName: string) => currencyName || '-',
		},
		{
			title: t('Label_RegisteredDate'),
			key: 'registeredDate',
			dataIndex: 'registeredDate',
			align: 'center' as 'center',
			sorter: true,
			width: 140,
			render: (registeredDate: string) =>
				registeredDate ? (
					<Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(registeredDate).utcOffset(timezone).format(timeFormat)}
					</Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_SignUpUrl'),
			key: 'signUpUrl',
			dataIndex: 'signUpUrl',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (signUpUrl: string) => signUpUrl || '-',
		},
		{
			title: t('Label_AFFCode'),
			key: 'affCode',
			dataIndex: 'affCode',
			align: 'center' as 'center',
			sorter: true,
			width: 80,
			render: (affCode: string) => affCode || '-',
		},
		{
			title: t('Label_FirstDepositAmount'),
			key: 'firstDepositAmount',
			dataIndex: 'firstDepositAmount',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (firstDepositAmount: number) =>
				firstDepositAmount ? numFormatToDigits(firstDepositAmount) : 0,
		},
		{
			title: t('Label_NumberOfDeposit'),
			key: 'depositCount',
			dataIndex: 'depositCount',
			align: 'center' as 'center',
			sorter: true,
			width: 100,
			render: (depositCount: number) =>
				depositCount ? numberFormatter.format(depositCount) : 0,
		},
		{
			title: t('Label_TotalDepositAmount'),
			key: 'totalDepositAmount',
			dataIndex: 'totalDepositAmount',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (totalDepositAmount: number) =>
				totalDepositAmount ? numFormatToDigits(totalDepositAmount) : 0,
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={marketingDepositSignUpDetailList}
			pagination={pagination as TablePaginationConfig}
			// @ts-ignore
			onChange={onTableChange}
		/>
	)
}

export default DepositSignUpDetailTable

import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { PaginationInterface } from 'common/hooks'
import { Table } from 'components'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import type { ColumnsType } from 'antd/es/table'
import { SorterResult } from 'antd/es/table/interface'
import { TablePaginationConfig, Typography } from 'antd'
import {
	IBonusAmountClaimedDetailReportData,
	IMarketingDepositSignUpDetailData,
} from 'features/marketing/type'

interface IBonusAmountClaimedDetailTableProps {
	loading: boolean
	pagination: PaginationInterface
	timezone: number
	marketingBonusAmountClaimedDetailList: IBonusAmountClaimedDetailReportData[]
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IMarketingDepositSignUpDetailData>
	) => void
}

const { Text } = Typography

const BonusAmountClaimedDetailTable = ({
	loading,
	pagination,
	timezone,
	marketingBonusAmountClaimedDetailList,
	onTableChange,
}: IBonusAmountClaimedDetailTableProps) => {
	const { t } = useTranslation()

	const columns: ColumnsType<IBonusAmountClaimedDetailReportData> = [
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (bonusCode: string) => bonusCode || '-',
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (currency: string) => currency || '-',
		},
		{
			title: t('Label_RegisteredDate'),
			key: 'registeredDate',
			dataIndex: 'registeredDate',
			align: 'center' as 'center',
			sorter: true,
			width: 160,
			render: (registeredDate: string) =>
				registeredDate ? (
					<Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(registeredDate).utcOffset(timezone).format(timeFormat)}
					</Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_SignUpUrl'),
			key: 'signupUrl',
			dataIndex: 'signupUrl',
			align: 'center' as 'center',
			sorter: true,
			width: 160,
			render: (signupUrl: string) => signupUrl || '-',
		},
		{
			title: t('Label_AFFCode'),
			key: 'affCode',
			dataIndex: 'affCode',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (affCode: number) => affCode ?? 0,
		},
		{
			title: t('Label_TotalDepositAmount'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			align: 'center' as 'center',
			sorter: true,
			width: 120,
			render: (totalDeposit: number) =>
				totalDeposit ? numFormatToDigits(totalDeposit) : 0,
		},
		{
			title: t('Label_TotalWithdrawalAmount'),
			key: 'totalWithdrawal',
			dataIndex: 'totalWithdrawal',
			align: 'center' as 'center',
			sorter: true,
			width: 160,
			render: (totalWithdrawal: number) =>
				totalWithdrawal ? numFormatToDigits(totalWithdrawal) : 0,
		},
		{
			title: t('Label_TotalBonusAmountClaimed'),
			key: 'bonusAmountClaim',
			dataIndex: 'bonusAmountClaim',
			align: 'center' as 'center',
			sorter: true,
			width: 160,
			render: (bonusAmountClaim: number) =>
				bonusAmountClaim ? numFormatToDigits(bonusAmountClaim) : 0,
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={marketingBonusAmountClaimedDetailList}
			pagination={pagination as TablePaginationConfig}
			// @ts-ignore
			onChange={onTableChange}
		/>
	)
}

export default BonusAmountClaimedDetailTable

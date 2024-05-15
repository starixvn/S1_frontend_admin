import dayjs from 'dayjs'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { SorterResult } from 'antd/es/table/interface'
import { TablePaginationConfig, Typography } from 'antd'
import { PaginationInterface } from 'common/hooks'
import {
	numberFormatter,
	numFormatToDigits,
	timeFormat,
} from 'common/utils/format'
import {
	IMarketingDepositSignUpDetailData,
	IMarketingNruBonusDetailReportData,
} from 'features/marketing/type'

interface INruBonusDetailTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	marketingNruBonusDetailReportList: IMarketingNruBonusDetailReportData[]
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IMarketingDepositSignUpDetailData>
	) => void
}

const { Text } = Typography

const NruBonusDetailTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	marketingNruBonusDetailReportList,
	onTableChange,
}: INruBonusDetailTableProps) => {
	const { t } = useTranslation()

	const columns: ColumnsType<IMarketingNruBonusDetailReportData> = [
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			align: 'center' as 'center',
			sorter: true,
			width: 140,
			render: (bonusCode: string) => bonusCode || '-',
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			sorter: true,
			width: 140,
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			align: 'center' as 'center',
			sorter: true,
			width: 100,
			render: (currency: string) => currency || '-',
		},
		{
			title: t('Label_RegisteredDate'),
			key: 'regTime',
			dataIndex: 'regTime',
			align: 'center' as 'center',
			sorter: true,
			width: 160,
			render: (regTime: string) =>
				regTime ? (
					<Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(regTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
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
			width: 100,
			render: (affCode: number) =>
				affCode ? numberFormatter.format(affCode) : 0,
		},
		{
			title: t('Label_Deposit'),
			key: 'isDeposit',
			dataIndex: 'isDeposit',
			align: 'center' as 'center',
			sorter: true,
			width: 100,
			render: (isDeposit: boolean) =>
				isDeposit ? <Text>True</Text> : <Text>False</Text>,
		},
		{
			title: t('Label_FirstDepositAmount'),
			key: 'firstDeposit',
			dataIndex: 'firstDeposit',
			align: 'center' as 'center',
			sorter: true,
			width: 100,
			render: (firstDeposit: number) =>
				firstDeposit ? numFormatToDigits(firstDeposit) : 0,
		},
		{
			title: t('Label_TotalDepositAmount'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			align: 'center' as 'center',
			sorter: true,
			width: 100,
			render: (totalDeposit: number) =>
				totalDeposit ? numFormatToDigits(totalDeposit) : 0,
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={marketingNruBonusDetailReportList}
			pagination={pagination as TablePaginationConfig}
			// @ts-ignore
			onChange={onTableChange}
		/>
	)
}

export default NruBonusDetailTable

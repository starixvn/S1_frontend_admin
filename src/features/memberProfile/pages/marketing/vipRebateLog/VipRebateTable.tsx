import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { IGetVipRebateLogData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import moment from 'moment'
import { numberFormatter, timeFormat } from 'common/utils/format'

interface IVipRebateTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	vipRebateLog: IGetVipRebateLogData[]
}

const VipRebateTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
	vipRebateLog,
}: IVipRebateTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Time'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Category'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_RedeemAmount'),
			key: 'rcRedeemAmount',
			dataIndex: 'rcRedeemAmount',
			width: 100,
			align: 'center' as 'center',
			render: (rcRedeemAmount: number) =>
				rcRedeemAmount ? numberFormatter.format(rcRedeemAmount) : '-',
		},
		{
			title: t('Label_RefId'),
			key: 'refId',
			dataIndex: 'refId',
			width: 100,
			align: 'center' as 'center',
		},
	]

	return (
		<Table
			loading={loading}
			pagination={pagination as TablePaginationConfig}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={vipRebateLog ?? []}
			onChange={onTableChange}
			columns={columns}
		/>
	)
}

export { VipRebateTable }

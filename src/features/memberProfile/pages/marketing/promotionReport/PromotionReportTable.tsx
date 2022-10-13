import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { IGetPromotionReportData } from 'features/memberProfile/type'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { timeFormat } from 'common/utils/format'

interface IPromotionReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	promotionReport: IGetPromotionReportData[]
}

const PromotionReportTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
	promotionReport,
}: IPromotionReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_BonusId'),
			key: 'bonusId',
			dataIndex: 'bonusId',
			width: 100,
			align: 'center' as 'center',
			render: (bonusId: number) => bonusId ?? '-',
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
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
		{
			title: t('Label_DepositId'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 100,
			align: 'center' as 'center',
			render: (bonusCode: string) => (!isEmpty(bonusCode) ? bonusCode : '-'),
		},
		{
			title: t('Label_ClaimDate'),
			key: 'claimDate',
			dataIndex: 'claimDate',
			width: 120,
			align: 'center' as 'center',
			render: (claimDate: string) =>
				claimDate ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(claimDate).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]

	return (
		<Table
			loading={loading}
			pagination={pagination as TablePaginationConfig}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			onChange={onTableChange}
			dataSource={promotionReport ?? []}
			columns={columns}
		/>
	)
}

export { PromotionReportTable }

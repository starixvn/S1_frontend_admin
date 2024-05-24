import dayjs from 'dayjs'
import { Table } from 'components'
import { isJSON } from 'common/utils'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { TablePaginationConfig, Typography } from 'antd'
import { IFailRecordReportData } from 'features/failBet/type'

interface FailBetTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	failRecordReportList: IFailRecordReportData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	onChangeInfoModal: (info: string) => void
}

const FailBetTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	failRecordReportList,
	onTableChange,
	onChangeInfoModal,
}: FailBetTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			align: 'center' as 'center',
			render: (currencyName: string) => currencyName || '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_TransTime'),
			key: 'transTime',
			dataIndex: 'transTime',
			align: 'center' as 'center',
			render: (transTime: string) =>
				transTime
					? dayjs(transTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Vender'),
			key: 'tpName',
			dataIndex: 'tpName',
			align: 'center' as 'center',
			render: (tpName: string) => tpName || '-',
		},
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
			align: 'center' as 'center',
			render: (transId: string) => transId || '-',
		},
		{
			title: t('Label_Info'),
			key: 'info',
			render: ({ info }: IFailRecordReportData) => {
				return isJSON(info) ? (
					<Typography.Link onClick={() => onChangeInfoModal(info)}>
						{t('Label_Detail')}
					</Typography.Link>
				) : (
					'-'
				)
			},
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={failRecordReportList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default FailBetTable

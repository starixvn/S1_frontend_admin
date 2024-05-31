import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { timeFormat } from 'common/utils/format'
import dayjs from 'dayjs'
import { PaginationInterface } from 'common/hooks'
import { IGetMemberReportData } from './type'

interface ICupEventMemberReportProps {
	loading: boolean
	cupEventMemberReportData: IGetMemberReportData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
}

const CupEventMemberReportTable: FC<ICupEventMemberReportProps> = ({
	loading,
	timeZoneUtcOffset,
	cupEventMemberReportData,
	pagination,
	onTableChange,
}) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TicketType'),
			key: 'ticketType',
			dataIndex: 'ticketType',
			width: 80,
			align: 'center' as 'center',
			render: (ticketType: number) => t('Label_Ticket', { key: ticketType }),
		},
		{
			title: t('Label_Team'),
			key: 'teamName',
			dataIndex: 'teamName',
			width: 80,
			align: 'center' as 'center',
			render: (teamName: string) => teamName || 'N/A',
		},
		{
			title: t('Label_Select') + t('Label_Time'),
			key: 'selectTime',
			dataIndex: 'selectTime',
			width: 100,
			align: 'center' as 'center',
			render: (selectTime: string) =>
				selectTime
					? dayjs(selectTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={cupEventMemberReportData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}
export { CupEventMemberReportTable }

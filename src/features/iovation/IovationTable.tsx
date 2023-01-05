import moment from 'moment/moment'
import { Table } from 'components'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { TablePaginationConfig } from 'antd'
import { IIovationReportData } from 'features/iovation/type'

interface IovationTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	IovationReportList: IIovationReportData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const IovationTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	IovationReportList,
	onTableChange,
}: IovationTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_LastUsedTime'),
			key: 'lastUsedTime',
			dataIndex: 'lastUsedTime',
			align: 'center' as 'center',
			width: '20%',
			render: (lastUsedTime: string) =>
				lastUsedTime
					? moment(lastUsedTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			width: '10%',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_DeviceId'),
			key: 'deviceId',
			dataIndex: 'deviceId',
			align: 'center' as 'center',
			width: '20%',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Allow'),
			key: 'allow',
			dataIndex: 'allow',
			align: 'center' as 'center',
			width: '10%',
			render: (allow: string) => allow || '-',
		},
		{
			title: t('Label_DeviceType'),
			key: 'deviceType',
			dataIndex: 'deviceType',
			align: 'center' as 'center',
			width: '10%',
			render: (deviceType: string) => deviceType || '-',
		},
		{
			title: t('Label_Score'),
			key: 'score',
			dataIndex: 'score',
			align: 'center' as 'center',
			width: '10%',
			render: (score: number) => score ?? 'N/A',
		},
		{
			title: t('Label_Frequency'),
			key: 'frequency',
			dataIndex: 'frequency',
			align: 'center' as 'center',
			width: '10%',
			render: (frequency: number) => frequency ?? 'N/A',
		},
		{
			title: t('Label_AssociateAccount'),
			key: 'associateAccount',
			dataIndex: 'associateAccount',
			width: '10%',
			align: 'center' as 'center',
			render: (associateAccount: number) => associateAccount ?? 'N/A',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={IovationReportList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default IovationTable

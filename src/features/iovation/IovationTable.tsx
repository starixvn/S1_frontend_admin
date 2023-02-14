import moment from 'moment/moment'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { isPositiveNum } from 'common/utils'
import { PaginationInterface } from 'common/hooks'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { TablePaginationConfig, Typography } from 'antd'
import { IIovationReportData } from 'features/iovation/type'

interface IovationTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	IovationReportList: IIovationReportData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	onUserClick: (deviceId: string) => void
}

const IovationTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	IovationReportList,
	onTableChange,
	onUserClick,
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
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			align: 'center' as 'center',
			width: '10%',
			render: (isoCode: string) => isoCode || '-',
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
			render: (score: number) =>
				isPositiveNum(score) ? (
					numberFormatter.format(score)
				) : (
					<Typography.Text type='danger'>
						{numberFormatter.format(score)}
					</Typography.Text>
				),
		},
		{
			title: t('Label_Frequency'),
			key: 'frequency',
			dataIndex: 'frequency',
			align: 'center' as 'center',
			width: '5%',
			render: (frequency: number) => frequency ?? 'N/A',
		},
		{
			title: t('Label_AssociateAccount'),
			key: 'associateCount',
			width: '5%',
			align: 'center' as 'center',
			render: (record: IIovationReportData) => {
				const { deviceId, associateCount } = record
				return (
					<Typography.Link onClick={() => onUserClick(deviceId)}>
						{associateCount}
					</Typography.Link>
				)
			},
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

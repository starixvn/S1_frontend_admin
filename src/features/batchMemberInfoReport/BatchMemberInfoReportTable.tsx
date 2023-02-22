import moment from 'moment'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Typography, Tag, Button } from 'antd'
import { Table } from 'components'
import { timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { IBatchMemberInfoReportData } from 'features/batchMemberInfoReport/type'
import {
	BATCH_MEMBER_INFO_DOWNLOAD_STATUS,
	BATCH_MEMBER_INFO_REPORT_STATUS_TAGS_COLOR,
} from 'features/batchMemberInfoReport/constants'

interface IBatchMemberInfoReportTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	batchMemberInfoReportList: IBatchMemberInfoReportData[]
}

const BatchMemberInfoReportTable = ({
	loading,
	timeZoneUtcOffset,
	batchMemberInfoReportList,
}: IBatchMemberInfoReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_BatchId'),
			key: 'batchId',
			dataIndex: 'batchId',
			width: '10%',
			align: 'center' as 'center',
			render: (batchId: number) => batchId ?? 'N/A',
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: '10%',
			align: 'center' as 'center',
			render: (memo: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{memo || '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_UploadTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: '40%',
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{updateTime
						? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Operator'),
			key: 'author',
			dataIndex: 'author',
			width: '10%',
			align: 'center' as 'center',
			render: (author: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{author || '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Status'),
			key: 'statusName',
			dataIndex: 'statusName',
			width: '10%',
			align: 'center' as 'center',
			render: (statusName: string) => {
				const color = BATCH_MEMBER_INFO_REPORT_STATUS_TAGS_COLOR[statusName]
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						<Tag color={color}>{statusName || '-'}</Tag>
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_DownloadStatus'),
			key: 'status',
			width: '20%',
			align: 'center' as 'center',
			render: (records: IBatchMemberInfoReportData) => {
				const { status, url } = records
				const downloadStatus = find(
					BATCH_MEMBER_INFO_DOWNLOAD_STATUS,
					downloadName => downloadName.value === status
				)
				const { displayName } = downloadStatus!
				return status === 1 ? (
					<Button type='primary' shape='round' target='_blank' href={url}>
						{t(displayName) ?? 'N/A'}
					</Button>
				) : (
					<Typography.Text>{t(displayName)}</Typography.Text>
				)
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				pagination={false}
				dataSource={batchMemberInfoReportList}
				columns={columns}
			/>
		</LayoutContent.Card>
	)
}

export default BatchMemberInfoReportTable

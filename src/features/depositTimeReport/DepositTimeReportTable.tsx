import moment from 'moment'
import { TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { IDepositTimeReportData } from 'features/depositTimeReport/type'

interface IDepositTimeReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	depositTimeReport: IDepositTimeReportData[]
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const DepositTimeReportTable = ({
	loading,
	pagination,
	depositTimeReport,
	timeZoneUtcOffset,
	onTableChange,
}: IDepositTimeReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_DepositId'),
			key: 'depositId',
			dataIndex: 'depositId',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DepositType'),
			key: 'depositTypeName',
			dataIndex: 'depositTypeName',
			width: 60,
			align: 'center' as 'center',
			render: (typeName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{typeName}
				</Typography.Text>
			),
		},
		{
			title: t('Label_MemberId'),
			key: 'memberId',
			width: 60,
			align: 'center' as 'center',
			render: (record: IDepositTimeReportData) => {
				const { userName, custId } = record
				return (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'statusName',
			dataIndex: 'statusName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) => (
				<div style={{ width: '180px' }}>
					{createTime ? (
						<Typography.Text>
							{moment(createTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<div style={{ width: '180px' }}>
					{updateTime ? (
						<Typography.Text>
							{moment(updateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_FlowEndTime'),
			key: 'approvedTime',
			dataIndex: 'approvedTime',
			align: 'center' as 'center',
			render: (approvedTime: string) => (
				<div style={{ width: '180px' }}>
					{approvedTime ? (
						<Typography.Text>
							{moment(approvedTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_StatementTime'),
			key: 'statementTime',
			dataIndex: 'statementTime',
			align: 'center' as 'center',
			render: (statementTime: string) => (
				<div style={{ width: '180px' }}>
					{statementTime ? (
						<Typography.Text>
							{moment(statementTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_ApprovedTime'),
			key: 'approvedTime',
			dataIndex: 'approvedTime',
			align: 'center' as 'center',
			render: (toApprovedTime: string) => (
				<div style={{ width: '180px' }}>
					{toApprovedTime ? (
						<Typography.Text>
							{moment(toApprovedTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_ApprovedBy'),
			key: 'approvedBy',
			dataIndex: 'approvedBy',
			align: 'center' as 'center',
		},
		{
			title: t('Label_CompletedTime'),
			key: 'completeTime',
			dataIndex: 'completeTime',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={depositTimeReport ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { DepositTimeReportTable }

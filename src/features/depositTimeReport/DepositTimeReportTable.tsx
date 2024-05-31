import dayjs from 'dayjs'
import {
	Tag,
	Badge,
	Space,
	Popover,
	Typography,
	TablePaginationConfig,
} from 'antd'
import { useTranslation } from 'react-i18next'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { DEPOSIT_STATUS_TAGS_COLOR } from 'features/depositOperator/constants'
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

	const messageColumns = [
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) =>
				dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat),
		},
		{
			title: t('Label_Message'),
			dataIndex: 'message',
			align: 'center' as 'center',
			key: 'message',
		},
	]

	const columns = [
		{
			title: t('Label_DepositId'),
			key: 'transId',
			dataIndex: 'transId',
			width: 60,
			align: 'center' as 'center',
			render: (transId: string) => (
				<Typography.Link
					href={`/${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.depositOperator.root}/${transId}`}
				>
					{transId}
				</Typography.Link>
			),
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
			key: 'status',
			width: 60,
			align: 'center' as 'center',
			render: ({
				status,
				statusName,
				depositMessageList,
			}: IDepositTimeReportData) => {
				const color = DEPOSIT_STATUS_TAGS_COLOR[status]

				// sort message by createTime (old to new)
				const sortedDepositMessageList =
					depositMessageList.length > 1
						? depositMessageList
								.slice()
								.sort((a, b) => dayjs(a.createTime).diff(dayjs(b.createTime)))
						: depositMessageList

				return (
					<Space size={1}>
						<Tag color={color}>{statusName ?? 'N/A'}</Tag>
						{depositMessageList && depositMessageList.length > 0 && (
							<Popover
								content={
									<Table
										dataSource={sortedDepositMessageList}
										columns={messageColumns}
										pagination={false}
									/>
								}
								title={false}
								trigger='hover'
								overlayStyle={{ width: '30vw' }}
							>
								<Badge
									count={depositMessageList.length}
									style={{ backgroundColor: '#faad14' }}
								/>
							</Popover>
						)}
					</Space>
				)
			},
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
							{dayjs(createTime)
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
							{dayjs(updateTime)
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
							{dayjs(approvedTime)
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
							{dayjs(statementTime)
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
							{dayjs(toApprovedTime)
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

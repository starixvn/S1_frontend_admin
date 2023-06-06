import moment from 'moment'
import { useTranslation } from 'react-i18next'
import {
	Tag,
	Badge,
	Space,
	Popover,
	Typography,
	TablePaginationConfig,
} from 'antd'
import { Table } from 'components'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { LayoutContent } from 'app/pages/layout'
import paths from 'app/constants/paths'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { IWithdrawalTimeReportData } from 'features/withdrawalTimeReport/type'
import { WITHDRAWAL_STATUS_TAGS_COLOR } from 'features/withdrawalOperator/constants'

interface IWithdrawalTimeReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	withdrawalTimeReport: IWithdrawalTimeReportData[]
	handleTableChange: (newPagination: TablePaginationConfig) => void
}

const WithdrawalTimeReportTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	withdrawalTimeReport,
	handleTableChange,
}: IWithdrawalTimeReportTableProps) => {
	const { t } = useTranslation()

	const messageColumns = [
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) =>
				moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat),
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
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TrxnID'),
			key: 'transId',
			dataIndex: 'transId',
			width: 60,
			align: 'center' as 'center',
			render: (transId: string) => (
				<Typography.Link
					href={`/${NEW_SITE_PREFIX_URL}/${paths.finance.sub.depositWithdrawalSector.sub.withdrawalOperator.root}/${transId}`}
				>
					{transId}
				</Typography.Link>
			),
		},
		{
			title: t('Label_WithdrawalType'),
			key: 'withdrawalTypeName',
			dataIndex: 'withdrawalTypeName',
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
			render: (record: IWithdrawalTimeReportData) => {
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
			title: t('Label_Status'),
			key: 'status',
			width: 60,
			align: 'center' as 'center',
			render: ({
				status,
				statusName,
				withdrawalMessageList,
			}: IWithdrawalTimeReportData) => {
				const color = WITHDRAWAL_STATUS_TAGS_COLOR[status]

				// sort message by createTime (old to new)
				const sortedWithdrawalMessageList =
					withdrawalMessageList.length > 1
						? withdrawalMessageList
								.slice()
								.sort((a, b) => moment(a.createTime).diff(moment(b.createTime)))
						: withdrawalMessageList

				return (
					<Space size={1}>
						<Tag color={color}>{statusName ?? 'N/A'}</Tag>
						{withdrawalMessageList && withdrawalMessageList.length > 0 && (
							<Popover
								content={
									<Table
										dataSource={sortedWithdrawalMessageList}
										columns={messageColumns}
										pagination={false}
									/>
								}
								title={false}
								trigger='hover'
								overlayStyle={{ width: '30vw' }}
							>
								<Badge
									count={withdrawalMessageList.length}
									style={{ backgroundColor: '#faad14' }}
								/>
							</Popover>
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
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
			key: 'flowEndTime',
			dataIndex: 'flowEndTime',
			align: 'center' as 'center',
			render: (flowEndTime: string) => (
				<div style={{ width: '180px' }}>
					{flowEndTime ? (
						<Typography.Text>
							{moment(flowEndTime)
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
			title: t('Label_ToVerifyTime'),
			key: 'toVerifyTime',
			dataIndex: 'toVerifyTime',
			align: 'center' as 'center',
		},
		{
			title: t('Label_ToApprovedTime'),
			key: 'toApprovedTime',
			dataIndex: 'toApprovedTime',
			align: 'center' as 'center',
		},
		{
			title: t('Label_CompletedTime'),
			key: 'completeTime',
			dataIndex: 'completeTime',
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				columns={columns}
				loading={loading}
				dataSource={withdrawalTimeReport ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={handleTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { WithdrawalTimeReportTable }

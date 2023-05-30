import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	Tag,
	Badge,
	Space,
	Popover,
	Typography,
	TablePaginationConfig,
} from 'antd'
import {
	Table,
	useVisibilityColumnsButtonHook,
	VisibilityColumnsButton,
} from 'components'
import { PaginationInterface } from 'common/hooks'
import { IGetWithdrawalData } from 'features/withdrawalOperator/type'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { isJSON } from 'common/utils'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment/moment'
import {
	AccountTypeEnum,
	WITHDRAWAL_STATUS_TAGS_COLOR,
	WithdrawalStatusEnum,
} from 'features/withdrawalOperator/constants'
import { Link } from 'react-router-dom'
import { VIP_LEVELS_COLOR } from 'features/depositOperator/constants'

interface IWithdrawalOperatorTableProps {
	isAllSite: boolean
	loading: boolean
	withdrawalList: IGetWithdrawalData[]
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
}
const WithdrawalOperatorTable = ({
	isAllSite,
	loading,
	withdrawalList,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
}: IWithdrawalOperatorTableProps) => {
	const { t } = useTranslation()
	const { onChangeVisibilityColumns, onGetVisibilityColumns } =
		useVisibilityColumnsButtonHook()

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

	const baseColumns = [
		{
			title: t('Label_TrxnID'),
			key: 'transId',
			dataIndex: 'transId',
			width: 100,
			align: 'center' as 'center',
			render: (transId: string) => (
				<Link to={isAllSite ? `${transId}?isAllSite=${isAllSite}` : transId}>
					{transId}
				</Link>
			),
		},
		{
			title: t('Label_SiteName'),
			dataIndex: 'siteName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 100,
			align: 'center' as 'center',
			render: (operator: string, record: IGetWithdrawalData) => {
				const { onUser } = record
				if (onUser) {
					return onUser
				}
				return operator ?? '-'
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetWithdrawalData) => {
				const { status, statusName, withdrawalMessageList } = record

				// sort message by createTime (old to new)
				const sortedWithdrawalMessageList =
					withdrawalMessageList.length > 1
						? withdrawalMessageList
								.slice()
								.sort((a, b) => moment(a.createTime).diff(moment(b.createTime)))
						: withdrawalMessageList

				return (
					<Space size={1}>
						<Tag
							style={{ whiteSpace: 'nowrap' }}
							color={WITHDRAWAL_STATUS_TAGS_COLOR[status]}
						>
							{statusName}
						</Tag>
						{withdrawalMessageList.length > 0 && (
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
			title: t('Label_WithdrawalType'),
			key: 'withdrawalType',
			dataIndex: 'withdrawalTypeName',
			width: 100,
			align: 'center' as 'center',
			render: (withdrawalTypeName: string) => withdrawalTypeName ?? '-',
		},
		{
			title: t('Label_CalCode'),
			key: 'calCode',
			dataIndex: 'calCode',
			width: 100,
			align: 'center' as 'center',
			render: (calCode: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{calCode ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_DeviceScore'),
			key: 'deviceScore',
			dataIndex: 'deviceScore',
			width: 100,
			align: 'center' as 'center',
			render: (deviceScore: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{deviceScore ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Kyc'),
			key: 'isKyc',
			dataIndex: 'isKyc',
			width: 100,
			align: 'center' as 'center',
			render: (isKyc: number) => (isKyc ? t('Label_Yes') : t('Label_No')),
		},
		{
			title: t('Label_Risk'),
			key: 'isRisk',
			dataIndex: 'isRisk',
			width: 100,
			align: 'center' as 'center',
			render: (isRisk: number) => (isRisk ? t('Label_Yes') : t('Label_No')),
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetWithdrawalData) => {
				const { custId, userName } = record

				return isAllSite ? (
					<Typography.Text>{userName}</Typography.Text>
				) : (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}?`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevelName',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetWithdrawalData) => {
				const { vipLevel, vipLevelName } = record
				return (
					<Tag
						style={{ whiteSpace: 'nowrap' }}
						color={VIP_LEVELS_COLOR[vipLevel]}
					>
						{vipLevelName}
					</Tag>
				)
			},
		},
		{
			title: t('Label_NetWork'),
			key: 'network',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetWithdrawalData) => {
				const { channelName, accountType } = record
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{accountType === AccountTypeEnum.Crypto ? channelName || '-' : '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_CryptoAmount'),
			key: 'cryptoAmount',
			dataIndex: 'withdrawalInfo',
			width: 100,
			align: 'right' as 'right',
			render: (withdrawalInfo: string, record: IGetWithdrawalData) => {
				const { status } = record
				const isApproved = status === WithdrawalStatusEnum.Approved
				if (!isJSON(withdrawalInfo)) return ''
				const info = JSON.parse(withdrawalInfo)
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{isApproved
							? info?.ExchangeAmount ?? ''
							: info?.TempExchangeAmount ?? ''}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'isoCode',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 100,
			align: 'right' as 'right',
			render: (amount: number) => numberFormatter.format(amount) ?? '-',
		},
		{
			title: t('Label_BankName'),
			key: 'bankName',
			dataIndex: 'bankName',
			width: 100,
			align: 'center' as 'center',
			render: (bankName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{bankName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 100,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_FlowEndTime'),
			key: 'flowEndTime',
			dataIndex: 'flowEndTime',
			width: 100,
			align: 'center' as 'center',
			render: (flowEndTime: string) =>
				flowEndTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(flowEndTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_WithdrawalCount'),
			key: 'withdrawalCount',
			dataIndex: 'withdrawlCnt',
			width: 80,
			align: 'center' as 'center',
			render: (withdrawlCnt: number) =>
				numberFormatter.format(withdrawlCnt) ?? '-',
		},
	]

	const columns = onGetVisibilityColumns(baseColumns)

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				dataSource={withdrawalList ?? []}
				rowClassName={record => (record.onUser ? 'gray-background' : '')}
				columns={columns}
				// eslint-disable-next-line react/no-unstable-nested-components
				title={() => (
					<Space align='end' direction='vertical' style={{ width: '100%' }}>
						<VisibilityColumnsButton
							baseColumns={baseColumns}
							onTableVisibilityColumnsChange={onChangeVisibilityColumns}
							memoried
						/>
					</Space>
				)}
			/>
		</LayoutContent.Card>
	)
}

export { WithdrawalOperatorTable }

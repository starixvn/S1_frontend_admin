import moment from 'moment'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { Key } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import {
	numberFormatter,
	timeFormat,
	jsonToObject,
	numFormatToDigits,
} from 'common/utils/format'
import { IDepositOperatorData } from 'features/depositOperator/type'
import {
	DEPOSIT_STATUS_TAGS_COLOR,
	VIP_LEVELS_COLOR,
} from 'features/depositOperator/constants'

interface IDepositOperatorTableProps {
	isAllSite: boolean
	loading: boolean
	timeZoneUtcOffset: number
	depositOperatorList: IDepositOperatorData[]
	pagination: PaginationInterface
	rowSelection: {
		selectedRowKeys: Key[]
		onChange: (newSelectedRowKeys: Key[]) => void
	}
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const DepositOperatorTable = ({
	isAllSite,
	loading,
	timeZoneUtcOffset,
	depositOperatorList,
	pagination,
	rowSelection,
	onTableChange,
}: IDepositOperatorTableProps) => {
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
			title: t('Label_TransId'),
			key: 'transId',
			width: 60,
			align: 'center' as 'center',
			render: ({ transId }: IDepositOperatorData) => (
				<Link to={isAllSite ? `${transId}?isAllSite=${isAllSite}` : transId}>
					{transId}
				</Link>
			),
		},
		{
			title: t('Label_SiteName'),
			key: 'siteName',
			dataIndex: 'siteName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
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
			}: IDepositOperatorData) => {
				const color = DEPOSIT_STATUS_TAGS_COLOR[status]

				// sort message by createTime (old to new)
				const sortedDepositMessageList =
					depositMessageList.length > 1
						? depositMessageList
								.slice()
								.sort((a, b) => moment(a.createTime).diff(moment(b.createTime)))
						: depositMessageList

				return (
					<Space size={1}>
						<Tag color={color}>{statusName ?? 'N/A'}</Tag>
						{depositMessageList.length > 0 && (
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
			title: t('Label_DepositType'),
			key: 'depositType',
			width: 60,
			align: 'center' as 'center',
			render: ({ depositTypeName }: IDepositOperatorData) =>
				depositTypeName ?? 'N/A',
		},
		{
			title: t('Label_isKyc'),
			key: 'isKyc',
			dataIndex: 'isKyc',
			align: 'center' as 'center',
			render: (isKyc: string) => (
				<div style={{ minWidth: 48 }}>
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{isKyc ? t('Label_Yes') : t('Label_No')}
					</Typography.Text>
				</div>
			),
		},
		{
			title: t('Label_isRisk'),
			key: 'isRisk',
			dataIndex: 'isRisk',
			width: 60,
			align: 'center' as 'center',
			render: (isRisk: string) => (
				<div style={{ minWidth: 48 }}>
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{isRisk ? t('Label_Yes') : t('Label_No')}
					</Typography.Text>
				</div>
			),
		},
		{
			title: t('Label_CheckBy'),
			key: 'checkBy',
			dataIndex: 'checkReceiptBy',
			width: 80,
			align: 'center' as 'center',
			render: (checkReceiptBy: string | null) => checkReceiptBy ?? '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'custId',
			width: 120,
			align: 'center' as 'center',
			render: ({ custId, userName }: IDepositOperatorData) =>
				isAllSite ? (
					<Typography.Text>{userName}</Typography.Text>
				) : (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				),
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevel',
			width: 120,
			align: 'center' as 'center',
			render: ({ vipLevel, vipLevelName }: IDepositOperatorData) => (
				<Tag color={VIP_LEVELS_COLOR[vipLevel]}>{vipLevelName}</Tag>
			),
		},
		{
			title: t('Label_NetWork'),
			key: 'netWork',

			width: 60,
			align: 'center' as 'center',
			render: ({ network }: IDepositOperatorData) => {
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{network || '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_CryptoAmount'),
			key: 'cryptoAmount',
			align: 'right' as 'right',
			render: ({ status, depositInfo }: IDepositOperatorData) => {
				const { exchangeAmount, actualExchangeAmount } =
					jsonToObject(depositInfo) ?? {}
				// * approved 時使用 ActualExchangeAmount，其餘皆用 exchangeAmount
				const amount = status === 3 ? actualExchangeAmount : exchangeAmount

				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{/* crypto amount 的小數點不用省略，並且一般情況下不會超過十位 */}
						{amount && numFormatToDigits(Number(amount), 10)}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'isoCode',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 60,
			align: 'right' as 'right',
			render: (amount: number) => numberFormatter.format(amount),
		},
		{
			title: t('Label_ActualDeposit'),
			key: 'actualDeposit',
			dataIndex: 'actualDeposit',
			width: 60,
			align: 'right' as 'right',
			render: (actualDeposit: number) => numberFormatter.format(actualDeposit),
		},
		{
			title: t('Label_BankName'),
			key: 'bankName',
			dataIndex: 'bankName',
			width: 60,
			align: 'center' as 'center',
			render: (bankName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{bankName}
				</Typography.Text>
			),
		},
		{
			title: t('Label_CalCode'),
			key: 'calCode',
			dataIndex: 'calCode',
			width: 60,
			align: 'center' as 'center',
			render: (calCode: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{calCode}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Channel'),
			key: 'channel',
			dataIndex: 'channelName',
			width: 60,
			align: 'center' as 'center',
			render: (channelName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{channelName}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Receipt'),
			key: 'receipt',
			dataIndex: 'receipt',
			width: 60,
			align: 'center' as 'center',
			render: (receipt: boolean) => (receipt ? t('Label_Yes') : t('Label_No')),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (createTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{createTime
						? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_FlowEndTime'),
			key: 'flowEndTime',
			dataIndex: 'flowEndTime',
			width: 120,
			align: 'center' as 'center',
			render: (flowEndTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{flowEndTime
						? moment(flowEndTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{updateTime
						? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_StatementTime'),
			key: 'statementTime',
			dataIndex: 'statementTime',
			width: 120,
			align: 'center' as 'center',
			render: (statementTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{statementTime
						? moment(statementTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_DepositCount'),
			key: 'depositCount',
			dataIndex: 'depositCnt',
			width: 60,
			align: 'center' as 'center',
			render: (depositCnt: number) => numberFormatter.format(depositCnt),
		},
	]

	const columns = onGetVisibilityColumns(baseColumns as any)

	// * for selection and operation of table
	const dataSource = depositOperatorList.map(item => ({
		...item,
		key: item?.transId,
	}))

	return (
		<LayoutContent.Card>
			<Table
				bordered
				loading={loading}
				columns={columns}
				dataSource={dataSource}
				onChange={onTableChange}
				rowSelection={{ ...rowSelection }}
				pagination={pagination as TablePaginationConfig}
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

export default DepositOperatorTable

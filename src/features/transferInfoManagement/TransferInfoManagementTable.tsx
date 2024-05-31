import { LayoutContent } from 'app/pages/layout'
import { find } from 'lodash'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	IGetBankTransferData,
	IGetReasonListData,
	IGetTransferTypeListData,
} from 'features/transferInfoManagement/type'
import { PermissionInterface } from 'type'
import dayjs from 'dayjs'
import {
	numberFormatter,
	numFormatToDigits,
	timeFormat,
} from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'
import { useNavigate } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'

interface ITransferInfoManagementTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	bankTransferList: IGetBankTransferData[]
	editPermission?: PermissionInterface
	transferTypeList: IGetTransferTypeListData[]
	transferChannelList: IEnumTypeData[]
	timeZoneUtcOffset: number
	reasonList: IGetReasonListData[]
	onDelete: (transferId: string) => void
}
const TransferInfoManagementTable = ({
	loading,
	pagination,
	onTableChange,
	bankTransferList,
	editPermission,
	transferTypeList,
	timeZoneUtcOffset,
	transferChannelList,
	reasonList,
	onDelete,
}: ITransferInfoManagementTableProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const columns = [
		{
			title: '',
			children: [
				{
					title: t('Label_Action'),
					width: 140,
					align: 'center' as 'center',
					render: (record: IGetBankTransferData) => {
						const { transferId } = record
						return (
							<Space style={{ padding: '5px' }}>
								<Typography.Link
									disabled={!editPermission?.canUse}
									onClick={() =>
										navigate(
											`/${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.transferInfoManagement.root}/${transferId}`
										)
									}
								>
									{t('Label_Edit')}
								</Typography.Link>
								<Popconfirm
									disabled={!editPermission?.canUse}
									title={t('Label_SureToDelete')}
									onConfirm={() => onDelete(transferId)}
								>
									<Typography.Link disabled={!editPermission?.canUse}>
										{t('Label_Delete')}
									</Typography.Link>
								</Popconfirm>
							</Space>
						)
					},
				},
				{
					title: t('Label_TransferId'),
					key: 'transferId',
					dataIndex: 'transferId',
					align: 'center' as 'center',
					render: (transferId: string) => (
						<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
							{transferId ?? '-'}
						</Typography.Text>
					),
				},
				{
					title: t('Label_TransferType'),
					key: 'transferType',
					dataIndex: 'transferType',
					align: 'center' as 'center',
					render: (transferType: number) => {
						const typeName = find(
							transferTypeList,
							type => type.value === transferType
						)?.name
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{typeName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_TransDate'),
					key: 'transDate',
					dataIndex: 'transDate',
					width: 120,
					align: 'center' as 'center',
					render: (transDate: string) =>
						transDate ? (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{dayjs(transDate)
									.utcOffset(timeZoneUtcOffset)
									.format(timeFormat)}
							</Typography.Text>
						) : (
							''
						),
				},
			],
		},
		{
			title: t('Label_From'),
			children: [
				{
					title: t('Label_Channel'),
					key: 'fromChannel',
					dataIndex: 'fromChannel',
					align: 'center' as 'center',
					render: (fromChannel: number) => {
						const channelName = find(
							transferChannelList,
							channel => channel.value === fromChannel
						)?.name
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{channelName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Agent'),
					key: 'fromAgent',
					dataIndex: 'fromAgent',
					align: 'center' as 'center',
					render: (fromAgent: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromAgent ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Pay'),
					key: 'fromPayName',
					dataIndex: 'fromPayName',
					align: 'center' as 'center',
					render: (fromPayId: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromPayId ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_MemberId'),
					key: 'fromUserName',
					dataIndex: 'fromUserName',
					align: 'center' as 'center',
					render: (fromUserName: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromUserName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Currency'),
					key: 'fromIsoCode',
					dataIndex: 'fromIsoCode',
					align: 'center' as 'center',
					render: (fromIsoCode: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromIsoCode ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Bank'),
					key: 'fromBankCode',
					dataIndex: 'fromBankCode',
					align: 'center' as 'center',
					render: (fromBankCode: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromBankCode ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_AccountNo'),
					key: 'fromAccountNo',
					dataIndex: 'fromAccountNo',
					align: 'center' as 'center',
					render: (fromAccountNo: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromAccountNo ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_AccountDisplayName'),
					key: 'fromAccountDisplayName',
					dataIndex: 'fromAccountDisplayName',
					align: 'center' as 'center',
					render: (fromAccountDisplayName: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromAccountDisplayName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Amount'),
					key: 'fromAmount',
					dataIndex: 'fromAmount',
					align: 'center' as 'center',
					render: (fromAmount: number) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromAmount ? numFormatToDigits(fromAmount) : '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Fee'),
					key: 'fromFee',
					dataIndex: 'fromFee',
					align: 'center' as 'center',
					render: (fromFee: number) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{fromFee ? numberFormatter.format(fromFee) : '-'}
							</Typography.Text>
						)
					},
				},
			],
		},
		{
			title: t('Label_To'),
			children: [
				{
					title: t('Label_Channel'),
					key: 'toChannel',
					dataIndex: 'toChannel',
					align: 'center' as 'center',
					render: (toChannel: number) => {
						const channelName = find(
							transferChannelList,
							channel => channel.value === toChannel
						)?.name
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{channelName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Agent'),
					key: 'toAgent',
					dataIndex: 'toAgent',
					align: 'center' as 'center',
					render: (toAgent: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toAgent ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Pay'),
					key: 'toPayName',
					dataIndex: 'toPayName',
					align: 'center' as 'center',
					render: (toPayName: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toPayName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_MemberId'),
					key: 'toUserName',
					dataIndex: 'toUserName',
					align: 'center' as 'center',
					render: (toUserName: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toUserName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Currency'),
					key: 'toIsoCode',
					dataIndex: 'toIsoCode',
					align: 'center' as 'center',
					render: (toIsoCode: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toIsoCode ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Bank'),
					key: 'toBankCode',
					dataIndex: 'toBankCode',
					align: 'center' as 'center',
					render: (toBankCode: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toBankCode ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_AccountNo'),
					key: 'toAccountNo',
					dataIndex: 'toAccountNo',
					align: 'center' as 'center',
					render: (toAccountNo: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toAccountNo ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_AccountDisplayName'),
					key: 'toAccountDisplayName',
					dataIndex: 'toAccountDisplayName',
					align: 'center' as 'center',
					render: (toAccountDisplayName: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toAccountDisplayName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Amount'),
					key: 'toAmount',
					dataIndex: 'toAmount',
					align: 'center' as 'center',
					render: (toAmount: number) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toAmount ? numFormatToDigits(toAmount) : '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Fee'),
					key: 'toFee',
					dataIndex: 'toFee',
					align: 'center' as 'center',
					render: (toFee: number) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{toFee ? numberFormatter.format(toFee) : '-'}
							</Typography.Text>
						)
					},
				},
			],
		},
		{
			title: '',
			children: [
				{
					title: t('Label_CreateTime'),
					key: 'createTime',
					dataIndex: 'createTime',
					width: 120,
					align: 'center' as 'center',
					render: (createTime: string) =>
						createTime ? (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{dayjs(createTime)
									.utcOffset(timeZoneUtcOffset)
									.format(timeFormat)}
							</Typography.Text>
						) : (
							'-'
						),
				},
				{
					title: t('Label_Creator'),
					key: 'creatorName',
					dataIndex: 'creatorName',
					align: 'center' as 'center',
					render: (creatorName: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{creatorName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_LastUpdateTime'),
					key: 'updateTime',
					dataIndex: 'updateTime',
					width: 120,
					align: 'center' as 'center',
					render: (updateTime: string) =>
						updateTime ? (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{dayjs(updateTime)
									.utcOffset(timeZoneUtcOffset)
									.format(timeFormat)}
							</Typography.Text>
						) : (
							'-'
						),
				},
				{
					title: t('Label_LastUpdateUser'),
					key: 'updatorName',
					dataIndex: 'updatorName',
					align: 'center' as 'center',
					render: (updatorName: string) => {
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{updatorName ?? '-'}
							</Typography.Text>
						)
					},
				},
				{
					title: t('Label_Reason'),
					key: 'reason',
					dataIndex: 'reason',
					align: 'center' as 'center',
					render: (reason: number) => {
						const reasonDescription = find(
							reasonList,
							value => value.reasonId === reason
						)?.description
						return (
							<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
								{reasonDescription ?? '-'}
							</Typography.Text>
						)
					},
				},
			],
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				columns={columns}
				dataSource={bankTransferList ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				loading={loading}
			/>
		</LayoutContent.Card>
	)
}

export { TransferInfoManagementTable }

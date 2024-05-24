import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetBankListData } from 'features/memberProfile/type'
import {
	RELEASE_STATUS_VALUE_OPTIONS,
	BANK_BLOCK_STATUS_VALUE_OPTIONS,
	BANK_BLOCK_STATUS,
} from 'features/memberProfile/constants'
import { find } from 'lodash'

interface BankListTableProps {
	bankList: IGetBankListData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onBlockBankAcc: ({
		sysId,
		accountNum,
		blockStatus,
	}: {
		sysId: number
		accountNum: string
		blockStatus: number
	}) => void
	onSetReleaseAccount: ({
		sysId,
		accountNum,
		ifscCode,
		selectedId,
	}: {
		sysId: number
		accountNum: string
		selectedId: number
		ifscCode: string
	}) => void
}
const BankListTable = ({
	bankList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	onBlockBankAcc,
	onSetReleaseAccount,
}: BankListTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Action'),
			key: 'Action',
			width: 100,
			align: 'center' as 'center',
			render: (records: {
				blockStatus: number
				sysId: number
				accountNum: string
				ifscCode: string
				custId: number
			}) => {
				const { blockStatus, accountNum, sysId, ifscCode, custId } = records
				const blockStatusDisplayKey = find(BANK_BLOCK_STATUS, {
					value:
						blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK
							? BANK_BLOCK_STATUS_VALUE_OPTIONS.OPEN
							: BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK,
				})?.displayKey

				const blockStatusText = blockStatusDisplayKey
					? t(blockStatusDisplayKey)
					: '-'
				return (
					<Space>
						<Typography.Link
							onClick={() =>
								onBlockBankAcc({
									sysId,
									accountNum,
									blockStatus,
								})
							}
						>
							{blockStatusText}
						</Typography.Link>
						{blockStatus !== BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK && (
							<Popconfirm
								title={t('Label_AreYouSure')}
								onConfirm={() =>
									onSetReleaseAccount({
										sysId,
										accountNum,
										ifscCode,
										selectedId: custId,
									})
								}
							>
								<Typography.Link>{t('Label_Release')}</Typography.Link>
							</Popconfirm>
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_Status'),
			key: 'Status',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) => (
				<Typography.Text>
					{status === RELEASE_STATUS_VALUE_OPTIONS.DELETE && t('Label_Delete')}

					{status === RELEASE_STATUS_VALUE_OPTIONS.OPEN && t('Label_Open')}

					{status === RELEASE_STATUS_VALUE_OPTIONS.BO_DELETE &&
						t('Label_BoDelete')}
				</Typography.Text>
			),
		},
		{
			title: t('Label_BlockStatus'),
			key: 'BlockStatus',
			dataIndex: 'blockStatus',
			width: 100,
			align: 'center' as 'center',
			render: (blockStatus: number) => (
				<Typography.Text>
					{blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK &&
						t('Label_Block')}

					{blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.OPEN &&
						t('Label_Unlock')}
				</Typography.Text>
			),
		},
		{
			title: t('Label_BankName'),
			key: 'BankName',
			dataIndex: 'bankName',
			width: 100,
			align: 'center' as 'center',
			render: (bankName: string) =>
				bankName ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{bankName}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_AccountName'),
			key: 'AccountName',
			dataIndex: 'accountName',
			width: 100,
			align: 'center' as 'center',
			render: (accountName: string) => accountName ?? '-',
		},
		{
			title: t('Label_AccountNum'),
			key: 'AccountNum',
			dataIndex: 'accountNum',
			width: 100,
			align: 'center' as 'center',
			render: (accountNum: string) => accountNum ?? '-',
		},
		{
			title: t('Label_CreateTime'),
			key: 'CreateTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'UpdateTime',
			dataIndex: 'updateTime',
			width: 100,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},

		{
			title: t('Label_Updater'),
			key: 'Updater',
			dataIndex: 'updateOperator',
			width: 100,
			align: 'center' as 'center',
			render: (updateOperator: string) => updateOperator ?? '-',
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={bankList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default BankListTable

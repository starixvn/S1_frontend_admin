import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetEWalletListData } from 'features/memberProfile/type'
import {
	BANK_BLOCK_STATUS_VALUE_OPTIONS,
	RELEASE_STATUS_VALUE_OPTIONS,
} from 'features/memberProfile/constants'

interface EWalletListTableProps {
	eWalletList: IGetEWalletListData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onBlockEWallet: ({
		sysId,
		accountNum,
		blockStatus,
	}: {
		sysId: number
		accountNum: string
		blockStatus: number
	}) => void
	onSetReleaseEWallet: ({
		sysId,
		accountNum,
		selectedId,
	}: {
		sysId: number
		accountNum: string
		selectedId: number
	}) => void
}
const EWalletListTable = ({
	eWalletList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	onBlockEWallet,
	onSetReleaseEWallet,
}: EWalletListTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Action'),
			key: 'Action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetEWalletListData) => {
				const { blockStatus, accountNum, sysId, custId } = record
				const blockStatusText =
					blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK
						? t('Label_Unlock')
						: t('Label_Block')
				return (
					<Space>
						<Typography.Link
							onClick={() =>
								onBlockEWallet({
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
									onSetReleaseEWallet({ sysId, accountNum, selectedId: custId })
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
			title: t('Label_EWalletName'),
			key: 'EWalletName',
			dataIndex: 'eWalletName',
			width: 100,
			align: 'center' as 'center',
			render: (eWalletName: string) =>
				eWalletName ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{eWalletName}
					</Typography.Text>
				) : (
					'-'
				),
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
			dataSource={eWalletList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default EWalletListTable

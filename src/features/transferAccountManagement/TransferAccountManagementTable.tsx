import { FC } from 'react'
import moment from 'moment'
import { filter, find, includes } from 'lodash'
import { Select, TablePaginationConfig, Typography } from 'antd'
import { ModalState, PAGINATION, useQueryParams } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { IEnumTypeData } from 'common/service/enumApi/type'
import { PermissionInterface } from 'type'
import { IBankTransferAccountData } from './type'

const { Option } = Select

interface TransferAccountManagementTableProps {
	loading: boolean
	editPermission?: PermissionInterface
	bankTransferAccounts: IBankTransferAccountData[]
	transferChannelEnum: IEnumTypeData[]
	transferAccountStatusEnum: IEnumTypeData[]
	transferAccountPurposeEnum: IEnumTypeData[]
	timeZoneUtcOffset: number
	onStatusChange: (record: IBankTransferAccountData) => void
	updateModal: ModalState
}

const TransferAccountManagementTable: FC<
	TransferAccountManagementTableProps
> = ({
	loading,
	editPermission,
	bankTransferAccounts,
	transferChannelEnum,
	transferAccountStatusEnum,
	transferAccountPurposeEnum,
	timeZoneUtcOffset,
	onStatusChange,
	updateModal,
}) => {
	const { t } = useTranslation()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [queryParams, setQueryParams] = useQueryParams()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: ({ id: editId }: IBankTransferAccountData) => {
				return (
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() => {
							setQueryParams({ editId })
							updateModal.onOpen()
						}}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Bank'),
			key: 'bankCode',
			dataIndex: 'bankCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '120px',
			align: 'center' as 'center',
			render: (record: IBankTransferAccountData) => {
				const { status } = record

				return (
					<Select
						style={{ width: '100px' }}
						placeholder={t('Label_Select')}
						value={status}
						onChange={newStatus => {
							onStatusChange({ ...record, status: newStatus })
						}}
					>
						{transferAccountStatusEnum?.map(({ value, name }) => (
							<Option key={value} value={value}>
								{name}
							</Option>
						))}
					</Select>
				)
			},
		},
		{
			title: t('Label_Agent'),
			key: 'agent',
			dataIndex: 'agent',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Channel'),
			key: 'channel',
			dataIndex: 'channel',
			width: 80,
			align: 'center' as 'center',
			render: (channel: number) =>
				find(transferChannelEnum, { value: channel })?.name ?? 'N/A',
		},
		{
			title: t('Label_Purposes'),
			key: 'purpose',
			dataIndex: 'purposes',
			width: 80,
			align: 'center' as 'center',
			render: (purpose: number[]) => {
				const result = filter(transferAccountPurposeEnum, item =>
					includes(purpose, item.value)
				)

				return result.map(({ name }) => name).join(',')
			},
		},
		{
			title: t('Label_Pay'),
			key: 'payName',
			dataIndex: 'payName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AccountNo'),
			key: 'accountNo',
			dataIndex: 'accountNo',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AccountName'),
			key: 'accountName',
			dataIndex: 'accountName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DisplayName'),
			key: 'displayName',
			dataIndex: 'displayName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_BankLoginUrl'),
			key: 'bankLoginUrl',
			dataIndex: 'bankLoginUrl',
			align: 'center' as 'center',
			render: (bankLoginUrl: string) => (
				<div style={{ width: '120px' }}>{bankLoginUrl}</div>
			),
		},
		{
			title: t('Label_BankLoginAccount'),
			key: 'bankLoginAccount',
			dataIndex: 'bankLoginAccount',
			align: 'center' as 'center',
			render: (bankLoginAccount: string) => (
				<div style={{ width: '120px' }}>{bankLoginAccount}</div>
			),
		},
		{
			title: t('Label_BankLoginPassword'),
			key: 'bankLoginPassword',
			dataIndex: 'bankLoginPassword',
			align: 'center' as 'center',
			render: (bankLoginPassword: string) => (
				<div style={{ width: '120px' }}>{bankLoginPassword}</div>
			),
		},
		{
			title: t('Label_InitialTime'),
			key: 'initialTime',
			dataIndex: 'initialTime',
			align: 'center' as 'center',

			render: (initialTime: string) =>
				initialTime ? (
					<div style={{ width: '120px' }}>
						{moment(initialTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</div>
				) : (
					''
				),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<div style={{ width: '120px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</div>
				) : (
					''
				),
		},

		{
			title: t('Label_LastUpdateTime'),
			dataIndex: 'updateTime',
			align: 'center' as 'center',
			editable: false,
			render: (updateTime: string) =>
				updateTime ? (
					<div style={{ width: '120px' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</div>
				) : (
					''
				),
		},
		{
			title: t('Label_Creator'),
			key: 'creatorName',
			dataIndex: 'creatorName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Update'),
			key: 'updatorName',
			dataIndex: 'updatorName',
			width: 80,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={bankTransferAccounts}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export default TransferAccountManagementTable

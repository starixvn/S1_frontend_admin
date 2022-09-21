import { FC } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { Space, TablePaginationConfig, Typography } from 'antd'
import {
	IGetBankCardListData,
	IGetEnumData,
} from 'features/bankCardManagement/type'
import { useTranslation } from 'react-i18next'
import { EditFilled } from '@ant-design/icons'
import { PermissionInterface } from 'type'
import { find } from 'lodash'
import { numberFormatter } from 'common/utils/format'

interface IBankCardManagementTableProps {
	loading: boolean
	pagination: PaginationInterface
	bankCardList: IGetBankCardListData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	editPermission?: PermissionInterface
	statusEnumList: IGetEnumData[]
	onEditClick: (record: IGetBankCardListData) => void
}

const BankCardManagementTable: FC<IBankCardManagementTableProps> = ({
	loading,
	pagination,
	bankCardList,
	onTableChange,
	editPermission,
	statusEnumList,
	onEditClick,
}) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetBankCardListData) => {
				return (
					<Typography.Link disabled={!editPermission?.canUse}>
						<EditFilled onClick={() => onEditClick(record)} />
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Agent'),
			key: 'agent',
			dataIndex: 'agent',
			width: 80,
			align: 'center' as 'center',
			render: (agent: string) => agent ?? '',
		},
		{
			title: t('Label_BankCode'),
			key: 'bankCode',
			dataIndex: 'bankCode',
			width: 100,
			align: 'center' as 'center',
			render: (bankCode: string) => bankCode ?? 'N/A',
		},
		{
			title: t('Label_BankName'),
			key: 'bankName',
			dataIndex: 'bankName',
			width: 100,
			align: 'center' as 'center',
			render: (bankName: string) =>
				bankName ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{bankName}
					</Typography.Text>
				) : (
					'N/A'
				),
		},
		{
			title: t('Label_AccountNo'),
			key: 'accountNo',
			dataIndex: 'accountNo',
			width: 100,
			align: 'center' as 'center',
			render: (accountNo: string) => accountNo ?? 'N/A',
		},
		{
			title: t('Label_AccountName'),
			key: 'accountName',
			dataIndex: 'accountName',
			width: 100,
			align: 'center' as 'center',
			render: (accountName: string) =>
				accountName ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{accountName}
					</Typography.Text>
				) : (
					'N/A'
				),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 60,
			align: 'center' as 'center',
			render: (statusValue: number) => {
				const statusName = find(
					statusEnumList,
					status => status.value === statusValue
				)?.name
				return statusName ?? 'N/A'
			},
		},
		{
			title: t('Label_SupportChannels'),
			key: 'supportChannelNames',
			dataIndex: 'supportChannelNames',
			width: 60,
			align: 'center' as 'center',
			render: (supportChannelNames: string[]) => {
				return supportChannelNames.length > 0 ? (
					<Space style={{ padding: '10px' }}>
						{supportChannelNames.map((channelName, index) => {
							return index === supportChannelNames.length - 1 ? (
								<Typography.Text>{channelName}</Typography.Text>
							) : (
								<>
									<Typography.Text>{channelName}</Typography.Text>
									<Typography.Text>&</Typography.Text>
								</>
							)
						})}
					</Space>
				) : (
					'-'
				)
			},
		},
		{
			title: t('Label_Purposes'),
			key: 'purposes',
			dataIndex: 'purposes',
			width: 100,
			align: 'center' as 'center',
			render: (purposes: string[]) => {
				return purposes.length > 0 ? (
					<Space style={{ padding: '10px' }}>
						{purposes.map((purpose, index) => {
							return index === purposes.length - 1 ? (
								<Typography.Text>{purpose}</Typography.Text>
							) : (
								<>
									<Typography.Text>{purpose}</Typography.Text>
									<Typography.Text>&</Typography.Text>
								</>
							)
						})}
					</Space>
				) : (
					'N/A'
				)
			},
		},
		{
			title: t('Label_PointLevel'),
			key: 'pointLevels',
			dataIndex: 'pointLevels',
			width: 100,
			align: 'center' as 'center',
			render: (pointLevels: number[]) => {
				return pointLevels.length > 0 ? (
					<Space>
						{pointLevels.map((pointLevel, index) => {
							return index === pointLevels.length - 1 ? (
								<Typography.Text>{pointLevel}</Typography.Text>
							) : (
								<>
									<Typography.Text>{pointLevel}</Typography.Text>
									<Typography.Text>,</Typography.Text>
								</>
							)
						})}
					</Space>
				) : (
					'-'
				)
			},
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevelNames',
			dataIndex: 'vipLevelNames',
			width: 100,
			align: 'center' as 'center',
			render: (vipLevelNames: string[]) => {
				return vipLevelNames.length > 0 ? (
					<Space direction='vertical'>
						{vipLevelNames.map(vipLevel => (
							<Typography.Text style={{ whiteSpace: 'nowrap' }}>
								{vipLevel}
							</Typography.Text>
						))}
					</Space>
				) : (
					'-'
				)
			},
		},
		{
			title: t('Label_MinAmount'),
			key: 'minAmount',
			dataIndex: 'minAmount',
			width: 100,
			align: 'center' as 'center',
			render: (minAmount: number) => numberFormatter.format(minAmount),
		},
		{
			title: t('Label_MaxAmount'),
			key: 'maxAmount',
			dataIndex: 'maxAmount',
			width: 100,
			align: 'center' as 'center',
			render: (maxAmount: number) => numberFormatter.format(maxAmount),
		},
		{
			title: t('Label_DailyLimitAmount'),
			key: 'dailyLimitAmount',
			dataIndex: 'dailyLimitAmount',
			width: 100,
			align: 'center' as 'center',
			render: (dailyLimitAmount: number) =>
				numberFormatter.format(dailyLimitAmount),
		},
		{
			title: t('Label_Dummy'),
			key: 'dummy',
			dataIndex: 'dummy',
			width: 100,
			align: 'center' as 'center',
			render: (dummy: number) => numberFormatter.format(dummy),
		},
		{
			title: t('Label_Sort'),
			key: 'sort',
			dataIndex: 'sort',
			width: 80,
			align: 'center' as 'center',
			render: (sort: number) => sort,
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				dataSource={bankCardList ?? []}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { BankCardManagementTable }

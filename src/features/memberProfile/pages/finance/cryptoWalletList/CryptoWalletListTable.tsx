import dayjs from 'dayjs'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Space, Typography, Popconfirm, TablePaginationConfig } from 'antd'
import { Table } from 'components'
import { PAGINATION } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { useGetEnumTypeQuery, IEnumTypeData } from 'common/service/enumApi'
import { LayoutContent } from 'app/pages/layout'
import { IBlockCryptoWalletData } from 'features/blockCryptoWallet/type'

interface ICryptoWalletListTableProps {
	loading: boolean
	cryptoWalletList: IBlockCryptoWalletData[]
	timeZoneUtcOffset: number
	blockStatusEnumList: IEnumTypeData[]
	onBlockCryptoWallet: ({
		address,
		blockStatus,
	}: {
		address: string
		blockStatus: number
	}) => void
	onReleaseCryptoWallet: ({
		address,
		network,
		custId,
		cryptoCurrencyId,
	}: {
		address: string
		network: string
		cryptoCurrencyId?: number
		custId: number
	}) => void
}

const CryptoWalletListTable = ({
	loading,
	cryptoWalletList,
	timeZoneUtcOffset,
	blockStatusEnumList,
	onBlockCryptoWallet,
	onReleaseCryptoWallet,
}: ICryptoWalletListTableProps) => {
	const { t } = useTranslation()

	const {
		data: { data: custCryptoWalletSatatusList = [] } = {},
		isLoading: isGetCustCryptoWalletSatatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'CustCryptoWalletDetailSatatus' })

	const columns = [
		{
			title: t('Label_Action'),
			width: 80,
			align: 'center' as 'center',
			render: (data: {
				blockStatus: number
				custId: number
				address: string
				network: string
				currencyId: number
			}) => {
				const { blockStatus, address, network, custId, currencyId } = data

				const blockStatusName = find(
					blockStatusEnumList,
					({ value }) => value === blockStatus
				)?.name
				const blockStatusText =
					blockStatusName === 'Block' ? t('Label_Unlock') : t('Label_Block')

				return (
					<Space>
						<Typography.Link
							onClick={() => onBlockCryptoWallet({ address, blockStatus })}
						>
							{blockStatusText}
						</Typography.Link>

						<Popconfirm
							title={t('Label_AreYouSure')}
							onConfirm={() =>
								onReleaseCryptoWallet({
									address,
									network,
									cryptoCurrencyId: currencyId,
									custId,
								})
							}
						>
							<Typography.Link>{t('Label_Release')}</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Status'),
			width: 80,
			align: 'center' as 'center',
			render: (data: { custId: number; status: number }) => {
				const { custId, status } = data

				const emptyStatus = custId === 0
				const custStatus = find(
					custCryptoWalletSatatusList,
					({ value }) => value === status
				)?.name

				return emptyStatus ? '' : custStatus
			},
		},
		{
			title: t('Label_BlockStatus'),
			width: 80,
			align: 'center' as 'center',
			dataIndex: 'blockStatus',
			render: (value: number) =>
				find(blockStatusEnumList, { value })?.name ?? 'N/A',
		},
		{
			title: t('Label_CryptoType'),
			width: 80,
			align: 'center' as 'center',
			dataIndex: 'currencyName',
		},
		{
			title: t('Label_Network'),
			width: 80,
			align: 'center' as 'center',
			dataIndex: 'network',
		},
		{
			title: t('Label_WalletAddress'),
			width: 80,
			align: 'center' as 'center',
			key: 'address',
			dataIndex: 'address',
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
						? dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
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
						? dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Updater'),
			key: 'updateOperator',
			dataIndex: 'updateOperator',
			width: 100,
			align: 'center' as 'center',
			render: (user: string) => user || '-',
		},
	]

	return (
		<LayoutContent.Card style={{ marginTop: -20 }}>
			<Table
				loading={loading || isGetCustCryptoWalletSatatusListLoading}
				dataSource={cryptoWalletList ?? []}
				style={{ marginTop: '10px', marginBottom: '10px' }}
				columns={columns}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export { CryptoWalletListTable }

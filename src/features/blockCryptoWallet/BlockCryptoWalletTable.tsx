import moment from 'moment'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Space, Typography, Popconfirm, TablePaginationConfig } from 'antd'
import { Table } from 'components'
import paths from 'app/constants/paths'
import { PermissionInterface } from 'type'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { useAppSelector } from 'app/store'
import { PAGINATION } from 'common/hooks'
import { selectCurrencyListBySite } from 'common/enum'
import { useGetEnumTypeQuery, IEnumTypeData } from 'common/service/enumApi'
import { timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import {
	ICryptoCurrency,
	IBlockCryptoWalletData,
} from 'features/blockCryptoWallet/type'

interface IBlockCryptoWalletTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	blockStatusEnumList: IEnumTypeData[]
	blockCryptoWalletList: IBlockCryptoWalletData[]
	deletePermission?: PermissionInterface
	cryptoCurrencyList: ICryptoCurrency[]
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
		currencyId,
		custId,
		cryptoCurrencyId,
	}: {
		address: string
		network: string
		currencyId: number
		cryptoCurrencyId?: number
		custId: number
	}) => void
}

const BlockCryptoWalletTable = ({
	loading,
	timeZoneUtcOffset,
	blockCryptoWalletList,
	blockStatusEnumList,
	deletePermission,
	cryptoCurrencyList,
	onBlockCryptoWallet,
	onReleaseCryptoWallet,
}: IBlockCryptoWalletTableProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

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
				cryptoType: string
			}) => {
				const {
					blockStatus,
					address,
					network,
					custId,
					cryptoType,
					currencyId,
				} = data

				const blockStatusName = find(
					blockStatusEnumList,
					({ value }) => value === blockStatus
				)?.name
				const blockStatusText =
					blockStatusName === 'Block' ? t('Label_Unlock') : t('Label_Block')

				const cryptoCurrencyId = find(
					cryptoCurrencyList,
					({ currencyName }) => currencyName === cryptoType
				)?.currencyId

				return (
					<Space>
						<Typography.Link
							onClick={() => onBlockCryptoWallet({ blockStatus, address })}
						>
							{blockStatusText}
						</Typography.Link>

						<Popconfirm
							title={t('Label_AreYouSure')}
							disabled={!deletePermission?.canUse}
							onConfirm={() =>
								onReleaseCryptoWallet({
									address,
									network,
									currencyId,
									cryptoCurrencyId,
									custId,
								})
							}
						>
							<Typography.Link disabled={!deletePermission?.canUse}>
								{t('Label_Release')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Currency'),
			dataIndex: 'currencyId',
			width: 120,
			align: 'center' as 'center',
			render: (currencyId: number) =>
				find(currencyListBySite, { currencyId })?.isoCode ?? 'N/A',
		},
		{
			title: t('Label_MemberId'),
			key: 'memberId',
			width: 60,
			align: 'center' as 'center',
			render: (record: IBlockCryptoWalletData) => {
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
			dataIndex: 'cryptoType',
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
						? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
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
			title: t('Label_Updater'),
			key: 'updateOperator',
			dataIndex: 'updateOperator',
			width: 100,
			align: 'center' as 'center',
			render: (user: string) => user || '-',
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading || isGetCustCryptoWalletSatatusListLoading}
				dataSource={blockCryptoWalletList}
				columns={columns}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export { BlockCryptoWalletTable }

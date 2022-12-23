import { FC } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { timeFormat } from 'common/utils/format'
import { PAGINATION } from 'common/hooks'
import { find } from 'lodash'
import {
	Popconfirm,
	Space,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { PermissionInterface } from 'type'
import { IBlockEWalletAccData } from './type'
import {
	BANK_BLOCK_STATUS_VALUE_OPTIONS,
	RELEASE_STATUS_VALUE_OPTIONS,
} from './constants'

// * custId = 0 時代表此帳號已無人使用
const isUnused = (custId: number) => custId === 0

interface IBlockEWalletTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	blockEWalletAccounts: IBlockEWalletAccData[]
	deletePermission?: PermissionInterface
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
		custId,
	}: {
		sysId: number
		accountNum: string
		custId: number
	}) => void
}

const BlockEWalletTable: FC<IBlockEWalletTableProps> = ({
	loading,
	timeZoneUtcOffset,
	blockEWalletAccounts,
	deletePermission,
	onBlockEWallet,
	onSetReleaseEWallet,
}) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const columns = [
		{
			title: t('Label_Action'),
			width: 80,
			align: 'center' as 'center',
			render: (record: IBlockEWalletAccData) => {
				const { blockStatus, accountNum, sysId, custId } = record

				// * blockStatusText 顯示當前 blockStatus 的反義詞
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

						{!isUnused(custId) && (
							<Popconfirm
								title={t('Label_AreYouSure')}
								disabled={!deletePermission?.canUse}
								onConfirm={() =>
									onSetReleaseEWallet({ sysId, accountNum, custId })
								}
							>
								<Typography.Link disabled={!deletePermission?.canUse}>
									{t('Label_Release')}
								</Typography.Link>
							</Popconfirm>
						)}
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
			key: 'userName',
			dataIndex: 'userName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			width: 80,
			align: 'center' as 'center',
			render: ({ status, custId }: IBlockEWalletAccData) => {
				return isUnused(custId) ? (
					'-'
				) : (
					<Typography.Text>
						{status === RELEASE_STATUS_VALUE_OPTIONS.DELETE &&
							t('Label_Delete')}

						{status === RELEASE_STATUS_VALUE_OPTIONS.OPEN && t('Label_Open')}

						{status === RELEASE_STATUS_VALUE_OPTIONS.BO_DELETE &&
							t('Label_BoDelete')}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_BlockStatus'),
			width: 120,
			align: 'center' as 'center',
			render: (values: { blockStatus: number }) => {
				const { blockStatus } = values
				return (
					<Typography.Text>
						{blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK &&
							t('Label_Block')}

						{blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.OPEN &&
							t('Label_Unlock')}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_EWalletName'),
			dataIndex: 'eWalletName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AccountNum'),
			dataIndex: 'accountNum',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			width: 140,
			align: 'center' as 'center',
			render: ({ createTime, custId }: IBlockEWalletAccData) =>
				isUnused(custId)
					? '-'
					: moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			width: 140,
			align: 'center' as 'center',
			render: (record: IBlockEWalletAccData) => {
				const { blockUpdateTime, updateTime } = record
				// * 拿 `blockUpdateTime` 跟 `updateTime` 後者的時間
				const time = moment(blockUpdateTime).isAfter(updateTime)
					? blockUpdateTime
					: updateTime
				return updateTime
					? moment(time).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: ''
			},
		},
		{
			title: t('Label_Updater'),
			dataIndex: 'updateOperator',
			width: 80,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={blockEWalletAccounts}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export default BlockEWalletTable

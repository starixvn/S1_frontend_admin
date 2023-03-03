import moment from 'moment'
import React, { FC } from 'react'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'
import { timeFormat } from 'common/utils/format'
import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import { Table } from 'components'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { PAGINATION } from 'common/hooks'
import { useIsMounted } from 'usehooks-ts'
import { PermissionInterface } from 'type'
import { IBlockBankAccState } from './type'
import {
	BANK_BLOCK_STATUS,
	BANK_BLOCK_STATUS_VALUE_OPTIONS,
	RELEASE_STATUS_VALUE_OPTIONS,
} from './constants'

// * custId = 0 時代表此帳號已無人使用
const isUnused = (custId: number) => custId === 0

interface IBlockBankAccountTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	blockBankAccData: IBlockBankAccState[]
	deletePermission?: PermissionInterface
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
		custId,
	}: {
		sysId: number
		accountNum: string
		custId: number
		ifscCode: string
	}) => void
}

const BlockBankAccountTable: FC<IBlockBankAccountTableProps> = ({
	loading,
	timeZoneUtcOffset,
	blockBankAccData,
	deletePermission,
	onBlockBankAcc,
	onSetReleaseAccount,
}) => {
	const { t } = useTranslation()
	const isMounted = useIsMounted()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const columns = [
		{
			title: t('Label_Action'),
			width: 80,
			align: 'center' as 'center',
			render: (values: {
				blockStatus: number
				sysId: number
				accountNum: string
				ifscCode: string
				custId: number
			}) => {
				const { blockStatus, accountNum, sysId, ifscCode, custId } = values

				const blockStatusDisplayKey = find(BANK_BLOCK_STATUS, {
					value:
						blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK
							? BANK_BLOCK_STATUS_VALUE_OPTIONS.OPEN
							: BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK,
				})?.displayKey

				const blockStatusText = blockStatusDisplayKey
					? t(blockStatusDisplayKey)
					: 'N/A'

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

						{!isUnused(custId) && (
							<Popconfirm
								title={t('Label_AreYouSure')}
								disabled={!deletePermission?.canUse}
								onConfirm={() =>
									onSetReleaseAccount({ sysId, accountNum, ifscCode, custId })
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
			width: 120,
			render: ({ custId, userName }: IBlockBankAccState) =>
				userName ? (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				) : (
					'-'
				),
		},
		{
			title: t('Label_Status'),
			width: 80,
			align: 'center' as 'center',
			render: ({ status, custId }: IBlockBankAccState) => {
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
			width: 80,
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
			title: t('Label_BankName'),
			dataIndex: 'bankName',
			width: 120,
		},
		{
			title: t('Label_AccountName'),
			dataIndex: 'accountName',
			width: 120,
		},
		{
			title: t('Label_AccountNum'),
			dataIndex: 'accountNum',
			width: 120,
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			width: 140,
			align: 'center' as 'center',
			render: ({ createTime, custId }: IBlockBankAccState) => {
				return isUnused(custId)
					? '-'
					: createTime &&
							moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
			},
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 140,
			align: 'center' as 'center',
			render: (releaseUpdateTime: string | null, record = {}) => {
				const { blockUpdateTime } = record as IBlockBankAccState

				const updateTime = moment(blockUpdateTime).isAfter(releaseUpdateTime)
					? blockUpdateTime
					: releaseUpdateTime

				return updateTime
					? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
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

	if (!isMounted()) {
		return null
	}

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={blockBankAccData}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export default BlockBankAccountTable

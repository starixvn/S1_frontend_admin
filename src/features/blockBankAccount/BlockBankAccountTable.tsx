import { FC } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'
import moment from 'moment'
import { Space, Table, TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PAGINATION } from 'common/hooks'
import { useIsMounted } from 'usehooks-ts'
import { IBlockBankAccResponse } from './type'
import { BANK_BLOCK_STATUS, BANK_BLOCK_STATUS_VALUE_OPTIONS } from './constants'

interface IBlockBankAccountTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	blockBankAccData: IBlockBankAccResponse[]
	onBlockBankAcc: ({
		sysId,
		accountNum,
		status,
	}: {
		sysId: number
		accountNum: string
		status: number
	}) => void
}

const BlockBankAccountTable: FC<IBlockBankAccountTableProps> = ({
	loading,
	timeZoneUtcOffset,
	blockBankAccData,
	onBlockBankAcc,
}) => {
	const { t } = useTranslation()

	const isMounted = useIsMounted()

	const columns = [
		{
			title: t('Label_Action'),
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => {
				const statusDisplayKey = _.find(BANK_BLOCK_STATUS, {
					value:
						values.status === BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK
							? BANK_BLOCK_STATUS_VALUE_OPTIONS.UNLOCK
							: BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK,
				})?.displayKey

				const text = statusDisplayKey ? t(statusDisplayKey) : 'N/A'

				return (
					<Space>
						<Typography.Link
							onClick={() =>
								onBlockBankAcc({
									sysId: values.sysId,
									accountNum: values.accountNum,
									status: values.status,
								})
							}
						>
							{text}
						</Typography.Link>
					</Space>
				)
			},
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 120,
		},
		{
			title: t('Label_Status'),
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => {
				return (
					<Typography.Text>
						{values.status === BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK &&
							t('Label_Lock')}

						{values.status === BANK_BLOCK_STATUS_VALUE_OPTIONS.UNLOCK &&
							t('Label_Open')}
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
			dataIndex: 'createTime',
			width: 140,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime
					? moment(createTime)
							.utcOffset(timeZoneUtcOffset)
							.format('YYYY-MM-DD  hh:mm:ss')
					: '',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 140,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime
					? moment(updateTime)
							.utcOffset(timeZoneUtcOffset)
							.format('YYYY-MM-DD  hh:mm:ss')
					: '',
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
				bordered
				rowKey={() => uuidV4()}
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={blockBankAccData}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export default BlockBankAccountTable

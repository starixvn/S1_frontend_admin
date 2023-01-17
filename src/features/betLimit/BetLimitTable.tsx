import moment from 'moment'
import { Space, Typography, Popconfirm, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { PermissionInterface } from 'type'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectCurrencyListBySite } from 'common/enum'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { IBetLimitData } from 'features/betLimit/type'

interface IBetLimitTableProps {
	loading: boolean
	pagination: PaginationInterface
	betLimitList: IBetLimitData[]
	editPermission?: PermissionInterface
	deletePermission?: PermissionInterface
	timeZoneUtcOffset: number
	onEdit: ({
		custId,
		userName,
		currencyId,
	}: {
		custId: number
		userName: string
		currencyId: number
	}) => void
	onDelete: (data: IBetLimitData) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const BetLimitTable = ({
	loading,
	pagination,
	betLimitList,
	editPermission,
	deletePermission,
	timeZoneUtcOffset,
	onEdit,
	onDelete,
	onTableChange,
}: IBetLimitTableProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const columns = [
		{
			title: t('Label_Action'),
			key: 'edit',
			width: 100,
			align: 'center' as 'center',
			render: (data: IBetLimitData) => {
				const { custId, userName, currencyId } = data
				return (
					<Space style={{ padding: '10px' }} size='middle'>
						<Typography.Link
							onClick={() => {
								onEdit({ custId, userName, currencyId })
							}}
						>
							{editPermission?.canUse ? t('Label_Edit') : t('Label_Detail')}
						</Typography.Link>
						<Popconfirm
							disabled={!deletePermission?.canUse}
							title={t('Label_SureToDelete')}
							onConfirm={() => onDelete(data)}
						>
							<Typography.Link disabled={!deletePermission?.canUse}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'currencyId',
			dataIndex: 'currencyId',
			width: 60,
			align: 'center' as 'center',
			render: (currencyId: number) =>
				currencyListBySite.find(
					({ currencyId: siteCurrencyId }) => currencyId === siteCurrencyId
				)?.isoCode ?? 'N/A',
		},
		{
			title: t('Label_MemberId'),
			key: 'memberId',
			width: 60,
			align: 'center' as 'center',
			render: (record: IBetLimitData) => {
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
			title: t('Label_Creator'),
			key: 'creator',
			dataIndex: 'creator',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) => (
				<div>
					{createTime ? (
						<Typography.Text style={{ whiteSpace: 'nowrap' }}>
							{moment(createTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'updateOperator',
			dataIndex: 'updateOperator',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 100,
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<div>
					{updateTime ? (
						<Typography.Text style={{ whiteSpace: 'nowrap' }}>
							{moment(updateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={betLimitList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { BetLimitTable }

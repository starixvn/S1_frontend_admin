import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter, timeFormat } from 'common/utils/format'
import dayjs from 'dayjs'
import { PaginationInterface } from 'common/hooks'
import { ColumnsType } from 'antd/es/table'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { find } from 'lodash'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IGetRedemptionListData } from './type'
import { statusesList } from './constants'

interface IRedemptionListingTableProps {
	loading: boolean
	redemptionListData: IGetRedemptionListData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
}

const RedemptionListingTable: FC<IRedemptionListingTableProps> = ({
	loading,
	timeZoneUtcOffset,
	redemptionListData,
	pagination,
	onTableChange,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const columns: ColumnsType<IGetRedemptionListData> = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('label_InvoiceId'),
			key: 'transId',
			width: 80,
			align: 'center' as 'center',
			render: (value: IGetRedemptionListData) => {
				const { transId, redemptionId } = value
				const searchParams = createSearchParams({
					transId,
				})
				return (
					<Typography.Link
						onClick={() => {
							navigate(
								`/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.redemptionDetail.root}/${redemptionId}?${searchParams}`
							)
						}}
					>
						{transId}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (status: number) => {
				const currentStatus = find(statusesList, obj => obj.status === status)
				return currentStatus ? t(currentStatus.displayKey) : ''
			},
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			sorter: (rowA, rowB) =>
				dayjs(rowA.createTime).unix() - dayjs(rowB.createTime).unix(),
			render: (createTime: string) =>
				createTime
					? dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			sorter: (rowA, rowB) =>
				dayjs(rowA.updateTime).unix() - dayjs(rowB.updateTime).unix(),
			render: (updateTime: string) =>
				updateTime
					? dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaId',
			dataIndex: 'sabaId',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevelName',
			dataIndex: 'vipLevelName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ItemName'),
			key: 'itemName',
			dataIndex: 'itemName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ItemPoint'),
			key: 'point',
			dataIndex: 'point',
			width: 80,
			align: 'center' as 'center',
			sorter: (rowA, rowB) => rowA.point - rowB.point,
			render: (point: number) => numberFormatter.format(point),
		},
		{
			title: t('Label_ItemCost'),
			key: 'actualCost',
			dataIndex: 'actualCost',
			width: 80,
			align: 'center' as 'center',
			sorter: (rowA, rowB) => rowA.actualCost - rowB.actualCost,
			render: (actualCost: number) =>
				actualCost > 0 ? numberFormatter.format(actualCost) : '-',
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={redemptionListData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}
export { RedemptionListingTable }

import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Table } from 'components'
import { TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PAGINATION, PaginationInterface } from 'common/hooks'
import dayjs from 'dayjs'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IGetMemberListData } from './type'

interface IMemberListTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	memberListData: IGetMemberListData[]
	timeZoneUtcOffset: number
	dateRange: { startTime: string; endTime: string }
}

const MemberListTable: FC<IMemberListTableProps> = ({
	loading,
	pagination,
	onTableChange,
	memberListData,
	timeZoneUtcOffset,
	dateRange,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'isoCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 120,
			align: 'center' as 'center',
			render: ({ custId, userName }: IGetMemberListData) =>
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
			title: t('Label_SabaId'),
			key: 'sabaId',
			dataIndex: 'tpUserName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevel',
			dataIndex: 'vipLevelName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TotalPointEarned'),
			key: 'pointEarned',
			dataIndex: 'pointEarned',
			width: 80,
			align: 'center' as 'center',
			render: (pointEarned: number) => numberFormatter.format(pointEarned),
		},
		{
			title: t('Label_PointUsed'),
			key: 'pointUsed',
			dataIndex: 'pointUsed',
			width: 80,
			align: 'center' as 'center',
			render: (pointUsed: number) => numberFormatter.format(pointUsed),
		},
		{
			title: t('Label_PointBalance'),
			key: 'pointBalance',
			dataIndex: 'pointBalance',
			width: 80,
			align: 'center' as 'center',
			render: (pointBalance: number) => numberFormatter.format(pointBalance),
		},
		{
			title: t('Label_PointLog'),
			key: 'pointLog',
			width: 80,
			align: 'center' as 'center',
			render: (values: IGetMemberListData) => {
				const { userName, tpUserName, custId } = values
				return (
					<Typography.Link
						onClick={() => {
							const searchParams = createSearchParams({
								userName,
								tpUserName,
								startTime: dateRange.startTime,
								endTime: dateRange.endTime,
								timeZoneUtcOffset: timeZoneUtcOffset.toString(),
								current: PAGINATION.defaultCurrent.toString(),
								pageSize: PAGINATION.defaultPageSize.toString(),
							})
							navigate(
								`/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.memberList.sub.memberListLog.root}/${custId}?${searchParams}`
							)
						}}
					>
						{t('Label_SeeLog')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_LastRedemption'),
			key: 'lastRedemptionTime',
			dataIndex: 'lastRedemptionTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastRedemptionTime: string) =>
				lastRedemptionTime
					? dayjs(lastRedemptionTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime
					? dayjs(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={memberListData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}
export { MemberListTable }

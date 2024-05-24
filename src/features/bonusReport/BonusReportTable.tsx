import dayjs from 'dayjs'
import { Space, Table, TablePaginationConfig, Tag, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { PaginationInterface } from 'common/hooks'
import { isJSON } from 'common/utils'
import { numberFormatter, timeFormat } from 'common/utils/format'
import {
	useVisibilityColumnsButtonHook,
	VisibilityColumnsButton,
} from 'components'
import { isString, uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import { IBonusReportData } from './type'

interface IBonusReportTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	bonusReportDataList: IBonusReportData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const BonusReportTable = ({
	loading,
	timeZoneUtcOffset,
	bonusReportDataList,
	pagination,
	onTableChange,
}: IBonusReportTableProps) => {
	const { t } = useTranslation()
	const { onChangeVisibilityColumns, onGetVisibilityColumns } =
		useVisibilityColumnsButtonHook()

	const baseColumns = [
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_SiteName'),
			key: 'siteName',
			dataIndex: 'siteName',
			width: 120,
			align: 'center' as 'center',
			render: (siteName: string) => siteName || '-',
		},
		{
			title: t('Label_BonusType'),
			key: 'promotionName',
			dataIndex: 'promotionName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_GetPage'),
			key: 'atPage',
			dataIndex: 'atPage',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PromotionCategory'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DepositId'),
			key: 'depositInfo',
			dataIndex: 'depositInfo',
			width: 120,
			align: 'center' as 'center',
			render: (
				depositInfo: string | null // * 後端可能回傳 JSON | null
			) => {
				if (isString(depositInfo) && isJSON(depositInfo)) {
					const depositInfoList: { Amount: number; DepositId: string }[] =
						JSON.parse(depositInfo)

					return (
						<Space direction='vertical'>
							{depositInfoList?.map(info => (
								<Tag key={uniqueId()}>{info?.DepositId}</Tag>
							))}
						</Space>
					)
				}

				return ''
			},
		},
		{
			title: t('Label_DepositAmount'),
			key: 'bonusAmount',
			dataIndex: 'depositInfo',
			width: 120,
			align: 'center' as 'center',
			render: (
				depositInfo: string | null // * 後端可能回傳 JSON | null
			) => {
				if (isString(depositInfo) && isJSON(depositInfo)) {
					const depositInfoList: { Amount: number; DepositId: string }[] =
						JSON.parse(depositInfo)

					return (
						<Space direction='vertical'>
							{depositInfoList?.map(info =>
								numberFormatter.format(info.Amount)
							)}
						</Space>
					)
				}

				return ''
			},
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 120,
			align: 'center' as 'center',
			render: ({ custId, userName, siteId }: IBonusReportData) =>
				userName ? (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}?siteId=${siteId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				) : (
					'-'
				),
		},
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Bonus'),
			key: 'bonus',
			dataIndex: 'bonus',
			width: 120,
			align: 'center' as 'center',
			render: (bonus: number) => numberFormatter.format(bonus),
		},
		{
			title: t('Label_MaxBonus'),
			key: 'maxBonus',
			dataIndex: 'maxBonus',
			width: 120,
			align: 'center' as 'center',
			render: (maxBonus: number) => numberFormatter.format(maxBonus),
		},
		{
			title: t('Label_Rollover'),
			key: 'rollOver',
			dataIndex: 'rollOver',
			width: 120,
			align: 'center' as 'center',
			render: (rollOver: number) => numberFormatter.format(rollOver),
		},
		{
			title: t('Label_WinOver'),
			key: 'winOver',
			dataIndex: 'winOver',
			width: 120,
			align: 'center' as 'center',
			render: (winOver: number) => numberFormatter.format(winOver),
		},
		{
			title: t('Label_LockedAmount'),
			key: 'lockedAmount',
			dataIndex: 'lockedAmount',
			width: 120,
			align: 'center' as 'center',
			render: (lockedAmount: number) => numberFormatter.format(lockedAmount),
		},
		{
			title: t('Label_BonusAmount'),
			key: 'bonusAmount',
			dataIndex: 'bonusAmount',
			width: 120,
			align: 'center' as 'center',
			render: (bonusAmount: number) => numberFormatter.format(bonusAmount),
		},
		{
			title: t('Label_CancelBonusAmount'),
			key: 'cancelBonusAmount',
			dataIndex: 'cancelBonusAmount',
			width: 120,
			align: 'center' as 'center',
			render: (cancelBonusAmount: number) =>
				numberFormatter.format(cancelBonusAmount),
		},
		{
			title: t('Label_ExpiryTime'),
			key: 'expiryTime',
			dataIndex: 'expiryTime',
			align: 'center' as 'center',
			render: (expiryTime: string) =>
				expiryTime
					? dayjs(expiryTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime
					? dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Status'),
			key: 'statusName',
			dataIndex: 'statusName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ExpiredCancel'),
			key: 'expiredCancel',
			dataIndex: 'expiredCancel',
			width: 120,
			align: 'center' as 'center',
			render: (expiredCancel: boolean) => (expiredCancel ? 'TRUE' : 'FALSE'),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 120,
			align: 'center' as 'center',
		},
	]

	const columns = onGetVisibilityColumns(baseColumns)

	return (
		<LayoutContent.Card>
			<Table
				bordered
				rowKey={record => record.transId}
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={bonusReportDataList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				// eslint-disable-next-line react/no-unstable-nested-components
				title={() => (
					<Space align='end' direction='vertical' style={{ width: '100%' }}>
						<VisibilityColumnsButton
							baseColumns={baseColumns}
							onTableVisibilityColumnsChange={onChangeVisibilityColumns}
						/>
					</Space>
				)}
			/>
		</LayoutContent.Card>
	)
}

export default BonusReportTable

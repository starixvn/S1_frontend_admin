import moment from 'moment'
import { PaginationInterface } from 'common/hooks'
import { Button, TablePaginationConfig, Typography } from 'antd'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { timeFormat } from 'common/utils/format'
import { isPayoutList } from 'features/memberProfile/constants'
import { useTranslation } from 'react-i18next'
import { IVipRebateInfoData } from 'features/vipRebateReport/type'

interface VipRebateReportTableProps {
	vipRebateInfoList: IVipRebateInfoData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onDetailClicked: (records: IVipRebateInfoData) => void
}

const VipRebateReportTable = ({
	vipRebateInfoList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	onDetailClicked,
}: VipRebateReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_SiteName'),
			key: 'siteName',
			dataIndex: 'siteName',
			width: 100,
			align: 'center' as 'center',
			render: (siteName: string) => siteName || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'Currency',
			dataIndex: 'currency',
			width: 100,
			align: 'center' as 'center',
			render: (currency: string) => currency ?? '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'MemberId',
			width: 100,
			align: 'center' as 'center',
			render: ({ custId, userName, siteId }: IVipRebateInfoData) =>
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
			title: t('Label_VipLevel'),
			key: 'VipLevel',
			dataIndex: 'vipLevelName',
			width: 100,
			align: 'center' as 'center',
			render: (vipLevelName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{vipLevelName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Category'),
			key: 'Category',
			dataIndex: 'categoryName',
			width: 100,
			align: 'center' as 'center',
			render: (categoryName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{categoryName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_RedeemAmount'),
			key: 'RedeemAmount',
			dataIndex: 'rcRedeemAmount',
			width: 100,
			align: 'center' as 'center',
			render: (rcRedeemAmount: number) => rcRedeemAmount ?? '-',
		},
		{
			title: t('Label_PayoutStatus'),
			key: 'PayoutStatus',
			dataIndex: 'rcRedeemAmount',
			width: 100,
			align: 'center' as 'center',
			render: (rcRedeemAmount: number) => {
				const status = rcRedeemAmount > 0 ? 1 : 0
				return isPayoutList.map(
					({ value, displayName }) => value === status && t(displayName)
				)
			},
		},
		{
			title: t('Label_PayoutTime'),
			key: 'PayoutTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_StatementDate'),
			key: 'StatementDate',
			dataIndex: 'settledDate',
			width: 100,
			align: 'center' as 'center',
			render: (settledDate: number) => settledDate ?? '-',
		},
		{
			title: t('Label_Detail'),
			key: 'Detail',
			width: 100,
			align: 'center' as 'center',
			render: (records: IVipRebateInfoData) => {
				return (
					<Button
						type='primary'
						shape='round'
						onClick={() => onDetailClicked(records)}
					>
						{t('Label_Detail')}
					</Button>
				)
			},
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				dataSource={vipRebateInfoList ?? []}
				style={{ marginTop: '10px', marginBottom: '10px' }}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default VipRebateReportTable

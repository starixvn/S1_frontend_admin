import { FC } from 'react'
import { Table } from 'components'
import { TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { PaginationInterface } from 'common/hooks'
import { IGetBonusListData } from 'features/bonusExport/type'
import { useTranslation } from 'react-i18next'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment/moment'
import { isEmpty } from 'lodash'

interface IBonusExportTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
	bonusListData: IGetBonusListData[]
}
const BonusExportTable: FC<IBonusExportTableProps> = ({
	loading,
	pagination,
	onTableChange,
	timeZoneUtcOffset,
	bonusListData,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_SiteName'),
			key: 'siteName',
			dataIndex: 'siteName',
			align: 'center' as 'center',
			render: (siteName: string) => siteName ?? '',
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			align: 'center' as 'center',
			render: (isoCode: string) => isoCode ?? 'N/A',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			align: 'center' as 'center',
			render: ({ custId, userName }: IGetBonusListData) =>
				userName ? (
					<Typography.Link
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
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
			title: t('Label_TpUserName'),
			key: 'sabaId',
			dataIndex: 'sabaId',
			align: 'center' as 'center',
			render: (sabaId: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{sabaId ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Agent'),
			key: 'agent',
			dataIndex: 'agent',
			align: 'center' as 'center',
			render: (agent: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{agent ?? ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_TransactionId'),
			key: 'transId',
			dataIndex: 'transId',
			align: 'center' as 'center',
			render: (transId: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{!isEmpty(transId) ? transId : 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_EventType'),
			key: 'eventType',
			dataIndex: 'eventType',
			align: 'center' as 'center',
			render: (eventType: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{eventType ?? ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			align: 'center' as 'center',
			render: (bonusCode: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{!isEmpty(bonusCode) ? bonusCode : 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_EventName'),
			key: 'eventName',
			dataIndex: 'eventName',
			align: 'center' as 'center',
			render: (eventName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{!isEmpty(eventName) ? eventName : 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			align: 'center' as 'center',
			render: (amount: number) => numberFormatter.format(amount),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) => (
				<div style={{ width: '150px', display: 'contents' }}>
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
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={bonusListData ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				scroll={{ x: 500 }}
				size='middle'
			/>
		</LayoutContent.Card>
	)
}

export { BonusExportTable }

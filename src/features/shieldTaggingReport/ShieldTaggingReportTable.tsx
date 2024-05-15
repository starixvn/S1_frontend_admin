import { TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import dayjs from 'dayjs'
import { IShieldTaggingReportData } from 'features/shieldTaggingReport/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'

interface IShieldTaggingReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	shieldTaggingReportList: IShieldTaggingReportData[]
	taggedIssueList: IEnumTypeData[]
	triggeredPointsList: IEnumTypeData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	onAccountClick: (shieldId: string) => void
}

const ShieldTaggingReportTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	shieldTaggingReportList,
	taggedIssueList,
	triggeredPointsList,
	onTableChange,
	onAccountClick,
}: IShieldTaggingReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 80,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},

		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: ({ userName, custId }: IShieldTaggingReportData) => {
				return userName ? (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				) : (
					'-'
				)
			},
		},
		{
			title: t('Label_ShieldId'),
			key: 'shieldId',
			dataIndex: 'shieldId',
			width: 100,
			align: 'center' as 'center',
			render: (shieldId: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{shieldId ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Platform'),
			key: 'platform',
			dataIndex: 'platform',
			width: 100,
			align: 'center' as 'center',
			render: (platform: string) => platform ?? '-',
		},
		{
			title: t('Label_TriggeredPoint'),
			key: 'triggeredPoints',
			dataIndex: 'triggeredPoint',
			width: 100,
			align: 'center' as 'center',
			render: (triggeredPoint: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{
						triggeredPointsList.find(({ value }) => value === triggeredPoint)
							?.name
					}
				</Typography.Text>
			),
		},
		{
			title: t('Label_TaggedIssue'),
			key: 'taggedIssue',
			dataIndex: 'taggedIssue',
			width: 100,
			align: 'center' as 'center',
			render: (taggedIssue: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{taggedIssueList.find(({ value }) => value === taggedIssue)?.name}
				</Typography.Text>
			),
		},
		{
			title: t('Label_NoOfTagged'),
			key: 'tags',
			dataIndex: 'tags',
			width: 120,
			align: 'center' as 'center',
			render: (tags: string) => tags ?? '-',
		},
		{
			title: t('Label_AssociateAccount'),
			key: 'associateAccount',
			width: 80,
			align: 'center' as 'center',
			render: (record: IShieldTaggingReportData) => {
				const { shieldId, associateAccount } = record
				return (
					<Typography.Link onClick={() => onAccountClick(shieldId)}>
						{associateAccount}
					</Typography.Link>
				)
			},
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				dataSource={shieldTaggingReportList}
				pagination={pagination as TablePaginationConfig}
				columns={columns}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default ShieldTaggingReportTable

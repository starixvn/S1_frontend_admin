import { Popconfirm, Typography } from 'antd'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { IPendingBonusData } from 'features/pendingBonus/type'
import { PermissionInterface } from 'type'
import { IGetPromotionTypeData } from 'features/bonusManagement/type'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'

interface IPendingBonusTableProps {
	loading: boolean
	pendingBonusList: IPendingBonusData[]
	promotionList: IGetPromotionTypeData[]
	transferPermission?: PermissionInterface
	timeZoneUtcOffset: number
	handleTransfer: (siteIds: number[]) => void
}

const PendingBonusTable = ({
	loading,
	pendingBonusList,
	promotionList,
	transferPermission,
	timeZoneUtcOffset,
	handleTransfer,
}: IPendingBonusTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Action'),
			key: 'transfer',
			dataIndex: 'bonusId',
			width: 100,
			align: 'center' as 'center',
			render: (bonusId: number) => (
				<Popconfirm
					disabled={!transferPermission?.canUse}
					title={t('Label_AreYouSure')}
					onConfirm={() => handleTransfer([bonusId])}
				>
					<Typography.Link disabled={!transferPermission?.canUse}>
						{t('Label_Transfer')}
					</Typography.Link>
				</Popconfirm>
			),
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PromotionType'),
			key: 'promotionType',
			dataIndex: 'promotionType',
			width: 100,
			align: 'center' as 'center',
			render: (promotionType: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{find(promotionList, promotion => promotion.type === promotionType)
						?.promotionTypeName ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_MemberId'),
			key: 'custId',
			dataIndex: 'custId',
			width: 100,
			align: 'center' as 'center',
			render: (custId: number) => custId ?? '-',
		},
		{
			title: t('Label_LockedAmount'),
			key: 'lockedAmount',
			dataIndex: 'lockedAmount',
			width: 100,
			align: 'center' as 'center',
			render: (lockedAmount: number) =>
				numberFormatter.format(lockedAmount ?? 0),
		},
		{
			title: t('Label_BonusAmount'),
			key: 'bonusAmount',
			dataIndex: 'bonusAmount',
			width: 100,
			align: 'center' as 'center',
			render: (bonusAmount: number) => numberFormatter.format(bonusAmount ?? 0),
		},
		{
			title: t('Label_Bonus'),
			key: 'bonus',
			dataIndex: 'bonus',
			width: 100,
			align: 'center' as 'center',
			render: (bonus: number) => numberFormatter.format(bonus ?? 0),
		},
		{
			title: t('Label_Rollover'),
			key: 'rollover',
			dataIndex: 'rollover',
			width: 100,
			align: 'center' as 'center',
			render: (rollover: number) => numberFormatter.format(rollover ?? 0),
		},
		{
			title: t('Label_ExpiryTime'),
			key: 'expiryTime',
			dataIndex: 'expiryTime',
			align: 'center' as 'center',
			render: (expiryTime: string) =>
				expiryTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{moment(expiryTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
	]

	return (
		<LayoutContent.Card style={{ marginTop: '20px' }}>
			<Table
				loading={loading}
				columns={columns}
				dataSource={pendingBonusList}
				pagination={false}
			/>
		</LayoutContent.Card>
	)
}

export default PendingBonusTable

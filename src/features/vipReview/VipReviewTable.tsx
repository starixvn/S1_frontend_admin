import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	Table,
	useVisibilityColumnsButtonHook,
	VisibilityColumnsButton,
} from 'components'
import { IDowngradeData, IUpgradeData } from 'features/vipReview/type'
import { PaginationInterface } from 'common/hooks'
import { PermissionInterface } from 'type'
import { IEnumTypeData } from 'common/service/enumApi'
import { ActionStatusEnum, VipTypeEnum } from 'features/vipReview/constants'
import { numberFormatter, timeFormat } from 'common/utils/format'

interface IVipReviewTableProps {
	loading: boolean
	vipReviewList: IUpgradeData[] | IDowngradeData[]
	vipStatusList: IEnumTypeData[]
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	editPermission?: PermissionInterface
	type: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	onEditClick: (record: IUpgradeData | IDowngradeData) => void
}

const VipReviewTable = ({
	loading,
	vipReviewList,
	vipStatusList,
	timeZoneUtcOffset,
	pagination,
	editPermission,
	type,
	onTableChange,
	onEditClick,
}: IVipReviewTableProps) => {
	const { t } = useTranslation()
	const { onChangeVisibilityColumns, onGetVisibilityColumns } =
		useVisibilityColumnsButtonHook()

	const upgradeColumns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IUpgradeData | IDowngradeData) => {
				const { canUpdateStatus, status } = record
				return canUpdateStatus ? (
					<Space>
						<Popconfirm
							disabled={!editPermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() => {
								onEditClick(record)
							}}
						>
							<Typography.Link disabled={!editPermission?.canUse}>
								{(status === ActionStatusEnum.Rejected ||
									status === ActionStatusEnum.Pending) &&
									t('Label_Approve')}
								{status === ActionStatusEnum.Approved && t('Label_Reject')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				) : (
					''
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 100,
			align: 'center' as 'center',
			render: (isoCode: string) => isoCode ?? '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: (userName: string) => userName ?? '-',
		},
		{
			title: t('Label_CurrentVipLevel'),
			key: 'currentVipName',
			dataIndex: 'currentVipName',
			width: 100,
			align: 'center' as 'center',
			render: (currentVipName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{currentVipName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_UpgradeVipLevel'),
			key: 'upgradeVipName',
			dataIndex: 'upgradeVipName',
			width: 100,
			align: 'center' as 'center',
			render: (upgradeVipName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{upgradeVipName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) =>
				vipStatusList?.find(({ value }) => value === status)?.name ?? '-',
		},
		{
			title: t('Label_DepositAmount'),
			key: 'depositAmount',
			dataIndex: 'depositAmount',
			width: 100,
			align: 'center' as 'center',
			render: (depositAmount: number) => numberFormatter.format(depositAmount),
		},
		{
			title: t('Label_ThresholdDeposit'),
			key: 'thresholdDeposit',
			dataIndex: 'thresholdDeposit',
			width: 100,
			align: 'center' as 'center',
			render: (thresholdDeposit: number) =>
				numberFormatter.format(thresholdDeposit),
		},
		{
			title: t('Label_UpgradeBonus'),
			key: 'upgradeBonus',
			dataIndex: 'upgradeBonus',
			width: 100,
			align: 'center' as 'center',
			render: (upgradeBonus: number) => numberFormatter.format(upgradeBonus),
		},
		{
			title: t('Label_CalculateTime'),
			key: 'calculateTime',
			dataIndex: 'calculateTime',
			width: 120,
			align: 'center' as 'center',
			render: (calculateTime: number | string) =>
				calculateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(calculateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_SettleTime'),
			key: 'settleTime',
			dataIndex: 'settleTime',
			width: 120,
			align: 'center' as 'center',
			render: (settleTime: any) =>
				settleTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(settleTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_LastestQualifiedTime'),
			key: 'qualifiedTime',
			dataIndex: 'qualifiedTime',
			width: 120,
			align: 'center' as 'center',
			render: (qualifiedTime: any) =>
				qualifiedTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(qualifiedTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateUser: string) => lastUpdateUser || '-',
		},
	]

	const downgradeColumns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IUpgradeData | IDowngradeData) => {
				const { canUpdateStatus, status } = record
				return canUpdateStatus &&
					(status === ActionStatusEnum.Approved ||
						status === ActionStatusEnum.Pending ||
						status === ActionStatusEnum.Rejected) ? (
					<Space>
						<Popconfirm
							disabled={!editPermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() => {
								onEditClick(record)
							}}
						>
							<Typography.Link disabled={!editPermission?.canUse}>
								{(status === ActionStatusEnum.Rejected ||
									status === ActionStatusEnum.Pending) &&
									t('Label_Approve')}
								{status === ActionStatusEnum.Approved && t('Label_Reject')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				) : (
					''
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 100,
			align: 'center' as 'center',
			render: (isoCode: string) => isoCode ?? '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: (userName: string) => userName ?? '-',
		},
		{
			title: t('Label_CurrentVipLevel'),
			key: 'currentVipName',
			dataIndex: 'currentVipName',
			width: 100,
			align: 'center' as 'center',
			render: (currentVipName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{currentVipName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) =>
				vipStatusList?.find(({ value }) => value === status)?.name ?? '-',
		},
		{
			title: t('Label_DepositAmount'),
			key: 'depositAmount',
			dataIndex: 'depositAmount',
			width: 100,
			align: 'center' as 'center',
			render: (depositAmount: number) => numberFormatter.format(depositAmount),
		},
		{
			title: t('Label_ThresholdDeposit'),
			key: 'thresholdDeposit',
			dataIndex: 'thresholdDeposit',
			width: 100,
			align: 'center' as 'center',
			render: (thresholdDeposit: number) =>
				numberFormatter.format(thresholdDeposit),
		},
		{
			title: t('Label_TurnOverAmount'),
			key: 'turnOverAmount',
			dataIndex: 'turnOverAmount',
			width: 100,
			align: 'center' as 'center',
			render: (turnOverAmount: number) =>
				numberFormatter.format(turnOverAmount),
		},
		{
			title: t('Label_ThresholdTurnOver'),
			key: 'thresholdTurnOver',
			dataIndex: 'thresholdTurnOver',
			width: 100,
			align: 'center' as 'center',
			render: (thresholdTurnOver: number) =>
				numberFormatter.format(thresholdTurnOver),
		},
		{
			title: t('Label_CalculateTime'),
			key: 'calculateTime',
			dataIndex: 'calculateTime',
			width: 120,
			align: 'center' as 'center',
			render: (calculateTime: number | string) =>
				calculateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(calculateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_SettleTime'),
			key: 'settleTime',
			dataIndex: 'settleTime',
			width: 120,
			align: 'center' as 'center',
			render: (settleTime: any) => settleTime ?? '-',
		},
		{
			title: t('Label_LastestQualifiedTime'),
			key: 'qualifiedTime',
			dataIndex: 'qualifiedTime',
			width: 120,
			align: 'center' as 'center',
			render: (qualifiedTime: any) =>
				qualifiedTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(qualifiedTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateUser: string) => lastUpdateUser || '-',
		},
	]

	const columns = onGetVisibilityColumns(
		type === VipTypeEnum.Upgrade ? upgradeColumns : downgradeColumns
	)

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				dataSource={vipReviewList ?? []}
				columns={columns}
				// eslint-disable-next-line react/no-unstable-nested-components
				title={() => (
					<Space align='end' direction='vertical' style={{ width: '100%' }}>
						<VisibilityColumnsButton
							baseColumns={
								type === VipTypeEnum.Upgrade ? upgradeColumns : downgradeColumns
							}
							onTableVisibilityColumnsChange={onChangeVisibilityColumns}
						/>
					</Space>
				)}
			/>
		</LayoutContent.Card>
	)
}

export default VipReviewTable

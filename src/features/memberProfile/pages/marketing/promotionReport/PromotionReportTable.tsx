import { PaginationInterface } from 'common/hooks'
import { Popconfirm, Row, TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import {
	DepositInfoType,
	ICustRollOverType,
	IGetPromotionReportData,
} from 'features/memberProfile/type'
import { find, isEmpty } from 'lodash'
import moment from 'moment'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import {
	PromotionReportFullFillTypeEnum,
	PromotionReportStatusEnum,
	promotionReportStatusList,
} from 'features/memberProfile/constants'
import { isJSON, isPositiveNum } from 'common/utils'
import { PermissionInterface } from 'type'

const { Text } = Typography

interface IPromotionReportTableProps {
	cancelPromotionPermission: PermissionInterface | undefined
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	promotionReport: IGetPromotionReportData[]
	onCancelPromotion: ({
		bonusId,
		currencyId,
	}: {
		bonusId: number
		currencyId: number
	}) => void
}

const PromotionReportTable = ({
	cancelPromotionPermission,
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
	promotionReport,
	onCancelPromotion,
}: IPromotionReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_BonusId'),
			key: 'bonusId',
			dataIndex: 'bonusId',
			width: 100,
			align: 'center' as 'center',
			render: (bonusId: number) => bonusId ?? '-',
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetPromotionReportData) => {
				const { bonusInfoStatus, bonusId, currencyId } = record
				return bonusInfoStatus === PromotionReportStatusEnum.Running ? (
					<Popconfirm
						disabled={!cancelPromotionPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => {
							onCancelPromotion({ bonusId, currencyId })
						}}
					>
						<Typography.Link disabled={!cancelPromotionPermission?.canUse}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Popconfirm>
				) : null
			},
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 100,
			align: 'center' as 'center',
			render: (bonusCode: string) => (!isEmpty(bonusCode) ? bonusCode : '-'),
		},
		{
			title: t('Label_DepositId'),
			key: 'depositId',
			dataIndex: 'depositInfo',
			width: 100,
			align: 'center' as 'center',
			render: (rawDepositInfo: string) => {
				if (!isJSON(rawDepositInfo)) return '-'
				const depositInfo = JSON.parse(rawDepositInfo) as DepositInfoType
				return depositInfo?.map(info => (
					<Row align='middle' justify='center'>
						{info.DepositId}
					</Row>
				))
			},
		},
		{
			title: t('Label_DepositAmount'),
			key: 'depositAmount',
			dataIndex: 'depositInfo',
			width: 100,
			align: 'center' as 'center',
			render: (rawDepositInfo: string) => {
				if (!isJSON(rawDepositInfo)) return '-'
				const depositInfo = JSON.parse(rawDepositInfo) as DepositInfoType
				return depositInfo?.map(info => (
					<Row align='middle' justify='center'>
						<Text
							type={isPositiveNum(info.Amount) ? undefined : 'danger'}
							style={{ whiteSpace: 'nowrap', padding: '5px' }}
						>
							{numFormatToDigits(info.Amount || 0)}
						</Text>
					</Row>
				))
			},
		},
		{
			title: t('Label_Description'),
			key: 'description',
			dataIndex: 'description',
			width: 120,
			align: 'center' as 'center',
			render: (description: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{description ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_BonusAmount'),
			key: 'bonusAmount',
			dataIndex: 'bonusAmount',
			width: 80,
			align: 'center' as 'center',
			render: (bonusAmount: number) => (
				<Text
					type={isPositiveNum(bonusAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(bonusAmount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_LockedAmount'),
			key: 'lockedAmount',
			dataIndex: 'lockedAmount',
			width: 80,
			align: 'center' as 'center',
			render: (lockedAmount: number) => (
				<Text
					type={isPositiveNum(lockedAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(lockedAmount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_LockedAmount'),
			key: 'lockedAmount',
			dataIndex: 'lockedAmount',
			width: 80,
			align: 'center' as 'center',
			render: (lockedAmount: number) => (
				<Text
					type={isPositiveNum(lockedAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(lockedAmount || 0)}
				</Text>
			),
		},
		{
			title: `${t('Label_Rollover')} / ${t('Label_WinOver')}`,
			key: 'turnOver',
			dataIndex: 'custRollOver',
			width: 100,
			align: 'center' as 'center',
			render: ({ rollOver }: ICustRollOverType) => (
				<Text
					type={isPositiveNum(rollOver) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(rollOver || 0)}
				</Text>
			),
		},
		{
			title: t('Label_WinOver'),
			key: 'winOver',
			width: 80,
			align: 'center' as 'center',
			render: ({
				custRollOver: { winOver },
				fullFillType,
			}: IGetPromotionReportData) => {
				const num =
					fullFillType === PromotionReportFullFillTypeEnum.WinOver ? winOver : 0
				return (
					<Text
						type={isPositiveNum(num) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(num)}
					</Text>
				)
			},
		},
		{
			title: t('Label_TurnOver'),
			key: 'turnOver',
			dataIndex: 'custRollOver',
			width: 100,
			align: 'center' as 'center',
			render: ({ turnOver }: ICustRollOverType) => (
				<Text
					type={isPositiveNum(turnOver) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(turnOver || 0)}
				</Text>
			),
		},
		{
			title: t('Label_CancelBonusAmount'),
			key: 'cancelBonusAmount',
			dataIndex: 'cancelBonusAmount',
			width: 120,
			align: 'center' as 'center',
			render: (cancelBonusAmount: number) => (
				<Text
					type={isPositiveNum(cancelBonusAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(cancelBonusAmount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_ClaimDate'),
			key: 'claimDate',
			dataIndex: 'claimDate',
			width: 120,
			align: 'center' as 'center',
			render: (claimDate: string) =>
				claimDate ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(claimDate).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 130,
			align: 'center' as 'center',
			render: (record: IGetPromotionReportData) => {
				const { bonusInfoStatus, updateTime } = record
				const statusName = find(
					promotionReportStatusList,
					status => status.value === bonusInfoStatus
				)?.displayName
				return statusName ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{`${t(statusName)} - ${moment(updateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}`}
					</Typography.Text>
				) : (
					'-'
				)
			},
		},
		{
			title: t('Label_ExpiredCancel'),
			key: 'expiredCancel',
			dataIndex: 'expiredCancel',
			align: 'center' as 'center',
			render: (expiredCancel: Boolean) => String(expiredCancel),
		},
	]

	return (
		<Table
			loading={loading}
			pagination={pagination as TablePaginationConfig}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			onChange={onTableChange}
			dataSource={promotionReport ?? []}
			columns={columns}
		/>
	)
}

export { PromotionReportTable }

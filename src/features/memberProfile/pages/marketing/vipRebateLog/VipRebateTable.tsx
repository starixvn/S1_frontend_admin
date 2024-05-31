import dayjs from 'dayjs'
import { PaginationInterface } from 'common/hooks'
import { Button, TablePaginationConfig, Typography } from 'antd'
import { IGetVipRebateLogData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography
interface IVipRebateTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	vipRebateLog: IGetVipRebateLogData[]
	onDetailClicked: ({
		createTime,
		minPayout,
		maxPayout,
		refId,
		categoryId,
	}: {
		createTime: string
		maxPayout: number
		minPayout: number
		refId: string
		categoryId: number
	}) => void
}

const VipRebateTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
	vipRebateLog,
	onDetailClicked,
}: IVipRebateTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_PayoutTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
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
			title: t('Label_Category'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_RedeemAmount'),
			key: 'rcRedeemAmount',
			dataIndex: 'rcRedeemAmount',
			width: 100,
			align: 'center' as 'center',
			render: (rcRedeemAmount: number) => (
				<Text
					type={isPositiveNum(rcRedeemAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(rcRedeemAmount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_PayoutStatus'),
			key: 'payoutStatus',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetVipRebateLogData) => {
				const { rcRedeemAmount } = record
				return rcRedeemAmount > 0 ? t('Label_Yes') : t('Label_No')
			},
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetVipRebateLogData) => {
				const { createTime, minPayout, maxPayout, refId, categoryId } = record
				return (
					<Button
						type='primary'
						shape='round'
						onClick={() =>
							onDetailClicked({
								createTime,
								minPayout,
								maxPayout,
								refId,
								categoryId,
							})
						}
					>
						{t('Label_Detail')}
					</Button>
				)
			},
		},
	]

	return (
		<Table
			loading={loading}
			pagination={pagination as TablePaginationConfig}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={vipRebateLog ?? []}
			onChange={onTableChange}
			columns={columns}
		/>
	)
}

export { VipRebateTable }

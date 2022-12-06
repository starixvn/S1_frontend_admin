import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { IGetPromotionDetailData } from 'features/memberProfile/type'
import { Descriptions, Typography } from 'antd'
import { numberFormatter } from 'common/utils/format'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography

interface ICashBackDetailTableProps {
	loading: boolean
	currentBonusCode: string | undefined
	promotionDetail: IGetPromotionDetailData
}

const { Item } = Descriptions

const CashBackDetailTable = ({
	loading,
	currentBonusCode,
	promotionDetail,
}: ICashBackDetailTableProps) => {
	const { t } = useTranslation()
	const { cashBackDetails } = promotionDetail ?? {}
	const {
		cashBackDetail = [],
		totalLossAmount = 0,
		minLossAmount = 0,
		percentage,
		originalTotalBonus = 0,
		maxBonus = 0,
		totalBonus = 0,
	} = cashBackDetails ?? {}

	const columns = [
		{
			title: (
				<Typography.Text type='success'>
					{currentBonusCode ?? '-'}
				</Typography.Text>
			),
			key: 'tpName',
			dataIndex: 'tpName',
			align: 'center' as 'center',
			width: 100,
		},
		{
			title: t('Label_LossWithBonus'),
			key: 'lossAmountWithBonus',
			dataIndex: 'lossAmountWithBonus',
			align: 'center' as 'center',
			width: 100,
			render: (lossAmountWithBonus: number) => (
				<Text
					type={isPositiveNum(lossAmountWithBonus) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numberFormatter.format(lossAmountWithBonus || 0)}
				</Text>
			),
		},
		{
			title: t('Label_NetLoss'),
			key: 'lossAmount',
			dataIndex: 'lossAmount',
			align: 'center' as 'center',
			width: 100,
			render: (lossAmount: number) => (
				<Text
					type={isPositiveNum(lossAmount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numberFormatter.format(lossAmount || 0)}
				</Text>
			),
		},
	]

	return (
		<>
			<Table
				columns={columns}
				dataSource={cashBackDetail ?? []}
				loading={loading}
				pagination={false}
			/>
			<Descriptions layout='horizontal' bordered>
				<Item label={t('Label_TotalNetLoss')}>
					<Text
						type={isPositiveNum(totalLossAmount) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numberFormatter.format(totalLossAmount || 0)}
					</Text>
				</Item>
				<Item label={t('Label_MinNetLossRequired')}>
					<Text
						type={isPositiveNum(minLossAmount) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numberFormatter.format(minLossAmount || 0)}
					</Text>
				</Item>
				<Item label={t('Label_PercentageWithoutSymbol')}>{percentage}</Item>
				<Item label={t('Label_TotalBonus')}>
					<Text
						type={isPositiveNum(originalTotalBonus) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numberFormatter.format(originalTotalBonus || 0)}
					</Text>
				</Item>
				<Item label={t('Label_MaxBonus')}>
					<Text
						type={isPositiveNum(maxBonus) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numberFormatter.format(maxBonus || 0)}
					</Text>
				</Item>
				<Item label={t('Label_TotalBonusClaimable')}>
					<Text
						type={isPositiveNum(totalBonus) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numberFormatter.format(totalBonus || 0)}
					</Text>
				</Item>
			</Descriptions>
		</>
	)
}

export { CashBackDetailTable }

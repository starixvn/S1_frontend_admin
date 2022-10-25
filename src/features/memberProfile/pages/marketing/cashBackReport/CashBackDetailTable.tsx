import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { IGetPromotionDetailData } from 'features/memberProfile/type'
import { Descriptions, Typography } from 'antd'
import { numberFormatter } from 'common/utils/format'

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
			render: (lossAmountWithBonus: number) =>
				lossAmountWithBonus ? numberFormatter.format(lossAmountWithBonus) : 0,
		},
		{
			title: t('Label_NetLoss'),
			key: 'lossAmount',
			dataIndex: 'lossAmount',
			align: 'center' as 'center',
			width: 100,
			render: (lossAmount: number) =>
				lossAmount ? numberFormatter.format(lossAmount) : 0,
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
					{numberFormatter.format(totalLossAmount)}
				</Item>
				<Item label={t('Label_MinNetLossRequired')}>
					{numberFormatter.format(minLossAmount)}
				</Item>
				<Item label={t('Label_PercentageWithoutSymbol')}>{percentage}</Item>
				<Item label={t('Label_TotalBonus')}>
					{numberFormatter.format(originalTotalBonus)}
				</Item>
				<Item label={t('Label_MaxBonus')}>
					{numberFormatter.format(maxBonus)}
				</Item>
				<Item label={t('Label_TotalBonusClaimable')}>
					{numberFormatter.format(totalBonus)}
				</Item>
			</Descriptions>
		</>
	)
}

export { CashBackDetailTable }

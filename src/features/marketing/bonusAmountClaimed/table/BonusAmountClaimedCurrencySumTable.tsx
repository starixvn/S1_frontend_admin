import { useTranslation } from 'react-i18next'
import { Table, Typography } from 'antd'
import { numFormatToDigits } from 'common/utils/format'
import { IBonusAmountClaimedReportData } from 'features/marketing/type'

interface IBonusAmountClaimedCurrencySumTableProps {
	loading: boolean
	marketingBonusAmountClaimedData: IBonusAmountClaimedReportData
}

const { Summary } = Table
const { Text } = Typography

const BonusAmountClaimedCurrencySumTable = ({
	loading,
	marketingBonusAmountClaimedData,
}: IBonusAmountClaimedCurrencySumTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_TotalBonusAmountClaimed'),
			key: 'currency',
			dataIndex: 'currency',
			width: '50%',
			align: 'center' as 'center',
			render: (currency: string) => currency || '-',
		},
		{
			title: t('Label_ReportDate'),
			key: 'bonusAmountClaim',
			dataIndex: 'bonusAmountClaim',
			width: '50%',
			align: 'center' as 'center',
			render: (bonusAmountClaim: number) =>
				bonusAmountClaim ? numFormatToDigits(bonusAmountClaim) : 0,
		},
	]

	return (
		<Table
			loading={loading}
			pagination={false}
			columns={columns}
			dataSource={marketingBonusAmountClaimedData.groupByCurrency}
			// eslint-disable-next-line react/no-unstable-nested-components
			summary={() => {
				const { bonusAmountClaim } =
					// 解決 first render is undefined
					marketingBonusAmountClaimedData.groupByCurrencySum || {}

				return (
					<Summary fixed>
						<Summary.Row style={{ background: '#fafafa' }}>
							<Summary.Cell align='center' index={1}>
								{t('Label_Total')}
							</Summary.Cell>
							<Summary.Cell align='center' index={2}>
								<Text>{numFormatToDigits(bonusAmountClaim || 0)}</Text>
							</Summary.Cell>
						</Summary.Row>
					</Summary>
				)
			}}
		/>
	)
}

export default BonusAmountClaimedCurrencySumTable

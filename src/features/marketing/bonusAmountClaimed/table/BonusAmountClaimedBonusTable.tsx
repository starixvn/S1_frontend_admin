import { Typography, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { numberFormatter, numFormatToDigits } from 'common/utils/format'
import { groupByBonusCodeResConverter } from 'features/marketing/utils'
import { IBonusAmountClaimedReportData } from 'features/marketing/type'

interface IBonusAmountClaimedBonusTableProps {
	loading: boolean
	marketingBonusAmountClaimedData: IBonusAmountClaimedReportData
}

const { Summary } = Table
const { Text } = Typography

const BonusAmountClaimedBonusTable = ({
	loading,
	marketingBonusAmountClaimedData,
}: IBonusAmountClaimedBonusTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_BonusCode'),
			key: 'currency',
			dataIndex: 'currency',
			width: '25%',
			align: 'center' as 'center',
			render: (currency: string) => currency || '-',
		},
		{
			title: t('Label_BonusName'),
			key: 'bonusName',
			dataIndex: 'bonusName',
			width: '25%',
			align: 'center' as 'center',
			render: (bonusName: string) => bonusName || '-',
		},
		{
			title: t('Label_NoOfUsersClaimingBonus'),
			key: 'numberOfBonusUser',
			dataIndex: 'numberOfBonusUser',
			width: '25%',
			align: 'center' as 'center',
			render: (numberOfBonusUser: number) =>
				numberOfBonusUser ? numberFormatter.format(numberOfBonusUser) : 0,
		},
		{
			title: t('Label_TotalBonusAmountClaimed'),
			key: 'baseBonusAmountClaim',
			dataIndex: 'baseBonusAmountClaim',
			width: '25%',
			align: 'center' as 'center',
			render: (baseBonusAmountClaim: number) =>
				baseBonusAmountClaim ? numFormatToDigits(baseBonusAmountClaim) : 0,
		},
	]

	const tableData = groupByBonusCodeResConverter(
		marketingBonusAmountClaimedData
	)

	return (
		<Table
			style={{ marginTop: 36 }}
			loading={loading}
			columns={columns}
			dataSource={tableData}
			pagination={false}
			expandable={{ expandRowByClick: true }}
			// eslint-disable-next-line react/no-unstable-nested-components
			summary={() => {
				// 解決 first render is undefined
				const { numberOfBonusUser, baseBonusAmountClaim } =
					marketingBonusAmountClaimedData.groupByBonusCodeSum || {}

				return (
					<Summary fixed>
						<Summary.Row style={{ background: '#fafafa' }}>
							<Summary.Cell align='center' index={1}>
								{t('Label_Total')}
							</Summary.Cell>
							<Summary.Cell align='center' index={2}>
								<Text> </Text>
							</Summary.Cell>
							<Summary.Cell align='center' index={3}>
								<Text>
									{numberOfBonusUser ? numFormatToDigits(numberOfBonusUser) : 0}
								</Text>
							</Summary.Cell>
							<Summary.Cell align='center' index={4}>
								{baseBonusAmountClaim
									? numFormatToDigits(baseBonusAmountClaim)
									: 0}
							</Summary.Cell>
						</Summary.Row>
					</Summary>
				)
			}}
		/>
	)
}

export default BonusAmountClaimedBonusTable

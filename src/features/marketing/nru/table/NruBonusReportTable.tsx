import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { IMarketingNruBonusReportData } from 'features/marketing/type'
import { numberFormatter, numFormatToDigits } from 'common/utils/format'

interface INruBonusReportTableProps {
	loading: boolean
	marketingNruBonusReportData: IMarketingNruBonusReportData[]
}

const NruBonusReportTable = ({
	loading,
	marketingNruBonusReportData,
}: INruBonusReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: '25%',
			align: 'center' as 'center',
			render: (bonusCode: string) => bonusCode || '-',
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
			title: t('Label_NRU'),
			key: 'nruCount',
			dataIndex: 'nruCount',
			width: '25%',
			align: 'center' as 'center',
			render: (nruCount: number) =>
				nruCount ? numberFormatter.format(nruCount) : 0,
		},
		{
			title: t('Label_Deposit'),
			key: 'depositCount',
			dataIndex: 'depositCount',
			width: '25%',
			align: 'center' as 'center',
			render: (depositCount: number) =>
				depositCount ? numberFormatter.format(depositCount) : 0,
		},
		{
			title: t('Label_FirstDepositAmount'),
			key: 'firstDeposit',
			dataIndex: 'firstDeposit',
			width: '25%',
			align: 'center' as 'center',
			render: (firstDeposit: number) =>
				firstDeposit ? numFormatToDigits(firstDeposit) : 0,
		},
		{
			title: t('Label_TotalDepositAmount'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			width: '25%',
			align: 'center' as 'center',
			render: (totalDeposit: number) =>
				totalDeposit ? numFormatToDigits(totalDeposit) : 0,
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			pagination={false}
			dataSource={marketingNruBonusReportData}
			expandable={{ expandRowByClick: true }}
			style={{ marginTop: 36 }}
		/>
	)
}

export default NruBonusReportTable

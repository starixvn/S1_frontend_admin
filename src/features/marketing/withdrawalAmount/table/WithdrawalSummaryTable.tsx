import { Table } from 'components'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { IMarketingWithdrawalSummaryData } from 'features/marketing/type'
import { numFormatToDigits, numberFormatter } from 'common/utils/format'

interface IWithdrawalSummaryTableProps {
	loading: boolean
	marketingWithdrawalSummaryData: IMarketingWithdrawalSummaryData
}

const WithdrawalSummaryTable = ({
	loading,
	marketingWithdrawalSummaryData,
}: IWithdrawalSummaryTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Total'),
			key: 'displayName',
			dataIndex: 'displayName',
			width: '50%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_ReportDate'),
			key: 'reportData',
			dataIndex: 'reportData',
			width: '50%',
			align: 'center' as 'center',
		},
	]

	return (
		<Table
			loading={loading}
			pagination={false}
			columns={columns}
			// 後端給的是 Data 物件 先值接插入
			// 為了顯示空table做的判斷 因是物件格式
			dataSource={
				!isEmpty(marketingWithdrawalSummaryData)
					? [
							{
								displayName: t('Label_TotalWithdrawalAmount'),
								reportData: numFormatToDigits(
									marketingWithdrawalSummaryData.withdrawalAmount || 0
								),
							},
							{
								displayName: t('Label_TotalWithdrawalUsers'),
								reportData: numberFormatter.format(
									marketingWithdrawalSummaryData.withdrawalUsers
								),
							},
					  ]
					: []
			}
		/>
	)
}

export default WithdrawalSummaryTable

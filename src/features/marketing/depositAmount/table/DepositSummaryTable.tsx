import { Table } from 'components'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { IMarketingDepositSummaryData } from 'features/marketing/type'
import { numFormatToDigits } from 'common/utils/format'

interface IDepositSummaryTableProps {
	loading: boolean
	marketingDepositSummaryData: IMarketingDepositSummaryData
}

const DepositSummaryTable = ({
	loading,
	marketingDepositSummaryData,
}: IDepositSummaryTableProps) => {
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
			key: 'depositAmount',
			dataIndex: 'depositAmount',
			width: '50%',
			align: 'center' as 'center',
			render: (depositAmount: number) =>
				depositAmount ? numFormatToDigits(depositAmount) : 0,
		},
	]

	return (
		<Table
			loading={loading}
			pagination={false}
			columns={columns}
			// 只顯示一行 就直接插入
			// 為了顯示空table做的判斷 因是物件格式
			dataSource={
				!isEmpty(marketingDepositSummaryData)
					? [
							{
								displayName: t('Label_DepositAmount'),
								...marketingDepositSummaryData,
							},
					  ]
					: []
			}
		/>
	)
}

export default DepositSummaryTable

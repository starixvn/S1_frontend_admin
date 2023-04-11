import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { IMarketingNruReportData } from 'features/marketing/type'

interface INruSummaryReportTableProps {
	loading: boolean
	marketingNruReportData: IMarketingNruReportData
}

const NruSummaryReportTable = ({
	loading,
	marketingNruReportData,
}: INruSummaryReportTableProps) => {
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
			title: t('Label_Report_Date'),
			key: 'newlyRegisterUsers',
			dataIndex: 'newlyRegisterUsers',
			width: '50%',
			align: 'center' as 'center',
			render: (newlyRegisterUsers: number) =>
				newlyRegisterUsers ? numberFormatter.format(newlyRegisterUsers) : 0,
		},
	]

	return (
		<Table
			loading={loading}
			pagination={false}
			columns={columns}
			// 此處 response 為物件格式 故直接插入
			dataSource={[
				{
					displayName: t('Label_NRU'),
					...marketingNruReportData.summaryData,
				},
			]}
		/>
	)
}

export default NruSummaryReportTable

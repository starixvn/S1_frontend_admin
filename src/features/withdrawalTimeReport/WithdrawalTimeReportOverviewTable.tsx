import { useTranslation } from 'react-i18next'
import {
	OverviewDescriptions,
	renderOverviewDescriptionsItems,
} from 'components'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter } from 'common/utils/format'
import { ICurrencyAmountRecordData } from 'features/withdrawalTimeReport/type'

interface IWithdrawalTimeReportOverviewTableProps {
	loading: boolean
	currencyAmountData: ICurrencyAmountRecordData[]
}

const WithdrawalTimeReportOverviewTable = ({
	loading,
	currencyAmountData,
}: IWithdrawalTimeReportOverviewTableProps) => {
	const { t } = useTranslation()

	return (
		<LayoutContent.Card>
			<OverviewDescriptions loading={loading}>
				{renderOverviewDescriptionsItems('', [t('Label_Record')])}

				{currencyAmountData.map(({ currency, record }) =>
					renderOverviewDescriptionsItems(currency, [
						numberFormatter.format(record),
					])
				)}
			</OverviewDescriptions>
		</LayoutContent.Card>
	)
}

export { WithdrawalTimeReportOverviewTable }

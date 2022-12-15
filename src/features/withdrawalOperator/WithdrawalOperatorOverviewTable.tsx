import { ICurrencyAmountRecordData } from 'features/paymentAdjustment/type'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { reduce } from 'lodash'
import {
	OverviewDescriptions,
	renderOverviewDescriptionsItems,
} from 'components'

interface IWithdrawalOperatorOverviewTableProps {
	loading: boolean
	currencyAmountData: ICurrencyAmountRecordData[]
}

const WithdrawalOperatorOverviewTable = ({
	loading,
	currencyAmountData,
}: IWithdrawalOperatorOverviewTableProps) => {
	const { t } = useTranslation()

	const { totalRecord, totalAmount } = reduce(
		currencyAmountData,
		(
			{ totalRecord: recordSum, totalAmount: amountSum },
			{ record: currentRecord, amount: currentAmount }
		) => {
			return {
				totalRecord: recordSum + currentRecord,
				totalAmount: amountSum + currentAmount,
			}
		},
		{
			totalRecord: 0,
			totalAmount: 0,
		}
	)

	return (
		<LayoutContent.Card>
			<OverviewDescriptions loading={loading}>
				{renderOverviewDescriptionsItems('', [
					t('Label_Record'),
					t('Label_WithdrawalAmount'),
				])}
				{currencyAmountData.map(({ currency, record, amount }) =>
					renderOverviewDescriptionsItems(currency, [
						numberFormatter.format(record),
						numberFormatter.format(amount),
					])
				)}
				{renderOverviewDescriptionsItems(t('Label_Total'), [
					numberFormatter.format(totalRecord),
					numberFormatter.format(totalAmount),
				])}
			</OverviewDescriptions>
		</LayoutContent.Card>
	)
}

export { WithdrawalOperatorOverviewTable }

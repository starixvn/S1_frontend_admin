import React from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	OverviewDescriptions,
	renderOverviewDescriptionsItems,
} from 'components'
import { ICurrencyAmountRecord } from 'features/bonusReport/type'
import { numberFormatter } from 'common/utils/format'

interface IDepositOperatorOverviewTableProps {
	loading: boolean
	currencyAmountRecordList: ICurrencyAmountRecord[]
	currencyAmountRecordTotal: {
		recordTotal: number
		amountTotal: number
	}
}

const DepositOperatorOverviewTable = ({
	loading,
	currencyAmountRecordList,
	currencyAmountRecordTotal: { recordTotal, amountTotal },
}: IDepositOperatorOverviewTableProps) => {
	const { t } = useTranslation()

	return (
		<LayoutContent.Card>
			<OverviewDescriptions loading={loading}>
				{renderOverviewDescriptionsItems('', [
					t('Label_Record'),
					t('Label_DepositAmount'),
				])}

				{currencyAmountRecordList.map(({ currency, record, amount }) =>
					renderOverviewDescriptionsItems(currency, [
						numberFormatter.format(record),
						numberFormatter.format(amount),
					])
				)}

				{renderOverviewDescriptionsItems(t('Label_Total'), [
					numberFormatter.format(recordTotal),
					numberFormatter.format(amountTotal),
				])}
			</OverviewDescriptions>
		</LayoutContent.Card>
	)
}

export default DepositOperatorOverviewTable

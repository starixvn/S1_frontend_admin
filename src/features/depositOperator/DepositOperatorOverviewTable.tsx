import React from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	OverviewDescriptions,
	renderOverviewDescriptionsItems,
} from 'components'
import { ICurrencyAmountRecord } from 'features/bonusReport/type'

interface IDepositOperatorOverviewTableProps {
	loading: boolean
	currencyAmountRecordList: ICurrencyAmountRecord[]
}

const DepositOperatorOverviewTable = ({
	loading,
	currencyAmountRecordList,
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
					renderOverviewDescriptionsItems(currency, [record, amount])
				)}
			</OverviewDescriptions>
		</LayoutContent.Card>
	)
}

export default DepositOperatorOverviewTable

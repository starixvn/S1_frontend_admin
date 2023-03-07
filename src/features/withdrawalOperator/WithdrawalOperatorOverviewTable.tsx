import { ICurrencyAmountRecordData } from 'features/paymentAdjustment/type'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { reduce } from 'lodash'
import {
	OverviewDescriptions,
	renderOverviewDescriptionsItems,
} from 'components'
import { Collapse } from 'antd'

interface IWithdrawalOperatorOverviewTableProps {
	loading: boolean
	currencyAmountData: ICurrencyAmountRecordData[]
}

const { Panel } = Collapse

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
		<Collapse defaultActiveKey={0}>
			<Panel header={t('Label_Summary')} key='1'>
				<LayoutContent.Card style={{ margin: 0 }}>
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
			</Panel>
		</Collapse>
	)
}

export { WithdrawalOperatorOverviewTable }

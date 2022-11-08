import { ICurrencyAmountRecordData } from 'features/paymentAdjustment/type'
import { Descriptions, Space, Spin, Typography } from 'antd'
import { CustomDivider } from 'features/redemptionListing/RedemptionOverviewTable'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'

interface IPaymentAdjustmentOverviewTableProps {
	loading: boolean
	currencyAmountData: ICurrencyAmountRecordData[]
}

const { Text } = Typography

const itemRenderer = (
	label: string,
	totalRecord: string,
	totalAmount: string
) => (
	<Descriptions.Item
		key={label}
		label={label}
		style={{
			textAlign: 'center',
			paddingLeft: 0,
			paddingRight: 0,
			minWidth: '100px',
		}}
		span={1}
	>
		<Space direction='vertical' style={{ width: '100%' }}>
			<Text>{totalRecord}</Text>
			<CustomDivider />
			<Text>{totalAmount}</Text>
		</Space>
	</Descriptions.Item>
)

const PaymentAdjustmentOverviewTable = ({
	loading,
	currencyAmountData,
}: IPaymentAdjustmentOverviewTableProps) => {
	const { t } = useTranslation()

	const titleElement = () =>
		itemRenderer('', t('Label_Record'), t('Label_Amount'))

	const recordElement = () =>
		currencyAmountData?.map(({ currency, record, amount }) =>
			itemRenderer(
				currency,
				numberFormatter.format(record),
				numberFormatter.format(amount)
			)
		)

	return (
		<LayoutContent.Card>
			<Spin spinning={loading}>
				<Descriptions
					layout='vertical'
					bordered
					size='small'
					column={10}
					style={{
						marginTop: '10px',
						marginBottom: '10px',
						overflowX: 'auto',
					}}
				>
					{titleElement()}
					{recordElement()}
				</Descriptions>
			</Spin>
		</LayoutContent.Card>
	)
}

export { PaymentAdjustmentOverviewTable }

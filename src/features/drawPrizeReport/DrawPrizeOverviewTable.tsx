import { Descriptions, Space, Spin, Typography } from 'antd'
import { ICurrencyAmountData } from 'features/drawPrizeReport/type'
import { CustomDivider } from 'features/redemptionListing/RedemptionOverviewTable'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { reduce } from 'lodash'

interface IDrawPrizeOverviewTableProps {
	currencyAmount: ICurrencyAmountData[]
	loading: boolean
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

const DrawPrizeOverviewTable = ({
	loading,
	currencyAmount,
}: IDrawPrizeOverviewTableProps) => {
	const { t } = useTranslation()

	const titleElement = () =>
		itemRenderer('', t('Label_Record'), t('Label_Amount'))

	const recordElement = () =>
		currencyAmount?.map(({ currencyName, totalRecord, totalAmount }) =>
			itemRenderer(
				currencyName,
				numberFormatter.format(totalRecord),
				numberFormatter.format(totalAmount)
			)
		)

	const totalElement = () => {
		const totalRecord = reduce(
			currencyAmount,
			(sum, current) => sum + current.totalRecord,
			0
		)
		const totalAmount = reduce(
			currencyAmount,
			(sum, current) => sum + current.totalAmount,
			0
		)
		return itemRenderer(
			t('Label_Total'),
			numberFormatter.format(totalRecord),
			numberFormatter.format(totalAmount)
		)
	}

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
					{totalElement()}
				</Descriptions>
			</Spin>
		</LayoutContent.Card>
	)
}

export { DrawPrizeOverviewTable }

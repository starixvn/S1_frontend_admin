import { Descriptions, Space, Spin, Typography } from 'antd'
import { CustomDivider } from 'features/redemptionListing/RedemptionOverviewTable'
import { numberFormatter } from 'common/utils/format'
import { reduce } from 'lodash'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { IVipRebateCurrencyInfoData } from 'features/vipRebateReport/type'

const { Text } = Typography

interface IVipRebateReportOverviewTableProps {
	currencyInfo: IVipRebateCurrencyInfoData[]
	loading: boolean
}

const itemRenderer = (
	label: string,
	totalRecord: string,
	totalAmount: string
) => (
	<Descriptions.Item
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

const VipRebateReportOverviewTable = ({
	currencyInfo,
	loading,
}: IVipRebateReportOverviewTableProps) => {
	const { t } = useTranslation()
	const titleElement = () =>
		itemRenderer('', t('Label_Record'), t('Label_Amount'))

	const overviewElements = () =>
		currencyInfo.map(({ currencyName, siteName, totalRecord, totalAmount }) =>
			itemRenderer(
				`${currencyName} (${siteName})`,
				numberFormatter.format(totalRecord),
				numberFormatter.format(totalAmount)
			)
		)

	const totalElement = () => {
		const totalRecord = reduce(
			currencyInfo,
			(sum, current) => sum + current.totalRecord,
			0
		)
		const totalPointEarned = reduce(
			currencyInfo,
			(sum, current) => sum + current.totalAmount,
			0
		)
		return itemRenderer(
			t('Label_Total'),
			numberFormatter.format(totalRecord),
			numberFormatter.format(totalPointEarned)
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
					{overviewElements()}
					{totalElement()}
				</Descriptions>
			</Spin>
		</LayoutContent.Card>
	)
}

export default VipRebateReportOverviewTable

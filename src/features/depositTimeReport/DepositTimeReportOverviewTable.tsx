import { Spin, Descriptions, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter } from 'common/utils/format'
import { ICurrencyAmountRecordData } from 'features/depositTimeReport/type'

const { Text } = Typography

interface IDepositTimeReportOverviewTableProps {
	loading: boolean
	currencyAmountData: ICurrencyAmountRecordData[]
}

const itemRenderer = (label: string, totalRecord: string) => (
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
		</Space>
	</Descriptions.Item>
)

const DepositTimeReportOverviewTable = ({
	loading,
	currencyAmountData,
}: IDepositTimeReportOverviewTableProps) => {
	const { t } = useTranslation()

	const titleElement = () => itemRenderer('', t('Label_Record'))

	const recordElement = () =>
		currencyAmountData?.map(({ currency, record }) =>
			itemRenderer(currency, numberFormatter.format(record))
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

export { DepositTimeReportOverviewTable }

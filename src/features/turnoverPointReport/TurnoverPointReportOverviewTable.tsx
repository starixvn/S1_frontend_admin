import { FC } from 'react'
import { ITurnoverPointOverviewData } from 'features/turnoverPointReport/type'
import { Descriptions, Space, Spin, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { CustomDivider } from 'features/redemptionListing/RedemptionOverviewTable'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { reduce } from 'lodash'

interface ITurnoverPointReportOverviewTableProps {
	loading: boolean
	turnoverPointReportOverviewData: ITurnoverPointOverviewData[]
}

const { Text } = Typography

const itemRenderer = (
	label: string,
	totalRecord: string,
	totalPointEarned: string
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
			<Text>{totalPointEarned}</Text>
		</Space>
	</Descriptions.Item>
)

const TurnoverPointReportOverviewTable: FC<
	ITurnoverPointReportOverviewTableProps
> = ({ loading, turnoverPointReportOverviewData }) => {
	const { t } = useTranslation()

	const titleElement = () =>
		itemRenderer('', t('Label_Record'), t('Label_PointEarned'))

	const overviewElements = () =>
		turnoverPointReportOverviewData.map(item =>
			itemRenderer(
				item.isoCode,
				numberFormatter.format(item.totalRecord),
				numberFormatter.format(item.totalPointEarned)
			)
		)

	const totalElement = () => {
		const totalRecord = reduce(
			turnoverPointReportOverviewData,
			(sum, current) => sum + current.totalRecord,
			0
		)
		const totalPointEarned = reduce(
			turnoverPointReportOverviewData,
			(sum, current) => sum + current.totalPointEarned,
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

export { TurnoverPointReportOverviewTable }

import { FC } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Descriptions, Space, Spin, Typography } from 'antd'
import { numberFormatter } from 'common/utils/format'
import { reduce } from 'lodash'
import { useTranslation } from 'react-i18next'
import { IDepositPointReportOverviewData } from './type'
import { CustomDivider } from '../redemptionListing/RedemptionOverviewTable'

interface IDepositPointReportOverviewTableProps {
	depositPointOverviewData: IDepositPointReportOverviewData[]
	loading: boolean
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

const DepositPointReportOverviewTable: FC<
	IDepositPointReportOverviewTableProps
> = ({ depositPointOverviewData, loading }) => {
	const { t } = useTranslation()
	const titleElement = () =>
		itemRenderer('', t('Label_Record'), t('Label_PointEarned'))

	const overviewElements = () =>
		depositPointOverviewData.map(item =>
			itemRenderer(
				item.isoCode,
				numberFormatter.format(item.totalRecord),
				numberFormatter.format(item.totalPointEarned)
			)
		)

	const totalElement = () => {
		const totalRecord = reduce(
			depositPointOverviewData,
			(sum, current) => sum + current.totalRecord,
			0
		)
		const totalPointEarned = reduce(
			depositPointOverviewData,
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

export { DepositPointReportOverviewTable }

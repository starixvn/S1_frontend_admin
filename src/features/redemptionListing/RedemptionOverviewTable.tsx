import { FC } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Descriptions, Space, Spin, Typography } from 'antd'
import styled from 'styled-components'
import { numberFormatter } from 'common/utils/format'
import { reduce } from 'lodash'
import { useTranslation } from 'react-i18next'
import { IGetRedemptionOverviewData } from './type'

interface IRedemptionOverviewProps {
	redemptionOverviewData: IGetRedemptionOverviewData[]
	loading: boolean
}

const CustomDivider = styled.div`
	height: 0.5px;
	width: 100%;
	background-color: rgba(192, 192, 192, 0.29);
`
const { Text } = Typography
const itemRenderer = (
	label: string,
	totalRecord: string,
	totalPoint: string,
	totalCost: string
) => (
	<Descriptions.Item
		label={label}
		style={{
			textAlign: 'center',
			paddingLeft: 0,
			paddingRight: 0,
			minWidth: '80px',
		}}
		span={1}
	>
		<Space direction='vertical' style={{ width: '100%' }}>
			<Text>{totalRecord}</Text>
			<CustomDivider />
			<Text>{totalPoint}</Text>
			<CustomDivider />
			<Text>{totalCost}</Text>
		</Space>
	</Descriptions.Item>
)

const RedemptionOverviewTable: FC<IRedemptionOverviewProps> = ({
	redemptionOverviewData,
	loading,
}) => {
	const { t } = useTranslation()
	const titleElement = () =>
		itemRenderer(
			'',
			t('Label_Record'),
			t('Label_TotalPoint'),
			t('Label_TotalCost')
		)
	const overviewElements = () =>
		redemptionOverviewData.map(item =>
			itemRenderer(
				item.isoCode,
				numberFormatter.format(item.totalRecord),
				numberFormatter.format(item.totalPoint),
				numberFormatter.format(item.totalCost)
			)
		)

	const totalElement = () => {
		const totalRecord = reduce(
			redemptionOverviewData,
			(sum, current) => sum + current.totalRecord,
			0
		)
		const totalPoint = reduce(
			redemptionOverviewData,
			(sum, current) => sum + current.totalPoint,
			0
		)
		const totalCost = reduce(
			redemptionOverviewData,
			(sum, current) => sum + current.totalCost,
			0
		)
		return itemRenderer(
			t('Label_Total'),
			numberFormatter.format(totalRecord),
			numberFormatter.format(totalPoint),
			numberFormatter.format(totalCost)
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
						overflow: 'scroll',
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

export { RedemptionOverviewTable }

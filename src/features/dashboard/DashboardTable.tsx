import { useCallback } from 'react'
import { Col, Row, Table } from 'antd'
import { Statistic } from 'components'
import { LayoutContent } from 'app/pages/layout'

import { DashBoardData } from './type'

const columns = [
	{
		title: 'reportName',
		dataIndex: 'reportName',
		width: 150,
	},
	{
		title: 'ggr',
		dataIndex: 'ggr',
		width: 80,
		align: 'center' as 'center',
	},
	{
		title: 'margin',
		dataIndex: 'margin',
		width: 80,
		align: 'center' as 'center',
	},
	{
		title: 'netCash',
		dataIndex: 'netCash',
		width: 80,
		align: 'center' as 'center',
	},
	{
		title: 'netRevenue',
		dataIndex: 'netRevenue',
		width: 120,
		align: 'center' as 'center',
	},
	{
		title: 'noAdjustmentAmount',
		dataIndex: 'noAdjustmentAmount',
		width: 180,
		align: 'center' as 'center',
	},
	{
		title: 'noAdjustmentPlayers',
		dataIndex: 'noAdjustmentPlayers',
		align: 'center' as 'center',
		width: '140px',
	},
	{
		title: 'noPlayer',
		dataIndex: 'noPlayer',
		width: '140px',
		align: 'center' as 'center',
	},
	{
		title: 'totalBonus',
		dataIndex: 'totalBonus',
		width: '140px',
		align: 'center' as 'center',
	},
	{
		title: 'totalDeposit',
		dataIndex: 'totalDeposit',
		width: '140px',
		align: 'center' as 'center',
	},
	{
		title: 'totalWithdrawal',
		dataIndex: 'totalWithdrawal',
		width: '140px',
		align: 'center' as 'center',
	},
	{
		title: 'vaildTurnover',
		dataIndex: 'vaildTurnover',
		width: '140px',
		align: 'center' as 'center',
	},
]

const DashboardTable = ({
	loading,
	dashboardData,
}: {
	loading: boolean | undefined
	dashboardData: DashBoardData
}) => {
	const {
		onlinePlayers,
		todayNewRegPlayers,
		totalRegPlayers,
		pendingDeposit,
		pendingWithdrawal,
		todayData,
	} = dashboardData

	const MemoizedTitle = useCallback(
		() => (
			<Row justify='space-around'>
				<Col>
					<Statistic title='onlinePlayers' value={onlinePlayers} />
				</Col>
				<Col>
					<Statistic title='todayNewRegPlayers' value={todayNewRegPlayers} />
				</Col>
				<Col>
					<Statistic title='totalRegPlayers' value={totalRegPlayers} />
				</Col>
				<Col>
					<Statistic title='pendingDeposit' value={pendingDeposit} />
				</Col>
				<Col>
					<Statistic title='pendingWithdrawal' value={pendingWithdrawal} />
				</Col>
			</Row>
		),
		[
			onlinePlayers,
			todayNewRegPlayers,
			totalRegPlayers,
			pendingDeposit,
			pendingWithdrawal,
		]
	)

	return (
		<LayoutContent.Card>
			<Table
				title={MemoizedTitle}
				bordered
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={todayData}
				rowKey={({ reportName }) => reportName}
			/>
		</LayoutContent.Card>
	)
}

export { DashboardTable }

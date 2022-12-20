import React from 'react'
import { Spin, Tabs } from 'antd'
import { isEmpty } from 'lodash'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import GameStatisticalReportPanel from './GameStatisticalReportPanel'
import { IGameStatisticalReportData } from './type'

interface IGameStatisticalReport {
	loading: boolean
	onTabsChange: (TabsKey: string) => void
	tabActiveKey?: string
	gameStatisticalReportData: IGameStatisticalReportData[]
}

const GameStatisticalReportTab = ({
	tabActiveKey,
	loading,
	gameStatisticalReportData,
	onTabsChange,
}: IGameStatisticalReport) => {
	const filterGameStatisticalReport = (key: number) => {
		const filtered = gameStatisticalReportData.filter(
			item => item.currencyId === key
		)
		return filtered.values().next().value?.categoryDetail
	}
	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
				{!isEmpty(gameStatisticalReportData) ? (
					<Tabs
						type='card'
						onChange={onTabsChange}
						activeKey={tabActiveKey}
						items={gameStatisticalReportData.map(item => {
							return {
								label: `${item.currencyName}`,
								key: String(item.currencyId),
								children: (
									<GameStatisticalReportPanel
										loading={loading}
										filterGameStatisticalReport={filterGameStatisticalReport(
											item.currencyId
										)}
									/>
								),
							}
						})}
					/>
				) : (
					/* 空資料時顯示空table  */
					<Table />
				)}
			</LayoutContent.Card>
		</Spin>
	)
}

export default GameStatisticalReportTab

import React from 'react'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { Row, Col, Card } from 'antd'
import { ICategoryDetailData } from './type'

interface IGameStatisticalReportProps {
	loading: boolean
	filterGameStatisticalReport: ICategoryDetailData[]
}

const GameStatisticalReportPanel = ({
	loading,
	filterGameStatisticalReport,
}: IGameStatisticalReportProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Product'),
			key: 'gameTypeName',
			dataIndex: 'gameTypeName',
			align: 'center' as 'center',
			render: (gameTypeName: string) => gameTypeName || '-',
		},
		{
			title: t('Label_Game'),
			key: 'gameName',
			dataIndex: 'gameName',
			align: 'center' as 'center',
			render: (gameName: string) => gameName || '-',
		},
		{
			title: t('Label_UniquePlayers'),
			key: 'uniquePlayers',
			dataIndex: 'uniquePlayers',
			align: 'center' as 'center',
			render: (uniquePlayers: number) => uniquePlayers ?? 'N/A',
		},
		{
			title: t('Label_TurnOver'),
			key: 'validBetSummary',
			dataIndex: 'validBetSummary',
			align: 'center' as 'center',
			render: (validBetSummary: number) => validBetSummary ?? 'N/A',
		},
		{
			title: t('Label_WinLoss'),
			key: 'winLossSummary',
			dataIndex: 'winLossSummary',
			align: 'center' as 'center',
			render: (winLossSummary: number) => winLossSummary ?? 'N/A',
		},
	]

	return (
		<Row align='stretch' gutter={[16, 16]}>
			{filterGameStatisticalReport?.map(item => {
				return (
					<Col
						flex='auto'
						xs={24}
						sm={24}
						md={24}
						lg={12}
						xl={12}
						key={item.categoryId}
					>
						<Card
							title={item.categoryName}
							style={{
								textAlign: 'center',
								height: '100%',
							}}
						>
							<Table
								loading={loading}
								columns={columns}
								dataSource={item.gameDetail ?? []}
								size='middle'
								pagination={false}
								scroll={{ y: 'calc(100vh - 300px)' }}
							/>
						</Card>
					</Col>
				)
			})}
		</Row>
	)
}

export default GameStatisticalReportPanel

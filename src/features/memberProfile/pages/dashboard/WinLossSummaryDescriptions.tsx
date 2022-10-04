import { Col, Descriptions, Row, Space, Spin, Typography } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IWinLossSummaryData } from 'features/memberProfile/type'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface IWinLossSummaryDescriptionsProps {
	custId: number
	loading: boolean
	winLossSummaries: IWinLossSummaryData[]
}

const WinLossSummaryDescriptions = ({
	custId,
	loading,
	winLossSummaries,
}: IWinLossSummaryDescriptionsProps) => {
	const { t } = useTranslation()

	return (
		<>
			<Row align='middle' justify='space-between' style={{ height: '36px' }}>
				<Col>
					<Typography.Title style={{ margin: 0 }} level={5}>
						{`${t('Label_WinLossSummary')}:`}
					</Typography.Title>
				</Col>

				<Col>
					<Space>
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/game/winLoseSummary/${custId}`}
						>
							{t('Label_More')}
						</Link>
					</Space>
				</Col>
			</Row>
			<br />

			<Spin spinning={loading}>
				<Descriptions layout='horizontal' bordered column={1} size='middle'>
					{winLossSummaries?.map(summary => (
						<Descriptions.Item label={summary.name} key={summary.categoryId}>
							{summary.winlostAmount}
						</Descriptions.Item>
					))}
				</Descriptions>
			</Spin>

			<br />
		</>
	)
}

export default WinLossSummaryDescriptions

import { useSearchParams, Link } from 'react-router-dom'
import { isEmpty, isNull } from 'lodash'
import paths from 'app/constants/paths'
import { PermissionInterface } from 'type'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { useTranslation } from 'react-i18next'
import { CustomStatistic } from 'components'
import { numberFormatter } from 'common/utils/format'
import { Collapse, Col, Card, Row, Typography, Spin, Empty } from 'antd'
import { IPerformanceHighlightData } from 'features/marketing/type'
import { ExcelExportButton } from 'features/marketing/components/ExcelExportButton'

interface MpaMarketingStatisticProps {
	loading: boolean
	exportExcelPermission?: PermissionInterface
	performanceHighlightData: IPerformanceHighlightData
	onExportClick: () => void
}

const { Panel } = Collapse
const { Text, Title } = Typography

const MarketingStatistic = ({
	loading,
	exportExcelPermission,
	performanceHighlightData,
	onExportClick,
}: MpaMarketingStatisticProps) => {
	const { t } = useTranslation()
	const [searchParams] = useSearchParams()

	// 由於 performanceHighlightData 是物件格式並包含了些不需要顯示的參數 故這裡直接拿取所需要的顯示
	return (
		<Spin spinning={loading}>
			<Collapse defaultActiveKey={1} style={{ marginTop: 36 }}>
				<Panel header={t('Label_BusinessPerformanceHighlights')} key='1'>
					{!isEmpty(performanceHighlightData) && (
						<ExcelExportButton
							onClick={onExportClick}
							disabled={!exportExcelPermission?.canUse}
						/>
					)}
					{loading ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					) : (
						<LayoutContent.Card style={{ margin: 0 }}>
							<Row gutter={[16, 16]}>
								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card
										bodyStyle={{ padding: '10px' }}
										style={{
											borderRadius: '5px',
											overflow: 'hidden',
											border: '3px solid rgba(0, 0, 0, 0.05)',
											height: 160,
										}}
									>
										<Row gutter={[0, 8]}>
											<Col span={24}>
												<Title
													level={5}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
														whiteSpace: 'nowrap',
													}}
												>
													{t('Label_TotalUsers')}
												</Title>
											</Col>
											<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
												<Text>{t('Label_AsOfNow')}</Text>
											</Col>
											<Col span={24} style={{ textAlign: 'center' }}>
												<Text
													strong
													style={{ fontSize: 24, whiteSpace: 'nowrap' }}
												>
													{numberFormatter.format(
														performanceHighlightData.totalUsers
													)}
												</Text>
											</Col>
										</Row>
									</Card>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card
										bodyStyle={{ padding: '10px' }}
										style={{
											borderRadius: '5px',
											overflow: 'hidden',
											border: '3px solid rgba(0, 0, 0, 0.05)',
											height: 160,
										}}
									>
										<Row gutter={[0, 8]}>
											<Col span={24}>
												<Title
													style={{
														fontWeight: 'bold',
														fontSize: 15,
														whiteSpace: 'nowrap',
													}}
												>
													{t('Label_TotalDepositUsers')}
												</Title>
											</Col>
											<Col
												span={24}
												style={{
													marginTop: -8,
													fontSize: 12,
												}}
											>
												<Text>{t('Label_AsOfNow')}</Text>
											</Col>
											<Col span={24} style={{ textAlign: 'center' }}>
												<Text
													strong
													style={{ fontSize: 24, whiteSpace: 'nowrap' }}
												>
													{numberFormatter.format(
														performanceHighlightData.totalDepositUsers
													)}
												</Text>
											</Col>
										</Row>
									</Card>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card
										bodyStyle={{ padding: '10px' }}
										style={{
											borderRadius: '5px',
											overflow: 'hidden',
											border: '3px solid rgba(0, 0, 0, 0.05)',
											height: 160,
										}}
									>
										<Row gutter={[0, 8]}>
											<Col span={24}>
												<Title
													level={5}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
														whiteSpace: 'nowrap',
													}}
												>
													{t('Label_TotalActiveUsers')}
												</Title>
											</Col>
											<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
												<Text>{t('Label_AsOfNow')}</Text>
											</Col>
											<Col span={24} style={{ textAlign: 'center' }}>
												<Text
													strong
													style={{ fontSize: 24, whiteSpace: 'nowrap' }}
												>
													{numberFormatter.format(
														performanceHighlightData.activeUsers
													)}
												</Text>
											</Col>
										</Row>
									</Card>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card
										bodyStyle={{ padding: '10px' }}
										style={{
											borderRadius: '5px',
											overflow: 'hidden',
											border: '3px solid rgba(0, 0, 0, 0.05)',
											height: 160,
										}}
									>
										<Row gutter={[0, 8]}>
											<Col span={24}>
												<Title
													level={5}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
														whiteSpace: 'nowrap',
													}}
												>
													{t('Label_PU(APA)')}
												</Title>
											</Col>
											<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
												<Text>{t('Label_DepositUsers')}</Text>
											</Col>
											<Col span={24} style={{ textAlign: 'center' }}>
												<Text
													strong
													style={{ fontSize: 24, whiteSpace: 'nowrap' }}
												>
													{numberFormatter.format(
														performanceHighlightData.depositUsers
													)}
												</Text>
											</Col>
											{/* 沒有選 Compare Date, api 回傳是 null  */}
											{!isNull(
												performanceHighlightData.depositUsersComparedRate
											) && (
												<Col span={24} style={{ marginTop: 12 }}>
													<Row
														gutter={[0, 16]}
														align='bottom'
														justify='space-between'
													>
														<Col>
															<Text>{t('Label_CompareDate')}</Text>
														</Col>
														<Col>
															<CustomStatistic
																value={Number(
																	performanceHighlightData.depositUsersComparedRate
																)}
																precision={0}
															/>
														</Col>
													</Row>
												</Col>
											)}
										</Row>
									</Card>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card
										bodyStyle={{ padding: '10px' }}
										style={{
											borderRadius: '5px',
											overflow: 'hidden',
											border: '3px solid rgba(0, 0, 0, 0.05)',
											height: 160,
										}}
									>
										<Row gutter={[0, 8]}>
											<Col span={24}>
												<Title
													level={5}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
														whiteSpace: 'nowrap',
													}}
												>
													{t('Label_AU')}
												</Title>
											</Col>
											<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
												<Text>{t('Label_ActiveUsers')}</Text>
											</Col>
											<Col span={24} style={{ textAlign: 'center' }}>
												<Text
													strong
													style={{ fontSize: 24, whiteSpace: 'nowrap' }}
												>
													{numberFormatter.format(
														performanceHighlightData.activeUsers
													)}
												</Text>
											</Col>
											{/* 沒有選 Compare Date, api 回傳是 null  */}
											{!isNull(
												performanceHighlightData.activeUsersComparedRate
											) && (
												<Col span={24} style={{ marginTop: 12 }}>
													<Row
														gutter={[0, 16]}
														align='bottom'
														justify='space-between'
													>
														<Col>
															<Text>{t('Label_CompareDate')}</Text>
														</Col>
														<Col>
															<CustomStatistic
																value={Number(
																	performanceHighlightData.activeUsersComparedRate
																)}
																precision={0}
															/>
														</Col>
													</Row>
												</Col>
											)}
										</Row>
									</Card>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Link
										to={`/${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.root}/nru?${searchParams}`}
										target='_blank'
									>
										<Card
											bodyStyle={{ padding: '10px' }}
											style={{
												borderRadius: '5px',
												overflow: 'hidden',
												border: '3px solid rgba(0, 0, 0, 0.05)',
												height: 160,
											}}
											hoverable
										>
											<Row gutter={[0, 8]}>
												<Col span={24}>
													<Title
														level={5}
														style={{ fontWeight: 'bold', fontSize: 15 }}
													>
														{t('Label_NRU')}
													</Title>
												</Col>
												<Col
													span={24}
													style={{
														marginTop: -8,
														fontSize: 12,
														whiteSpace: 'nowrap',
													}}
												>
													<Text>{t('Label_NewlyRegisteredUsers')}</Text>
												</Col>
												<Col span={24} style={{ textAlign: 'center' }}>
													<Text
														strong
														style={{ fontSize: 24, whiteSpace: 'nowrap' }}
													>
														{numberFormatter.format(
															performanceHighlightData.nru
														)}
													</Text>
												</Col>
												{/* 沒有選 Compare Date, api 回傳是 null  */}
												{!isNull(performanceHighlightData.nruComparedRate) && (
													<Col span={24} style={{ marginTop: 12 }}>
														<Row
															gutter={[0, 16]}
															align='bottom'
															justify='space-between'
														>
															<Col>
																<Text>{t('Label_CompareDate')}</Text>
															</Col>
															<Col>
																<CustomStatistic
																	value={Number(
																		performanceHighlightData.nruComparedRate
																	)}
																	precision={0}
																/>
															</Col>
														</Row>
													</Col>
												)}
											</Row>
										</Card>
									</Link>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card
										bodyStyle={{ padding: '10px' }}
										style={{
											borderRadius: '5px',
											overflow: 'hidden',
											border: '3px solid rgba(0, 0, 0, 0.05)',
											height: 160,
										}}
									>
										<Row gutter={[0, 8]}>
											<Col span={24}>
												<Title
													level={5}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
														whiteSpace: 'nowrap',
													}}
												>
													{t('Label_ActiveNRU')}
												</Title>
											</Col>
											<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
												<Text> </Text>
											</Col>
											<Col span={24} style={{ textAlign: 'center' }}>
												<Text
													strong
													style={{ fontSize: 24, whiteSpace: 'nowrap' }}
												>
													{numberFormatter.format(
														performanceHighlightData.activeNRU
													)}
												</Text>
											</Col>
											{/* 沒有選 Compare Date, api 回傳是 null  */}
											{!isNull(
												performanceHighlightData.activeNRUComparedRate
											) && (
												<Col span={24} style={{ marginTop: 24 }}>
													<Row
														gutter={[0, 16]}
														align='bottom'
														justify='space-between'
													>
														<Col>
															<Text>{t('Label_CompareDate')}</Text>
														</Col>
														<Col>
															<CustomStatistic
																value={Number(
																	performanceHighlightData.activeNRUComparedRate
																)}
																precision={0}
															/>
														</Col>
													</Row>
												</Col>
											)}
										</Row>
									</Card>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Link
										to={`/${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.root}/depositAmount?${searchParams}`}
										target='_blank'
									>
										<Card
											bodyStyle={{ padding: '10px' }}
											style={{
												borderRadius: '5px',
												overflow: 'hidden',
												border: '3px solid rgba(0, 0, 0, 0.05)',
												height: 160,
											}}
											hoverable
										>
											<Row gutter={[0, 8]}>
												<Col span={24}>
													<Title
														level={5}
														style={{
															fontWeight: 'bold',
															fontSize: 15,
															whiteSpace: 'nowrap',
														}}
													>
														{t('Label_DepositAmount')}
													</Title>
												</Col>
												<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
													<Text> </Text>
												</Col>
												<Col span={24} style={{ textAlign: 'center' }}>
													<Text
														strong
														style={{ fontSize: 24, whiteSpace: 'nowrap' }}
													>
														{numberFormatter.format(
															performanceHighlightData.depositAmount
														)}
													</Text>
												</Col>
												{/* 沒有選 Compare Date, api 回傳是 null  */}
												{!isNull(
													performanceHighlightData.depositAmountComparedRate
												) && (
													<Col span={24} style={{ marginTop: 24 }}>
														<Row
															gutter={[0, 16]}
															align='bottom'
															justify='space-between'
														>
															<Col>
																<Text>{t('Label_CompareDate')}</Text>
															</Col>
															<Col>
																<CustomStatistic
																	value={Number(
																		performanceHighlightData.depositAmountComparedRate
																	)}
																	precision={0}
																/>
															</Col>
														</Row>
													</Col>
												)}
											</Row>
										</Card>
									</Link>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Link
										to={`/${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.root}/withdrawalAmount?${searchParams}`}
										target='_blank'
									>
										<Card
											bodyStyle={{ padding: '10px' }}
											style={{
												borderRadius: '5px',
												overflow: 'hidden',
												border: '3px solid rgba(0, 0, 0, 0.05)',
												height: 160,
											}}
											hoverable
										>
											<Row gutter={[0, 8]}>
												<Col span={24}>
													<Title
														level={5}
														style={{
															fontWeight: 'bold',
															fontSize: 15,
															whiteSpace: 'nowrap',
														}}
													>
														{t('Label_WithdrawalAmount')}
													</Title>
												</Col>
												<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
													<Text> </Text>
												</Col>
												<Col span={24} style={{ textAlign: 'center' }}>
													<Text
														strong
														style={{ fontSize: 24, whiteSpace: 'nowrap' }}
													>
														{numberFormatter.format(
															performanceHighlightData.withdrawalAmount
														)}
													</Text>
												</Col>
												{/* 沒有選 Compare Date, api 回傳是 null  */}
												{!isNull(
													performanceHighlightData.withdrawalAmountComparedRate
												) && (
													<Col span={24} style={{ marginTop: 24 }}>
														<Row
															gutter={[0, 16]}
															align='bottom'
															justify='space-between'
														>
															<Col>
																<Text>{t('Label_CompareDate')}</Text>
															</Col>
															<Col>
																<CustomStatistic
																	value={Number(
																		performanceHighlightData.withdrawalAmountComparedRate
																	)}
																	precision={0}
																/>
															</Col>
														</Row>
													</Col>
												)}
											</Row>
										</Card>
									</Link>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Link
										to={`/${NEW_SITE_PREFIX_URL}/${paths.report.sub.mpaMarketingReport.root}/bonusAmountClaimed?${searchParams}`}
										target='_blank'
									>
										<Card
											bodyStyle={{ padding: '10px' }}
											style={{
												borderRadius: '5px',
												overflow: 'hidden',
												border: '3px solid rgba(0, 0, 0, 0.05)',
												height: 160,
											}}
											hoverable
										>
											<Row gutter={[0, 8]}>
												<Col span={24}>
													<Title
														level={5}
														style={{
															fontWeight: 'bold',
															fontSize: 15,
															whiteSpace: 'nowrap',
														}}
													>
														{t('Label_BonusAmountClaimed')}
													</Title>
												</Col>
												<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
													<Text> </Text>
												</Col>
												<Col span={24} style={{ textAlign: 'center' }}>
													<Text
														strong
														style={{ fontSize: 24, whiteSpace: 'nowrap' }}
													>
														{numberFormatter.format(
															performanceHighlightData.bonusAmountClaimed
														)}
													</Text>
												</Col>
												{/* 沒有選 Compare Date, api 回傳是 null  */}
												{!isNull(
													performanceHighlightData.bonusAmountClaimedComparedRate
												) && (
													<Col span={24} style={{ marginTop: 24 }}>
														<Row
															gutter={[0, 16]}
															align='bottom'
															justify='space-between'
														>
															<Col>
																<Text>{t('Label_CompareDate')}</Text>
															</Col>
															<Col>
																<CustomStatistic
																	value={Number(
																		performanceHighlightData.bonusAmountClaimedComparedRate
																	)}
																	precision={0}
																/>
															</Col>
														</Row>
													</Col>
												)}
											</Row>
										</Card>
									</Link>
								</Col>

								<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
									<Card
										bodyStyle={{ padding: '10px' }}
										style={{
											borderRadius: '5px',
											overflow: 'hidden',
											border: '3px solid rgba(0, 0, 0, 0.05)',
											height: 160,
										}}
									>
										<Row gutter={[0, 8]}>
											<Col span={24}>
												<Title
													level={5}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
														whiteSpace: 'nowrap',
													}}
												>
													{t('Label_NetCashAmount')}
												</Title>
											</Col>
											<Col span={24} style={{ marginTop: -8, fontSize: 12 }}>
												<Text> </Text>
											</Col>
											<Col span={24} style={{ textAlign: 'center' }}>
												<Text
													strong
													style={{ fontSize: 24, whiteSpace: 'nowrap' }}
												>
													{numberFormatter.format(
														performanceHighlightData.netCashAmount
													)}
												</Text>
											</Col>
											{/* 沒有選 Compare Date, api 回傳是 null  */}
											{!isNull(
												performanceHighlightData.netCashAmountComparedRate
											) && (
												<Col span={24} style={{ marginTop: 24 }}>
													<Row
														gutter={[0, 16]}
														align='bottom'
														justify='space-between'
													>
														<Col>
															<Text>{t('Label_CompareDate')}</Text>
														</Col>
														<Col>
															<CustomStatistic
																value={Number(
																	performanceHighlightData.netCashAmountComparedRate
																)}
																precision={0}
															/>
														</Col>
													</Row>
												</Col>
											)}
										</Row>
									</Card>
								</Col>
							</Row>
						</LayoutContent.Card>
					)}
				</Panel>
			</Collapse>
		</Spin>
	)
}

export default MarketingStatistic

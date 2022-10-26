import { LayoutContent } from 'app/pages/layout'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import {
	Col,
	Descriptions,
	Divider,
	Form,
	Row,
	Spin,
	TablePaginationConfig,
} from 'antd'
import { useParams } from 'react-router-dom'
import {
	useGetBonusWalletDetailQuery,
	useGetBonusWalletInfoQuery,
	useGetCustTpWalletQuery,
	useGetDeviceListQuery,
	useLazyGetFinancialLogsQuery,
	useGetIpCountListQuery,
	useGetTodayInfoQuery,
	useGetWalletBalanceInfoQuery,
	useGetWinLoseSummariesQuery,
	useGetWinLossInfoQuery,
} from 'features/memberProfile/api'
import { numberFormatter } from 'common/utils/format'
import { useTimeZone } from 'components/TimeZoneSelect'
import { IFinancialLogsResponse } from 'features/memberProfile/type'
import { PAGINATION, usePagination } from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useEffect } from 'react'
import { AffixButtons } from 'components/AffixButtons'
import FinancialLogsTable from './FinancialLogsTable'
import WinLossSummaryDescriptions from './WinLossSummaryDescriptions'
import IpCountsTable from './IpCountsTable'
import DeviceListTable from './DeviceListTable'
import TodayInfoDescriptions from './TodayInfoDescriptions'
import TpWalletDescriptions from './TpWalletDescriptions'
import BonusWalletDescriptions from './BonusWalletDescriptions'
import WinLossInfoDescriptions from './WinLossInfoDescriptions'

const Dashboard = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const { timeZoneUtcOffset } = useTimeZone()
	const [financialLogsForm] = Form.useForm<{ financialType: number }>()

	const {
		data: { data: todayInfoData } = {},
		isFetching: isGetTodayInfoFetching,
	} = useGetTodayInfoQuery({ custId })

	const {
		// * 固定回傳長度 1 的資料陣列
		data: { data: bonusWalletInfos = [] } = {},
		isFetching: isGetBonusWalletInfoFetching,
	} = useGetBonusWalletInfoQuery({ custId })

	const {
		data: { data: bonusWalletDetailData } = {},
		isFetching: isGetBonusWalletDetailFetching,
	} = useGetBonusWalletDetailQuery({ custId })

	const {
		data: { data: tpWalletData } = {},
		isFetching: isGetCustTpWalletFetching,
	} = useGetCustTpWalletQuery({ custId })

	const {
		data: { data: walletBalanceInfo } = {},
		isFetching: isGetWalletBalanceInfoFetching,
	} = useGetWalletBalanceInfoQuery({ custId })

	const {
		data: { data: winLossInfo } = {},
		isFetching: isGetWinLossInfoFetching,
	} = useGetWinLossInfoQuery({ custId })

	const {
		data: { data: winLossSummaries } = {},
		isFetching: isGetWinLossSummaryFetching,
	} = useGetWinLoseSummariesQuery({ custId })

	const {
		data: { data: ipCountList } = {},
		isFetching: isGetIpCountListFetching,
	} = useGetIpCountListQuery({ custId })

	const {
		data: { data: deviceList } = {},
		isFetching: isGetDeviceListFetching,
	} = useGetDeviceListQuery({ custId })

	const [
		getFinancialLogs,
		{
			data: {
				data: financialLogs = [],
				rowCount: financialLogsTotal = 0,
			} = {} as IFinancialLogsResponse,
			isFetching: isGetFinancialLogsFetching,
		},
	] = useLazyGetFinancialLogsQuery()

	const [financialLogsPagination, setFinancialLogsPagination] = usePagination({
		paginationTotal: financialLogsTotal,
	})

	const handleFinancialLogsSearch = ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}) => {
		const { financialType } = financialLogsForm.getFieldsValue()

		// * 只抓 3 天的資料顯示
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[moment().subtract(2, 'days').startOf('day'), moment().endOf('day')],
			0
		)

		getFinancialLogs({
			pageNumber: current,
			pageSize,
			custId,
			financialType,
			startDate,
			endDate,
		}).unwrap()

		setFinancialLogsPagination(prev => ({ ...prev, current, pageSize }))
	}

	const isBonusWalletLoading =
		isGetBonusWalletInfoFetching || isGetBonusWalletDetailFetching

	useEffect(() => {
		handleFinancialLogsSearch({})
	}, [])

	return (
		<>
			<LayoutContent.Card>
				<Row align='top' gutter={8}>
					<Col xxl={12} xl={24} lg={24} md={24} xs={24}>
						<TodayInfoDescriptions
							loading={isGetTodayInfoFetching}
							todayInfoData={todayInfoData}
						/>
						<br />
					</Col>
					{/* TODO:目前還沒有此 Api 的公式，等後端提供 */}
					<Col xxl={12} xl={24} lg={24} md={24} xs={24}>
						<Descriptions size='small' layout='vertical' bordered column={4}>
							<Descriptions.Item label='NGR'>N/A</Descriptions.Item>
							<Descriptions.Item label='VOD'>N/A</Descriptions.Item>
							<Descriptions.Item label='Member'>N/A</Descriptions.Item>
							<Descriptions.Item label='Company Margin'>N/A</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>
				</Row>

				<Row align='top' gutter={8}>
					<Col xxl={6} xl={12} lg={12} md={12} xs={24}>
						<Spin spinning={isGetWalletBalanceInfoFetching}>
							<Descriptions
								size='small'
								layout='horizontal'
								bordered
								column={1}
								labelStyle={{ width: '50%' }}
							>
								<Descriptions.Item label={t('Label_WalletBalance')}>
									{numberFormatter.format(walletBalanceInfo?.balance ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_RemainingTurnover')}>
									{numberFormatter.format(
										walletBalanceInfo?.remainingTurnOver ?? 0
									)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_EligibleWithdrawal')}>
									{numberFormatter.format(
										walletBalanceInfo?.eligibleWithdrawal ?? 0
									)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_DepositSummary')}>
									{numberFormatter.format(walletBalanceInfo?.depositSum ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_WithdrawalSummary')}>
									{numberFormatter.format(walletBalanceInfo?.withdrawlSum ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_PaymentFee')}>
									{numberFormatter.format(walletBalanceInfo?.paymentFee ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_TotalAdjustment')}>
									{numberFormatter.format(
										walletBalanceInfo?.totalAdjustment ?? 0
									)}
								</Descriptions.Item>
							</Descriptions>
						</Spin>

						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<BonusWalletDescriptions
							loading={isBonusWalletLoading}
							// * bonusWalletInfoData 固定回傳長度 1 的資料
							bonusWalletInfoData={bonusWalletInfos[0] ?? {}}
							bonusWalletDetailData={bonusWalletDetailData}
						/>

						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<TpWalletDescriptions
							loading={isGetCustTpWalletFetching}
							tpWalletData={tpWalletData}
						/>

						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<WinLossInfoDescriptions
							loading={isGetWinLossInfoFetching}
							winLossInfo={winLossInfo}
						/>
						<br />
					</Col>
				</Row>
			</LayoutContent.Card>

			<Divider />

			<LayoutContent.Card>
				<Row align='top' gutter={8}>
					<Col lg={12} md={12} xs={12}>
						<WinLossSummaryDescriptions
							custId={custId}
							loading={isGetWinLossSummaryFetching}
							winLossSummaries={winLossSummaries ?? []}
						/>
					</Col>

					<Col lg={12} md={12} xs={12}>
						<FinancialLogsTable
							custId={custId}
							form={financialLogsForm}
							loading={isGetFinancialLogsFetching}
							dataSource={financialLogs}
							pagination={financialLogsPagination as TablePaginationConfig}
							onFinancialLogsSearch={handleFinancialLogsSearch}
						/>
					</Col>

					<Col lg={12} md={12} xs={12}>
						<IpCountsTable
							loading={isGetIpCountListFetching}
							ipCountList={ipCountList ?? []}
						/>
					</Col>

					<Col lg={12} md={12} xs={12}>
						<DeviceListTable
							loading={isGetDeviceListFetching}
							deviceList={deviceList ?? []}
							timeZoneUtcOffset={timeZoneUtcOffset}
						/>
					</Col>
				</Row>
			</LayoutContent.Card>

			<br />

			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</>
	)
}

export default Dashboard

import { LayoutContent } from 'app/pages/layout'
import moment from 'moment'
import paths from 'app/constants/paths'
import { useTranslation } from 'react-i18next'
import {
	Button,
	Col,
	Descriptions,
	Divider,
	Row,
	Select,
	Space,
	Spin,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { Link, useParams } from 'react-router-dom'
import {
	useGetBonusWalletDetailQuery,
	useGetBonusWalletInfoQuery,
	useGetCustTpWalletQuery,
	useGetDeviceListQuery,
	useGetIpCountListQuery,
	useGetTodayInfoQuery,
	useGetWalletBalanceInfoQuery,
	useGetWinLoseSummariesQuery,
	useGetWinLossInfoQuery,
} from 'features/memberProfile/api'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { useTimeZone } from 'components/TimeZoneSelect'
import { NEW_SITE_PREFIX_URL } from 'app/config'

const { Option } = Select

const paginationConfig: TablePaginationConfig = {
	hideOnSinglePage: true,
}

// NOTE: fake data, remove later
const dataSource = [
	{
		key: '1',
		name: 'Mike',
		age: 32,
		address: '10 Downing Street',
	},
	{
		key: '2',
		name: 'John',
		age: 42,
		address: '10 Downing Street',
	},
]

// NOTE: fake data, remove later
const columns = [
	{
		title: 'name',
		dataIndex: 'loginname',
		key: 'loginname',
	},
	{
		title: 'address',
		dataIndex: 'address',
		key: 'address',
	},
]

const Dashboard = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const { timeZoneUtcOffset } = useTimeZone()

	const {
		data: { data: todayInfoData } = {},
		isFetching: isGetTodayInfoFetching,
	} = useGetTodayInfoQuery({ custId })

	const {
		// * 固定回傳長度 1 的資料陣列
		data: { data: bonusWalletInfoData = [] } = {},
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

	const ipCountColumns = [
		{
			title: 'Ip',
			dataIndex: 'loginIp',
			key: 'loginIp',
		},
		{
			title: 'User Count',
			dataIndex: 'userCount',
			key: 'userCount',
		},
	]

	const deviceColumns = [
		{
			title: 'Device Id',
			dataIndex: 'deviceId',
			key: 'deviceId',
			align: 'center' as 'center',
			render: (deviceId: string) => (
				<div style={{ width: '80px' }}>{deviceId}</div>
			),
		},
		{
			title: 'Risk',
			dataIndex: 'risk',
			key: 'risk',
			align: 'center' as 'center',
		},
		{
			title: 'Frequency',
			dataIndex: 'frequency',
			key: 'frequency',
			width: '15%',
			align: 'center' as 'center',
		},
		{
			title: 'Associate Count',
			dataIndex: 'associateCount',
			key: 'associateCount',
			align: 'center' as 'center',
		},
		{
			title: 'last Used Time',
			dataIndex: 'lastUpdateTime',
			key: 'lastUpdateTime',
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime
					? moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
	]

	const {
		todayWinLoss = 0,
		todayDeposit = 0,
		todayWithdrawal = 0,
		todayBetting = 0,
	} = todayInfoData ?? {}

	const { bonus: bonusWallet = 0, remainingTurnover: bonusRollover = 0 } =
		bonusWalletInfoData[0] ?? {}

	const { custBonusSum, custRebateSum, custRewardSum } =
		bonusWalletDetailData ?? {}

	const isBonusWalletLoading =
		isGetBonusWalletInfoFetching || isGetBonusWalletDetailFetching

	return (
		<>
			<LayoutContent.Card>
				<Row align='top' gutter={16}>
					<Col xxl={12} xl={24} lg={24} md={24} xs={24}>
						<Spin spinning={isGetTodayInfoFetching}>
							<Descriptions
								layout='vertical'
								bordered
								column={4}
								size='default'
							>
								<Descriptions.Item label="Today's WinLoss">
									{numberFormatter.format(todayWinLoss)}
								</Descriptions.Item>
								<Descriptions.Item label="Today's Deposit">
									{numberFormatter.format(todayDeposit)}
								</Descriptions.Item>
								<Descriptions.Item label="Today's Withdrawal">
									{numberFormatter.format(todayWithdrawal)}
								</Descriptions.Item>
								<Descriptions.Item label="Today's Summary">
									{numberFormatter.format(todayBetting)}
								</Descriptions.Item>
							</Descriptions>
						</Spin>

						<br />
					</Col>
					{/* TODO:目前還沒有此 Api 的公式，等後端提供 */}
					<Col xxl={12} xl={24} lg={24} md={24} xs={24}>
						<Descriptions layout='vertical' bordered column={4} size='default'>
							<Descriptions.Item label='NGR'>34,023</Descriptions.Item>
							<Descriptions.Item label='VOD'>6x</Descriptions.Item>
							<Descriptions.Item label='Member '>1.5%</Descriptions.Item>
							<Descriptions.Item label='Company Margin'>1.5%</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>
				</Row>

				<Row align='top' gutter={16}>
					<Col xxl={6} xl={12} lg={12} md={12} xs={24}>
						<Spin spinning={isGetWalletBalanceInfoFetching}>
							<Descriptions
								layout='horizontal'
								bordered
								column={1}
								size='middle'
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
									{/* TODO: 等後端提供此參數 */}
									{numberFormatter.format(0)}
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
						<Spin spinning={isBonusWalletLoading}>
							<Descriptions
								layout='horizontal'
								bordered
								column={1}
								size='middle'
								labelStyle={{ width: '50%' }}
							>
								<Descriptions.Item label={t('Label_BonusWallet')}>
									{numberFormatter.format(bonusWallet)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_BonusRollover')}>
									{numberFormatter.format(bonusRollover)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_TotalBonus')}>
									{numberFormatter.format(custBonusSum?.totalBonus ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_TotalReward')}>
									{numberFormatter.format(
										custRewardSum?.custRewardTotalSum ?? 0
									)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_TotalRebate')}>
									{numberFormatter.format(
										custRebateSum?.custRebateTotalSum ?? 0
									)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_CancelBonus')}>
									{numberFormatter.format(custBonusSum?.cancelBonusAmount ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_RewardsPoint')}>
									{numberFormatter.format(custBonusSum?.rewardPoint ?? 0)}
								</Descriptions.Item>
							</Descriptions>
						</Spin>

						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<Spin spinning={isGetCustTpWalletFetching}>
							<Descriptions
								layout='horizontal'
								bordered
								column={1}
								size='middle'
								labelStyle={{ width: '50%' }}
							>
								<Descriptions.Item label={t('Label_TransferWallet')}>
									{numberFormatter.format(
										tpWalletData?.totalTpWalletBalance ?? 0
									)}
								</Descriptions.Item>

								{tpWalletData?.tpWalletList.map(({ tpName, tpId, balance }) => (
									<Descriptions.Item label={tpName} key={tpId}>
										{numberFormatter.format(balance ?? 0)}
									</Descriptions.Item>
								))}
							</Descriptions>
						</Spin>

						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<Spin spinning={isGetWinLossInfoFetching}>
							<Descriptions
								layout='horizontal'
								bordered
								column={1}
								size='middle'
								labelStyle={{ width: '50%' }}
							>
								<Descriptions.Item label={t('Label_WinLoss')}>
									{numberFormatter.format(winLossInfo?.winLoss ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_ValidBet')}>
									{numberFormatter.format(winLossInfo?.validBet ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_Winnings')}>
									{numberFormatter.format(winLossInfo?.winnings ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_Losses')}>
									{numberFormatter.format(winLossInfo?.losses ?? 0)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_OutstandingAmount')}>
									{numberFormatter.format(winLossInfo?.outstandingAmount ?? 0)}
								</Descriptions.Item>
							</Descriptions>
						</Spin>

						<br />
					</Col>
				</Row>
			</LayoutContent.Card>

			<Divider />

			<LayoutContent.Card>
				<Row align='top' gutter={16}>
					<Col lg={12} md={12} xs={12}>
						<Row align='middle' justify='space-between'>
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

						<Spin spinning={isGetWinLossSummaryFetching}>
							<Descriptions
								layout='horizontal'
								bordered
								column={1}
								size='middle'
							>
								{winLossSummaries?.map(summary => (
									<Descriptions.Item
										label={summary.name}
										key={summary.categoryId}
									>
										{summary.winlostAmount}
									</Descriptions.Item>
								))}
							</Descriptions>
						</Spin>

						<br />
					</Col>

					{/* TODO: Financial Feature  */}
					<Col lg={12} md={12} xs={12}>
						<Row align='middle' justify='space-between'>
							<Col>
								<Typography.Title style={{ margin: 0 }} level={5}>{`${t(
									'Label_Financial'
								)}:`}</Typography.Title>
							</Col>

							<Col>
								<Space>
									<Select defaultValue='lucy' style={{ width: 120 }}>
										<Option value='jack'>Jack</Option>
										<Option value='lucy'>Lucy</Option>
										<Option value='disabled' disabled>
											Disabled
										</Option>
										<Option value='Yiminghe'>yiminghe</Option>
									</Select>
									<Button style={{ width: '100%' }} type='primary'>
										Search
									</Button>
									<Link
										to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/financialLog/${custId}`}
									>
										{t('Label_More')}
									</Link>
								</Space>
							</Col>
						</Row>
						<br />
						<Table
							bordered
							dataSource={dataSource}
							columns={columns}
							pagination={paginationConfig}
						/>
					</Col>

					<Col lg={12} md={12} xs={12}>
						<Table
							bordered
							loading={isGetIpCountListFetching}
							dataSource={ipCountList}
							columns={ipCountColumns}
							pagination={paginationConfig}
						/>
					</Col>

					<Col lg={12} md={12} xs={12}>
						<Table
							bordered
							loading={isGetDeviceListFetching}
							dataSource={deviceList}
							columns={deviceColumns}
							pagination={paginationConfig}
						/>
					</Col>
				</Row>
			</LayoutContent.Card>

			<br />
		</>
	)
}

export default Dashboard

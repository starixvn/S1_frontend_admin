import { LayoutContent } from 'app/pages/layout'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import {
	Col,
	Descriptions,
	Divider,
	Form,
	message,
	Row,
	Spin,
	TablePaginationConfig,
	Typography,
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
	useLazyGetIpUserQuery,
	useLazyGetDeviceUserListQuery,
} from 'features/memberProfile/api'
import { numberFormatter } from 'common/utils/format'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	IFinancialLogsResponse,
	IGetIpUserListResponse,
} from 'features/memberProfile/type'
import { PAGINATION, useModal, usePagination } from 'common/hooks'
import { dateRangeToUtcFormatter, isPositiveNum } from 'common/utils'
import { useEffect } from 'react'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { AffixButtons } from 'components/AffixButtons'
import { UserListModal } from 'features/memberProfile/pages/customerInfo/components/UserListModal'
import FinancialLogsTable from './FinancialLogsTable'
import WinLossSummaryDescriptions from './WinLossSummaryDescriptions'
import IpCountsTable from './IpCountsTable'
import DeviceListTable from './DeviceListTable'
import TodayInfoDescriptions from './TodayInfoDescriptions'
import TpWalletDescriptions from './TpWalletDescriptions'
import BonusWalletDescriptions from './BonusWalletDescriptions'
import WinLossInfoDescriptions from './WinLossInfoDescriptions'

const { Text } = Typography

const Dashboard = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const { timeZoneUtcOffset } = useTimeZone()
	const [financialLogsForm] = Form.useForm<{ financialType: number }>()

	// ipUser 關聯彈窗
	const ipUserListModal = useModal()
	// deviceList 關聯彈窗
	const deviceUserModal = useModal()

	const {
		data: { data: typeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'FinancialType' })

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

	// 取得 IP 關聯 User
	const [
		getIpUser,
		{
			data: { data: ipUserList = [] } = {} as IGetIpUserListResponse,
			isFetching: isGetIpUserListLoading,
		},
	] = useLazyGetIpUserQuery()

	// 取得 Device 關聯 User
	const [
		getDeviceUserList,
		{
			data: { data: deviceUserList = [] } = {},
			isFetching: isGetDeviceUserLoading,
		},
	] = useLazyGetDeviceUserListQuery()

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

	const handleFinanceLogTableChange = async (
		newPagination: TablePaginationConfig
	) => {
		const { current, pageSize } = newPagination

		await handleFinancialLogsSearch({
			current,
			pageSize,
		})
	}

	//  顯示 ip 關聯帳號彈窗
	const handleIpAccountClick = async (ip: string) => {
		ipUserListModal.onOpen()
		try {
			await getIpUser({ ip }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 顯示 Device 關聯帳號彈窗
	const handleAccountClick = async (deviceId: string) => {
		deviceUserModal.onOpen()
		if (!custId) return
		try {
			await getDeviceUserList({ custId, deviceId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
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
						{/* <Descriptions size='small' layout='vertical' bordered column={4}>
							<Descriptions.Item label='NGR'>N/A</Descriptions.Item>
							<Descriptions.Item label='VOD'>N/A</Descriptions.Item>
							<Descriptions.Item label='Member'>N/A</Descriptions.Item>
							<Descriptions.Item label='Company Margin'>N/A</Descriptions.Item>
						</Descriptions> */}
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
									<Text
										type={
											isPositiveNum(walletBalanceInfo?.balance || 0)
												? undefined
												: 'danger'
										}
									>
										{numberFormatter.format(walletBalanceInfo?.balance || 0)}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_RemainingTurnover')}>
									<Text
										type={
											isPositiveNum(walletBalanceInfo?.remainingTurnOver || 0)
												? undefined
												: 'danger'
										}
									>
										{numberFormatter.format(
											walletBalanceInfo?.remainingTurnOver || 0
										)}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_EligibleWithdrawal')}>
									<Text
										type={
											isPositiveNum(walletBalanceInfo?.eligibleWithdrawal || 0)
												? undefined
												: 'danger'
										}
									>
										{numberFormatter.format(
											walletBalanceInfo?.eligibleWithdrawal || 0
										)}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_DepositSummary')}>
									<Text
										type={
											isPositiveNum(walletBalanceInfo?.depositSum || 0)
												? undefined
												: 'danger'
										}
									>
										{numberFormatter.format(walletBalanceInfo?.depositSum || 0)}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_WithdrawalSummary')}>
									<Text
										type={
											isPositiveNum(walletBalanceInfo?.withdrawlSum || 0)
												? undefined
												: 'danger'
										}
									>
										{numberFormatter.format(
											walletBalanceInfo?.withdrawlSum || 0
										)}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_PaymentFee')}>
									<Text
										type={
											isPositiveNum(walletBalanceInfo?.paymentFee || 0)
												? undefined
												: 'danger'
										}
									>
										{numberFormatter.format(walletBalanceInfo?.paymentFee || 0)}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_TotalAdjustment')}>
									<Text
										type={
											isPositiveNum(walletBalanceInfo?.totalAdjustment || 0)
												? undefined
												: 'danger'
										}
									>
										{numberFormatter.format(
											walletBalanceInfo?.totalAdjustment || 0
										)}
									</Text>
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
							loading={isGetFinancialLogsFetching || isGetTypeListLoading}
							dataSource={financialLogs}
							pagination={financialLogsPagination as TablePaginationConfig}
							typeList={typeList}
							onFinancialLogsSearch={handleFinancialLogsSearch}
							timeZoneUtcOffset={timeZoneUtcOffset}
							onTableChange={handleFinanceLogTableChange}
						/>
					</Col>

					<Col lg={12} md={12} xs={12}>
						<IpCountsTable
							loading={isGetIpCountListFetching}
							ipCountList={ipCountList ?? []}
							onAccountClick={handleIpAccountClick}
						/>
					</Col>

					<Col lg={12} md={12} xs={12}>
						<DeviceListTable
							loading={isGetDeviceListFetching}
							deviceList={deviceList ?? []}
							timeZoneUtcOffset={timeZoneUtcOffset}
							onAccountClick={handleAccountClick}
						/>
					</Col>
				</Row>
			</LayoutContent.Card>
			{/* IP User */}
			<UserListModal
				loading={isGetIpUserListLoading}
				userList={ipUserList}
				visible={ipUserListModal.visible}
				onCancel={ipUserListModal.onCancel}
			/>
			{/* Device User */}
			<UserListModal
				loading={isGetDeviceUserLoading}
				userList={deviceUserList}
				visible={deviceUserModal.visible}
				onCancel={deviceUserModal.onCancel}
			/>

			<br />

			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</>
	)
}

export default Dashboard

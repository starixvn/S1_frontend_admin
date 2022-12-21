import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import {
	useGetBasicInfoQuery,
	useGetDeviceListQuery,
	useGetIpCountListQuery,
	useGetWalletBalanceInfoQuery,
} from 'features/memberProfile/api'
import {
	IGetBasicInfoData,
	IGetDeviceData,
	IGetIpCountData,
} from 'features/memberProfile/type'
import { find, head, last } from 'lodash'
import { useGetCustInfoDetailQuery } from 'common/service/commonApi/api'
import { ICustInfoDetailPromotion } from 'common/service/commonApi/type'

export interface IMemberInfo extends IGetBasicInfoData {
	currencyId: number | undefined
	mailWalletAmount: number | undefined
	eligibleWithdrawal: number | undefined
	newestDeviceScore: IGetDeviceData | undefined
	newestIpList: IGetIpCountData | undefined
	newestPromotions: ICustInfoDetailPromotion | undefined
	totalBonusAmount: number | undefined
	totalDeposit: number | undefined
	totalWithdrawal: number | undefined
	totalWinLoss: number
}

const useMemberInfo = ({ custId }: { custId: number }) => {
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const {
		data: { data: originMemberInfo } = {},
		isFetching: isGetMemberInfoLoading,
	} = useGetBasicInfoQuery({ custId }, { skip: !custId })

	const { currencyId } =
		find(currencyListBySite, {
			isoCode: originMemberInfo?.currency,
		}) ?? {}

	const {
		data: { data: walletBalanceInfo } = {},
		isFetching: isGetWalletBalanceInfoFetching,
	} = useGetWalletBalanceInfoQuery({ custId }, { skip: !custId })

	const {
		data: { data: deviceList = [] } = {},
		isFetching: isGetDeviceListFetching,
	} = useGetDeviceListQuery({ custId }, { skip: !custId })

	const {
		data: { data: ipCountList = [] } = {},
		isFetching: isGetIpCountListFetching,
	} = useGetIpCountListQuery({ custId }, { skip: !custId })

	const {
		data: { data: custInfoDetail } = {},
		isFetching: isGetCustInfoDetailFetching,
	} = useGetCustInfoDetailQuery(
		{
			custId,
		},
		{ skip: !custId }
	)

	const { balance: mailWalletAmount, eligibleWithdrawal } =
		walletBalanceInfo ?? {}

	const {
		totalBonusClaimed: totalBonusAmount,
		depositSum: totalDeposit,
		withdrawlSum: totalWithdrawal,
		winnings = 0,
		losses = 0,
		promotions = [],
	} = custInfoDetail ?? {}

	const totalWinLoss = winnings + losses

	// * 取最新一筆的資料
	const newestDeviceScore = head(deviceList)
	const newestIpList = head(ipCountList)
	// * 取最新一筆的資料 , promotions 最新一筆在 last
	const newestPromotions = last(promotions)

	const data = {
		...originMemberInfo,
		currencyId,
		mailWalletAmount,
		eligibleWithdrawal,
		newestDeviceScore,
		newestIpList,
		newestPromotions,
		totalBonusAmount,
		totalDeposit,
		totalWithdrawal,
		totalWinLoss,
	} as IMemberInfo

	const loading =
		isGetMemberInfoLoading ||
		isGetWalletBalanceInfoFetching ||
		isGetDeviceListFetching ||
		isGetCustInfoDetailFetching ||
		isGetIpCountListFetching

	return { memberInfo: data, isMemberInfoLoading: loading }
}

export default useMemberInfo

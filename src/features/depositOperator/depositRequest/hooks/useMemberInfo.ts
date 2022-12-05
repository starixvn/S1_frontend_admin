import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import {
	useGetBasicInfoQuery,
	useGetDeviceListQuery,
	useGetWalletBalanceInfoQuery,
} from 'features/memberProfile/api'
import { IGetBasicInfoData, IGetDeviceData } from 'features/memberProfile/type'
import { find, head } from 'lodash'

export interface IMemberInfo extends IGetBasicInfoData {
	currencyId: number | undefined
	mailWalletAmount: number | undefined
	eligibleWithdrawal: number | undefined
	newestDeviceScore: IGetDeviceData | undefined
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

	const { balance: mailWalletAmount, eligibleWithdrawal } =
		walletBalanceInfo ?? {}

	// * 取最新一筆的資料
	const newestDeviceScore = head(deviceList)

	const data = {
		...originMemberInfo,
		currencyId,
		mailWalletAmount,
		eligibleWithdrawal,
		newestDeviceScore,
	} as IMemberInfo

	const loading =
		isGetMemberInfoLoading ||
		isGetWalletBalanceInfoFetching ||
		isGetDeviceListFetching

	return { memberInfo: data, isMemberInfoLoading: loading }
}

export default useMemberInfo

import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import {
	useGetBasicInfoQuery,
	useGetFpsDeviceListQuery,
	useGetWalletBalanceInfoQuery,
} from 'features/memberProfile/api'
import {
	IGetBasicInfoData,
	IGetFpsDeviceData,
} from 'features/memberProfile/type'
import { find, head } from 'lodash'

export interface IMemberInfo extends IGetBasicInfoData {
	currencyId: number | undefined
	mailWalletAmount: number | undefined
	eligibleWithdrawal: number | undefined
	// newestDeviceScore: IGetDeviceData | undefined
	newestFpsDevice: IGetFpsDeviceData | undefined
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

	// 2024.08.21 Member Info 顯示 Iovation Status 改成顯示 Fps Risk Level，先註解
	// const {
	// 	data: { data: deviceList = [] } = {},
	// 	isFetching: isGetDeviceListFetching,
	// } = useGetDeviceListQuery({ custId }, { skip: !custId })

	const {
		data: { data: fpsDeviceList = [] } = {},
		isFetching: isGetFpsDeviceListFetching,
	} = useGetFpsDeviceListQuery({ custId }, { skip: !custId })

	const { balance: mailWalletAmount, eligibleWithdrawal } =
		walletBalanceInfo ?? {}

	// * 取最新一筆的資料
	// const newestDeviceScore = head(deviceList)
	const newestFpsDevice = head(fpsDeviceList)

	const data = {
		...originMemberInfo,
		currencyId,
		mailWalletAmount,
		eligibleWithdrawal,
		// newestDeviceScore,
		newestFpsDevice,
	} as IMemberInfo

	const loading =
		isGetMemberInfoLoading ||
		isGetWalletBalanceInfoFetching ||
		// isGetDeviceListFetching ||
		isGetFpsDeviceListFetching

	return { memberInfo: data, isMemberInfoLoading: loading }
}

export default useMemberInfo

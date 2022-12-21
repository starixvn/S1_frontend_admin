import { useMemo } from 'react'
import {
	GET_BANK_INFO_OFF_LIST_ARGS,
	useGetBankInfoOffListQuery,
} from 'common/service/baseDataApi'
import { jsonToObject } from 'common/utils/format'
import { find } from 'lodash'
import { useGetDepositInfoByTransIdQuery } from 'features/depositOperator/api'
import {
	IDepositFrom,
	IDepositInfo,
	IDepositOperatorData,
} from 'features/depositOperator/type'

const useDepositInfo = ({
	siteId,
	transId,
}: {
	siteId: number | undefined
	transId: string | undefined
}) => {
	const {
		data: { data: originDepositInfo = {} as IDepositOperatorData } = {},
		isFetching: isDepositInfoLoading,
	} = useGetDepositInfoByTransIdQuery({ transId })

	const { data: { data: bankInfoOffList = [] } = {} } =
		useGetBankInfoOffListQuery(
			{
				siteId,
				currencyId: originDepositInfo.currencyId,
				purpose: GET_BANK_INFO_OFF_LIST_ARGS.PURPOSE.DEPOSIT,
			},
			{
				skip: !originDepositInfo.currencyId,
			}
		)

	// * 針對 JSON 格次做資料處理
	const depositInfo: IDepositInfo = useMemo(() => {
		const {
			payId,
			sysId,
			accountNo,
			accountName,
			channelName,
			exchangeAmount,
			actualExchangeAmount,
		} = jsonToObject(originDepositInfo.depositInfo) ?? {}
		return {
			payId: Number(payId),
			sysId: Number(sysId),
			accountNo,
			accountName,
			channelName,
			exchangeAmount,
			actualExchangeAmount,
		}
	}, [originDepositInfo])

	// * 針對 JSON 格次做資料處理
	const depositFrom: IDepositFrom = useMemo(() => {
		const { sysId } = jsonToObject(originDepositInfo.depositFrom) ?? {}
		const { bankName, accountName } = find(bankInfoOffList, { sysId }) ?? {}
		return { bankName, accountName, sysId }
	}, [originDepositInfo])

	const data: IDepositOperatorData = {
		...originDepositInfo,
		depositFrom,
		depositInfo,
	}

	return {
		depositInfo: data,
		isDepositInfoLoading,
		bankInfoOffList,
	}
}

export default useDepositInfo

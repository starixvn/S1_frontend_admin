import { isEmpty } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import type {
	IPredictionChallengeReportTransformedData,
	IPredictionChallengeReportData,
} from './type'

// S2C
export const transformMatchData = (
	originalData: IPredictionChallengeReportData[]
): IPredictionChallengeReportTransformedData[] | [] => {
	if (isEmpty(originalData)) return []
	return originalData.map(match => {
		const { responseByCurrency, ...matchWithoutResponseByCurrency } = match
		const { matchId, bonusCode } = match || {}

		return {
			key: uuidv4(),
			...matchWithoutResponseByCurrency,
			children: responseByCurrency.map(currency => {
				const { currencyId } = currency || {}
				// If only one user, don't create children and
				// exclude the first user from childrenData if there are multiple users
				const childrenData =
					currency.responseByUsers.length > 1
						? currency.responseByUsers.slice(1).map(user => ({
								key: uuidv4(),
								userName: user.userName,
								bonus: user.bonus,
								predictTime: user.predictTime,
								custHomeScore: user.custHomeScore,
								custAwayScore: user.custAwayScore,
								predictStatus: user.predictStatus,
								isPayout: user.isPayout,
								depositCount: user.depositCount,
								depositAmount: user.depositAmount,
								custId: user.custId,
								currencyId,
								matchId,
								bonusCodeByClaim: bonusCode,
						  }))
						: undefined

				return {
					key: uuidv4(),
					bonusCode: currency.currency,
					userName: currency.responseByUsers[0]?.userName || '',
					bonus: currency.responseByUsers[0]?.bonus || 0,
					predictTime: currency.responseByUsers[0]?.predictTime || '',
					custHomeScore: currency.responseByUsers[0]?.custHomeScore,
					custAwayScore: currency.responseByUsers[0]?.custAwayScore,
					predictStatus: currency.responseByUsers[0]?.predictStatus || 0,
					isPayout: currency.responseByUsers[0]?.isPayout,
					depositCount: currency.responseByUsers[0]?.depositCount || 0,
					depositAmount: currency.responseByUsers[0]?.depositAmount || 0,
					custId: currency.responseByUsers[0]?.custId || 0,
					currencyId,
					matchId,
					bonusCodeByClaim: bonusCode,
					...(childrenData && { children: childrenData }),
				}
			}),
		}
	})
}

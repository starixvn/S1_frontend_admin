import { ICryptoInfoList } from 'features/withdrawalSubmission/type'
import { find } from 'lodash'

export interface IChannelValue {
	cryptoCurrencyId: number
	cryptoNetwork: string
}

export type ChannelType = Array<{
	value: IChannelValue
	displayName: string
}>

export const channelConverter = (
	cryptoInfoList: ICryptoInfoList
): ChannelType => {
	const { cryptoCurrency, cryptoNetwork } = cryptoInfoList ?? {}
	const result: ChannelType = []

	cryptoNetwork?.forEach(crypto => {
		const currencyName = find(
			cryptoCurrency,
			currency => currency.currencyId === crypto.currencyId
		)?.currencyName

		const channelValue: {
			value: IChannelValue
			displayName: string
		} = {
			value: {
				cryptoCurrencyId: crypto.currencyId,
				cryptoNetwork: crypto.network,
			},
			displayName: `${currencyName}-${crypto.network}`,
		}

		result.push(channelValue)
	})
	return result
}

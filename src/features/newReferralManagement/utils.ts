import {
	ISpecificDetailData,
	ISpecificData,
} from 'features/newReferralManagement/type'

// S2C
export const specificListConverter = (specificList: ISpecificDetailData[]) => {
	return specificList.reduce((acc, cur) => {
		const newAcc: { [lang: string]: ISpecificDetailData } = { ...acc }

		newAcc[cur.langId] = cur
		return newAcc
	}, {})
}

// C2S
export const specificConverter = (
	specific: {
		[lang: string]: {
			bannerUrl: string
			description: string
			detail: string
			title: string
			langId: string
			type: number
		}
	} = {}
) => {
	const specificList = Object.keys(specific).map(langId => {
		const { bannerUrl, title, description, detail } = specific?.[langId] ?? {}

		return {
			langId,
			bannerUrl,
			title,
			description,
			detail,
		}
	})

	return specificList as ISpecificData[]
}

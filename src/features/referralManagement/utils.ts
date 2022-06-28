import { SpecificState } from './type'

export const coverSpecificListToSpecific = (specificList: SpecificState[]) => {
	const specific = specificList.reduce((acc, cur) => {
		const newAcc: { [lang: string]: SpecificState } = { ...acc }

		newAcc[cur.langId] = cur

		return newAcc
	}, {})

	return specific
}

export const coverSpecificToSpecificList = (specific: any) => {
	const specificList = Object.keys(specific ?? {})?.map(langId => {
		const { bannerUrl, title, description, detail } = specific?.[langId] ?? {}

		return {
			langId,
			bannerUrl,
			title,
			description,
			detail,
		}
	})

	return specificList as SpecificState[]
}

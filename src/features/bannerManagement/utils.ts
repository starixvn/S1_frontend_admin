import { assign } from 'lodash'

export const coverSpecificToObjString = (specific: any) => {
	const allData = {}
	Object.keys(specific ?? {})?.map(langId => {
		const specificData = specific[langId] ?? {}

		return assign(allData, {
			[langId]: specificData,
		})
	})
	return JSON.stringify(allData)
}

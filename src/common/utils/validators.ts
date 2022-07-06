export const isJSON = (item: any) => {
	if (item === null) return false
	try {
		JSON.parse(item)
		return true
	} catch (e) {
		return false
	}
}

// Convert to JSON
// Send to API
export const JSONConverter = (item: object) => {
	let obj = {}

	Object.entries(item).forEach(([key, value]: [string, any]) => {
		const textValue = Object.values(value)[0]
		const newObj = { [key]: textValue }
		obj = { ...obj, ...newObj }
	})

	return JSON.stringify(obj)
}

// Receive API Response
// JSON Convert to Object
export const JSONParser = ({ key, value }: { key: string; value: string }) => {
	const rawData = JSON.parse(value)
	let obj = {}

	Object.entries(rawData).forEach(([objKey, objValue]: [string, any]) => {
		const newObj = { [objKey]: { [key]: objValue } }
		obj = { ...obj, ...newObj }
	})

	return obj
}

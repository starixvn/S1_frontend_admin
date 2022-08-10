export const concatStrings = (target: string[]): string => {
	let result = ''
	target.forEach((value, index) => {
		if (index === target.length - 1) {
			result += `${value}`
		} else {
			result += `${value} & `
		}
	})
	return result
}

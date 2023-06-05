export const formatNumber = (num: number) => {
	const str = num.toString()
	const parts = str.split('.')
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return parts.join('.')
}

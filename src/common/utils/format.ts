export const numberFormatter = new Intl.NumberFormat('en', {
	maximumFractionDigits: 0,
	minimumFractionDigits: 0,
})

export const percentageFormatter = (percentage: number, point = 2): string => {
	return `${percentage.toFixed(point)}% `
}
export const timeFormat = 'YYYY-MM-DD  HH:mm:ss'

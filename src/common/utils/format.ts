import { isJSON } from 'common/utils/validators'
import { camelCase, isObject, mapKeys, isNull, isUndefined } from 'lodash'

export const numberFormatter = new Intl.NumberFormat('en', {
	maximumFractionDigits: 0,
	minimumFractionDigits: 0,
})

// 數字 format 到特定小數點，預設為第二位
export const numFormatToDigits = (value: number, digits = 2, minimumFractionDigits = 0): string => {
	if (isNull(value) || isUndefined(value)) return '0'
	const formatter = new Intl.NumberFormat('en', {
		maximumFractionDigits: digits,
		minimumFractionDigits,
	})
	return formatter.format(Number(value.toFixed(digits)))
}

export const percentageFormatter = (percentage: number, point = 2): string => {
	return `${percentage.toFixed(point)}% `
}
export const timeFormat = 'YYYY-MM-DD  HH:mm:ss'

export const dateFormat = 'YYYY/MM/DD'

export const jsonToObject = <Type>(data: Type): Type => {
	const parseData = isJSON(data) && JSON.parse(data as any)
	return isObject(parseData)
		? // * JSON 轉回來的物件通常 key 皆為大駝峰，故轉回小駝峰使用
		  mapKeys(parseData, (_, key) => camelCase(key))
		: ({} as any)
}

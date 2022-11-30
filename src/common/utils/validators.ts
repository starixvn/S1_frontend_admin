import { gte } from 'lodash'

export const isJSON = (item: any) => {
	if (item === null) return false
	try {
		JSON.parse(item)
		return true
	} catch (e) {
		return false
	}
}

// 檢查是否為正數 , input number or string number
export const isPositiveNum = (value: number | string) => {
	return gte(Number(value), 0)
}

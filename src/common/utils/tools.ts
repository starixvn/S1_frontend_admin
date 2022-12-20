// 多重比對 , 可用在條件渲染時  A = B | C | D 時顯示
// 第一個參數放 value 第二個放 條件 使用 Array 把所有該條件的參數放進 Array
import { assign, isNumber } from 'lodash'

export const multiEqual = <T>(value: T, others: Array<T>): boolean => {
	for (let i = 0; i <= others.length - 1; i += 1) {
		if (others[i] === value) {
			return true
		}
	}
	return false
}

// 放入 target 陣列後會加總出總額 , 可單獨取此物件做渲染或是塞回 target 陣列中
// 僅會對 number 的資料做加總 , 字串資料如：title , date , operator..etc 將不會放回 result
export const sumTotalObject = (target: object[]) => {
	if (target.length === 0) return {}
	const result: any = {}
	target.forEach(item => {
		Object.entries(item).forEach(([key, value]) => {
			if (!isNumber(value)) return
			if (result[key]) {
				const sumValue = result[key] + value
				assign(result, { [key]: sumValue })
			} else {
				assign(result, { [key]: value })
			}
		})
	})
	return result
}

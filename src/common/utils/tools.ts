import { assign, includes, isNumber } from 'lodash'

// 多重比對 , 可用在條件渲染時  A = B | C | D 時顯示
// 第一個參數放 value 第二個放 條件 使用 Array 把所有該條件的參數放進 Array
export const multiEqual = <T>(value: T, others: Array<T>): boolean => {
	for (let i = 0; i <= others.length - 1; i += 1) {
		if (others[i] === value) {
			return true
		}
	}
	return false
}

// 比對多個 value 是否 includes 於目標陣列, 如果有一 include 回傳 true , 全部都不包含則回傳 false
// param1 : 放目標陣列 , param2 放入要比對的資料 Array
// example : multiIncludes(supportChannels, [ SupportChannelEnum.EWallet, SupportChannelEnum.QRPay,])
export const multiIncludes = <T>(
	target: Array<T>,
	value: Array<T>
): boolean => {
	for (let i = 0; i <= value.length - 1; i += 1) {
		if (includes(target, value[i])) {
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

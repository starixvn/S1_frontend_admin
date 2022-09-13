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

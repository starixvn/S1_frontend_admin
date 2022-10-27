// 用來轉換 fixedAmount 欄位 , 因 api 吃 number[] , 而前台輸入時是用字串輸入
import { isNull, isNaN } from 'lodash'

export class FixedAmountConverter {
	// 將陣列轉成字串顯示
	static S2C(target: number[]): string {
		if (!target || target?.length === 0) return ''
		let result = ''

		target.forEach((value: number, idx) => {
			if (idx !== target.length - 1) {
				result += `${value},`
			} else {
				result += `${value}`
			}
		})

		return result
	}

	static C2S(target: string): number[] {
		// 移除多餘空白並去頭去尾這樣 split 才可以正常運作
		let result = target.trim()

		if (result[0] === ',') {
			result = result.slice(1)
		}

		if (result[result.length - 1] === ',') {
			result = result.slice(0, result.length - 2)
		}

		return result.split(',').map((value: string) => Number(value))
	}

	static Validator(target: string) {
		// 辨識資料是否符合規定
		let result = false

		FixedAmountConverter.C2S(target).forEach(value => {
			if (isNaN(value) || isNull(value)) {
				result = true
			}
		})

		return result
	}
}

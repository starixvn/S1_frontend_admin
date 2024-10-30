/** 隱藏電話號碼 (根據電話號碼的長度生成相同數量的星號)
 *  @param {string} phoneNumber 電話號碼
 *  @example "0985658595" -> "**********" */
export const maskPhoneNumber = (phoneNumber: string) => {
	return '*'.repeat(phoneNumber.length)
}

/** 隱藏電子信箱 (根據＠前面的長度生成相同數量的星號)
 *  @param {string} email 電話號碼
 *  @example "123456@gmail.com" -> "******@gmail.com" */
export const maskEmail = (email: string) => {
	// 隱藏郵件地址的 @ 前部分，顯示相同數量的星號
	const [localPart, domain] = email.split('@')
	const maskedLocalPart = '*'.repeat(localPart.length)
	return `${maskedLocalPart}@${domain}`
}
